import os
import random
from flask import Blueprint, request, jsonify, current_app
from datetime import datetime

from .menu_data import menu_items

api = Blueprint('api', __name__, url_prefix='/api')

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')
TOTAL_TABLES = 30

def is_db_connected():
    return current_app.config.get('DB_CONNECTED', False)

@api.route('/menu', methods=['GET'])
def get_menu():
    return jsonify(menu_items)

@api.route('/newsletter', methods=['POST'])
def subscribe_newsletter():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({'message': 'Email is required'}), 400
        
        email = data['email']
        
        if is_db_connected():
            from .database import db
            from .models import NewsletterSubscriber
            existing = db.session.query(NewsletterSubscriber).filter_by(email=email).first()
            if existing:
                return jsonify({'message': 'Email already subscribed'}), 409
            
            subscriber = NewsletterSubscriber(email=email)
            db.session.add(subscriber)
            db.session.commit()
            
            return jsonify({
                'message': 'Subscription successful',
                'subscriber': subscriber.to_dict()
            }), 201
        else:
            from .storage import storage
            existing = storage.get_newsletter_subscriber_by_email(email)
            if existing:
                return jsonify({'message': 'Email already subscribed'}), 409
            
            subscriber = storage.create_newsletter_subscriber(email)
            return jsonify({
                'message': 'Subscription successful',
                'subscriber': subscriber.to_dict()
            }), 201
        
    except Exception as e:
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
    except Exception as e:
        return jsonify({'message': 'An error occurred while fetching reservations'}), 500

@api.route('/reservations/availability', methods=['GET'])
def check_availability():
    try:
        date_str = request.args.get('date')
        time = request.args.get('time')
        
        if not date_str or not time:
            return jsonify({'message': 'Date and time are required'}), 400
        
        try:
            reservation_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'message': 'Invalid date format'}), 400
        
        if is_db_connected():
            from .database import db
            from .models import Reservation
            booked_count = db.session.query(Reservation).filter_by(
                date=reservation_date, time=time
            ).count()
            available_tables = TOTAL_TABLES - booked_count
        else:
            from .storage import storage
            available_tables = len(storage.get_available_tables_for_time_slot(reservation_date, time))
        
        return jsonify({
            'available': available_tables > 0,
            'availableTables': available_tables,
            'totalTables': TOTAL_TABLES
        })
    except Exception as e:
        return jsonify({'message': 'An error occurred while checking availability'}), 500

@api.route('/reservations', methods=['POST'])
def create_reservation():
    try:
        data = request.get_json()
        
        required_fields = ['name', 'email', 'phone', 'date', 'time', 'guests']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        try:
            reservation_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'message': 'Invalid date format'}), 400
        
        time = data['time']
        
        if is_db_connected():
            from .database import db
            from .models import Reservation
            
            booked_tables = db.session.query(Reservation.table_number).filter_by(
                date=reservation_date, time=time
            ).all()
            booked_table_numbers = {t[0] for t in booked_tables}
            
            all_tables = set(range(1, TOTAL_TABLES + 1))
            available_tables = list(all_tables - booked_table_numbers)
            
            if not available_tables:
                return jsonify({
                    'message': 'Sorry, this time slot is fully booked. Please select a different time.',
                    'error': 'TIME_SLOT_FULL'
                }), 409
            
            table_number = random.choice(available_tables)
            
            reservation = Reservation(
                name=data['name'],
                email=data['email'],
                phone=data['phone'],
                date=reservation_date,
                time=time,
                guests=int(data['guests']),
                table_number=table_number,
                special_requests=data.get('specialRequests')
            )
            db.session.add(reservation)
            db.session.commit()
            
            return jsonify({
                'message': f'Reservation successful! You have been assigned Table {table_number}.',
                'reservation': reservation.to_dict()
            }), 201
        else:
            from .storage import storage
            
            if not storage.is_time_slot_available(reservation_date, time):
                return jsonify({
                    'message': 'Sorry, this time slot is fully booked. Please select a different time.',
                    'error': 'TIME_SLOT_FULL'
                }), 409
            
            reservation = storage.create_reservation(
                name=data['name'],
                email=data['email'],
                phone=data['phone'],
                reservation_date=reservation_date,
                time=time,
                guests=int(data['guests']),
                special_requests=data.get('specialRequests')
            )
            
            if reservation is None:
                return jsonify({
                    'message': 'Sorry, this time slot is fully booked. Please select a different time.',
                    'error': 'TIME_SLOT_FULL'
                }), 409
            
            return jsonify({
                'message': f'Reservation successful! You have been assigned Table {reservation.table_number}.',
                'reservation': reservation.to_dict()
            }), 201
        
    except Exception as e:
        if is_db_connected():
            from .database import db
            db.session.rollback()
        return jsonify({'message': 'An error occurred while processing your request'}), 500

@api.route('/reservations/<int:id>', methods=['GET'])
def get_reservation(id):
    try:
        if is_db_connected():
            from .database import db
            from .models import Reservation
            reservation = db.session.query(Reservation).get(id)
            if not reservation:
                return jsonify({'message': 'Reservation not found'}), 404
            return jsonify(reservation.to_dict())
        else:
            from .storage import storage
            reservation = storage.get_reservation(id)
            if not reservation:
                return jsonify({'message': 'Reservation not found'}), 404
            return jsonify(reservation.to_dict())
    except Exception as e:
        return jsonify({'message': 'An error occurred while fetching the reservation'}), 500

@api.route('/reservations/<int:id>', methods=['DELETE'])
def delete_reservation(id):
    try:
        if is_db_connected():
            from .database import db
            from .models import Reservation
            reservation = db.session.query(Reservation).get(id)
            if not reservation:
                return jsonify({'message': 'Reservation not found'}), 404
            
            db.session.delete(reservation)
            db.session.commit()
            
            return jsonify({'message': 'Reservation cancelled successfully'})
        else:
            from .storage import storage
            success = storage.delete_reservation(id)
            if not success:
                return jsonify({'message': 'Reservation not found'}), 404
            
            return jsonify({'message': 'Reservation cancelled successfully'})
    except Exception as e:
        if is_db_connected():
            from .database import db
            db.session.rollback()
        return jsonify({'message': 'An error occurred while cancelling the reservation'}), 500

@api.route('/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        
        if not data or 'password' not in data:
            return jsonify({'message': 'Password is required'}), 400
        
        if data['password'] == ADMIN_PASSWORD:
            return jsonify({'success': True, 'message': 'Login successful'})
        else:
            return jsonify({'success': False, 'message': 'Invalid password'}), 401
            
    except Exception as e:
        return jsonify({'message': 'An error occurred'}), 500
