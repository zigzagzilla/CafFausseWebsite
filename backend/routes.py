import os
import random
from datetime import datetime, timedelta

from flask import Blueprint, request, jsonify, current_app
from sqlalchemy import select, and_, or_
from sqlalchemy.exc import IntegrityError

from .menu_data import menu_items

api = Blueprint('api', __name__, url_prefix='/api')

ADMIN_PASSWORD = "admin123"
TOTAL_TABLES = 30
RESTAURANT_PHONE = "202-555-4567"
DUPLICATE_WINDOW_MINUTES = 119  # 1 hour 59 minutes


def is_db_connected():
    return current_app.config.get('DB_CONNECTED', False)


@api.route('/menu', methods=['GET'])
def get_menu():
    return jsonify(menu_items)


@api.route('/newsletter', methods=['POST'])
def subscribe_newsletter():
    """Subscribe an email address to the newsletter.

    SRS alignment: newsletter signup is stored in the Customers table (newsletter_signup=True).
    """
    try:
        data = request.get_json() or {}
        email = (data.get('email') or '').strip().lower()
        if not email:
            return jsonify({'message': 'Email is required'}), 400

        if is_db_connected():
            from .database import db
            from .models import Customer

            customer = db.session.execute(
                select(Customer).where(Customer.email_address == email)
            ).scalar_one_or_none()

            if customer:
                customer.newsletter_signup = True
            else:
                customer = Customer(
                    customer_name="",
                    email_address=email,
                    phone_number=None,
                    newsletter_signup=True,
                )
                db.session.add(customer)

            db.session.commit()
            return jsonify({'message': 'Subscription successful', 'customer': customer.to_dict()}), 201
        else:
            from .storage import storage
            customer = storage.subscribe_newsletter(email)
            return jsonify({'message': 'Subscription successful', 'customer': customer.to_dict()}), 201

    except Exception:
        if is_db_connected():
            from .database import db
            db.session.rollback()
        return jsonify({'message': 'An error occurred while processing your request'}), 500


@api.route('/reservations', methods=['GET'])
def get_reservations():
    try:
        if is_db_connected():
            from .database import db
            from .models import Reservation
            reservations = db.session.query(Reservation).order_by(Reservation.created_at.desc()).all()
            return jsonify([r.to_dict() for r in reservations])
        else:
            from .storage import storage
            reservations = storage.get_reservations()
            return jsonify([r.to_dict() for r in reservations])
    except Exception:
        return jsonify({'message': 'An error occurred while fetching reservations'}), 500


def _parse_time_slot(value: str) -> datetime:
    """Parse an ISO-8601 datetime string into a datetime."""
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        raise ValueError('Invalid time_slot format. Expected ISO string like 2026-01-06T19:00:00')


def _parse_legacy_date_time(date_str: str, time_label: str) -> datetime:
    """Fallback for older UI payloads that send separate date + time."""
    # date_str: YYYY-MM-DD
    try:
        d = datetime.strptime(date_str, '%Y-%m-%d').date()
    except Exception:
        raise ValueError('Invalid date format')

    m = (time_label or '').strip().upper()
    # Expected like "5:00 PM"
    try:
        t = datetime.strptime(m, '%I:%M %p').time()
    except Exception:
        raise ValueError('Invalid time format')

    return datetime.combine(d, t)


