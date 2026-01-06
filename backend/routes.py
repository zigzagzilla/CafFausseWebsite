import os
import random
from datetime import datetime

from flask import Blueprint, request, jsonify, current_app
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from .menu_data import menu_items

api = Blueprint('api', __name__, url_prefix='/api')

ADMIN_PASSWORD = "admin123"
TOTAL_TABLES = 30


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


@api.route('/reservations', methods=['POST'])
def create_reservation():
    """Create a reservation with table assignment.

    SRS alignment:
    - time_slot is a single logical value
    - max 30 tables per time slot
    - assign a random available table (1..30)
    - phone is optional
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
        # Backward compatible: accept either a single time_slot OR legacy date+time
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

        if is_db_connected():
            from .database import db
            from .models import Customer, Reservation

            # Upsert customer by email
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
                db.session.flush()  # assigns customer_id

            # Find which tables are already booked for that slot
            taken_tables = db.session.execute(
                select(Reservation.table_number).where(Reservation.time_slot == time_slot)
            ).scalars().all()

            if len(taken_tables) >= TOTAL_TABLES:
                return jsonify({'message': 'This time slot is fully booked. Please pick another time.'}), 409

            available = [t for t in range(1, TOTAL_TABLES + 1) if t not in set(taken_tables)]
            table_number = random.choice(available)

            reservation = Reservation(
                customer_id=customer.customer_id,
                time_slot=time_slot,
                table_number=table_number,
                guests=guests,
                special_requests=special_requests,
            )
            db.session.add(reservation)

            try:
                db.session.commit()
            except IntegrityError:
                db.session.rollback()
                return jsonify({'message': 'Please retry; availability just changed.'}), 409

            return jsonify({'message': 'Reservation successful', 'reservation': reservation.to_dict()}), 201

        else:
            from .storage import storage
            try:
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

    except Exception:
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