def _check_duplicate_reservation(db, email, phone, time_slot):
    """Check for existing reservation within 1 hour 59 minutes for same email or phone."""
    from .models import Customer, Reservation
    
    time_window_start = time_slot - timedelta(minutes=DUPLICATE_WINDOW_MINUTES)
    time_window_end = time_slot + timedelta(minutes=DUPLICATE_WINDOW_MINUTES)
    
    conditions = []
    
    customer_by_email = db.session.execute(
        select(Customer).where(Customer.email_address == email)
    ).scalar_one_or_none()
    
    if customer_by_email:
        conditions.append(Reservation.customer_id == customer_by_email.customer_id)
    
    if phone:
        customers_by_phone = db.session.execute(
            select(Customer).where(Customer.phone_number == phone)
        ).scalars().all()
        for c in customers_by_phone:
            conditions.append(Reservation.customer_id == c.customer_id)
    
    if not conditions:
        return None
    
    existing = db.session.execute(
        select(Reservation).where(
            and_(
                Reservation.time_slot >= time_window_start,
                Reservation.time_slot <= time_window_end,
                or_(*conditions)
            )
        ).limit(1)
    ).scalar_one_or_none()
    
    return existing


def _find_sequential_tables(available_tables, count=2):
    """Find sequential available table numbers."""
    available_set = set(available_tables)
    for t in sorted(available_tables):
        if all((t + i) in available_set for i in range(count)):
            return [t + i for i in range(count)]
    return None


@api.route('/reservations', methods=['POST'])
def create_reservation():
    """Create a reservation with table assignment.

    SRS alignment:
    - time_slot is a single logical value
    - max 30 tables per time slot
    - assign a random available table (1..30)
    - phone is optional
    - parties > 4 get 2 sequential tables
    - duplicate detection: no reservation within 2 hours for same email/phone
    """
    try:
        data = request.get_json() or {}

        name = (data.get('name') or '').strip()
        email = (data.get('email') or '').strip().lower()
        phone = (data.get('phone') or '').strip() or None
        time_slot_raw = (data.get('time_slot') or data.get('timeSlot') or '').strip()
        guests = int(data.get('guests') or 2)
        special_requests = data.get('specialRequests')

        if not name:
            return jsonify({'message': 'name is required'}), 400
        if not email:
            return jsonify({'message': 'email is required'}), 400
        if time_slot_raw:
            try:
                time_slot = _parse_time_slot(time_slot_raw)
            except ValueError as e:
                return jsonify({'message': str(e)}), 400
        else:
            legacy_date = (data.get('date') or '').strip()
            legacy_time = (data.get('time') or '').strip()
            if not legacy_date or not legacy_time:
                return jsonify({'message': 'time_slot is required'}), 400
            try:
                time_slot = _parse_legacy_date_time(legacy_date, legacy_time)
            except ValueError as e:
                return jsonify({'message': str(e)}), 400

        tables_needed = 2 if guests > 4 else 1

        if is_db_connected():
            from .database import db
            from .models import Customer, Reservation

            existing_reservation = _check_duplicate_reservation(db, email, phone, time_slot)
            if existing_reservation:
                existing_time = existing_reservation.time_slot.strftime('%B %d, %Y at %I:%M %p')
                return jsonify({
                    'message': f'You already have a reservation on {existing_time}. '
                               f'To make changes, please call the restaurant at {RESTAURANT_PHONE}.'
                }), 409

            customer = db.session.execute(
                select(Customer).where(Customer.email_address == email)
            ).scalar_one_or_none()

            if customer:
                customer.customer_name = name
                if phone is not None:
                    customer.phone_number = phone
            else:
                customer = Customer(
                    customer_name=name,
                    email_address=email,
                    phone_number=phone,
                    newsletter_signup=False,
                )
                db.session.add(customer)
                db.session.flush()

            primary_tables = db.session.execute(
                select(Reservation.table_number).where(Reservation.time_slot == time_slot)
            ).scalars().all()
            additional_tables = db.session.execute(
                select(Reservation.additional_table).where(
                    and_(Reservation.time_slot == time_slot, Reservation.additional_table.isnot(None))
                )
            ).scalars().all()
            taken_tables = set(primary_tables) | set(additional_tables)

            available = [t for t in range(1, TOTAL_TABLES + 1) if t not in taken_tables]

            if len(available) < tables_needed:
                return jsonify({'message': 'This time slot is fully booked. Please pick another time.'}), 409

            if tables_needed == 2:
                assigned_tables = _find_sequential_tables(available, 2)
                if not assigned_tables:
                    return jsonify({
                        'message': 'No sequential tables available for your party size. '
                                   f'Please call the restaurant at {RESTAURANT_PHONE} for assistance.'
                    }), 409
            else:
                assigned_tables = [random.choice(available)]

            reservation = Reservation(
                customer_id=customer.customer_id,
                time_slot=time_slot,
                table_number=assigned_tables[0],
                additional_table=assigned_tables[1] if len(assigned_tables) > 1 else None,
                guests=guests,
                special_requests=special_requests,
            )
            db.session.add(reservation)

            try:
                db.session.commit()
            except IntegrityError:
                db.session.rollback()
                return jsonify({'message': 'Please retry; availability just changed.'}), 409

            table_display = ", ".join(str(t) for t in assigned_tables)
            result = reservation.to_dict()
            result['tableNumber'] = table_display
            
            return jsonify({'message': 'Reservation successful', 'reservation': result}), 201

        else:
            from .storage import storage
            try:
                existing = storage.check_duplicate_reservation(email, phone, time_slot)
                if existing:
                    existing_time = existing.time_slot.strftime('%B %d, %Y at %I:%M %p')
                    return jsonify({
                        'message': f'You already have a reservation on {existing_time}. '
                                   f'To make changes, please call the restaurant at {RESTAURANT_PHONE}.'
                    }), 409

                reservation = storage.create_reservation(
                    customer_name=name,
                    email_address=email,
                    phone_number=phone,
                    time_slot=time_slot,
                    guests=guests,
                    special_requests=special_requests,
                )
            except ValueError as e:
                return jsonify({'message': str(e)}), 409

            return jsonify({'message': 'Reservation successful', 'reservation': reservation.to_dict()}), 201

    except Exception as e:
        if is_db_connected():
            from .database import db
            db.session.rollback()
        return jsonify({'message': 'An error occurred while processing your request'}), 500


@api.route('/reservations/<int:reservation_id>', methods=['GET'])
def get_reservation(reservation_id):
    try:
        if is_db_connected():
            from .database import db
            from .models import Reservation
            reservation = db.session.get(Reservation, reservation_id)
            if not reservation:
                return jsonify({'message': 'Reservation not found'}), 404
            return jsonify(reservation.to_dict())
        else:
            from .storage import storage
            reservation = storage.get_reservation(reservation_id)
            if not reservation:
                return jsonify({'message': 'Reservation not found'}), 404
            return jsonify(reservation.to_dict())
    except Exception:
        return jsonify({'message': 'An error occurred while fetching the reservation'}), 500


@api.route('/reservations/<int:reservation_id>', methods=['DELETE'])
def delete_reservation(reservation_id):
    try:
        if is_db_connected():
            from .database import db
            from .models import Reservation
            reservation = db.session.get(Reservation, reservation_id)
            if not reservation:
                return jsonify({'message': 'Reservation not found'}), 404

            db.session.delete(reservation)
            db.session.commit()
            return jsonify({'message': 'Reservation cancelled successfully'})
        else:
            from .storage import storage
            success = storage.delete_reservation(reservation_id)
            if not success:
                return jsonify({'message': 'Reservation not found'}), 404
            return jsonify({'message': 'Reservation cancelled successfully'})
    except Exception:
        if is_db_connected():
            from .database import db
            db.session.rollback()
        return jsonify({'message': 'An error occurred while cancelling the reservation'}), 500


@api.route('/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json() or {}
        if 'password' not in data:
            return jsonify({'message': 'Password is required'}), 400

        if data['password'] == ADMIN_PASSWORD:
            return jsonify({'success': True, 'message': 'Login successful'})
        return jsonify({'success': False, 'message': 'Invalid password'}), 401
    except Exception:
        return jsonify({'message': 'An error occurred'}), 500
