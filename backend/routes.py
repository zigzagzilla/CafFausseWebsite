from flask import Blueprint, request, jsonify
from datetime import datetime
from .models import db, Reservation, NewsletterSubscriber
from .menu_data import menu_items

api = Blueprint('api', __name__, url_prefix='/api')

ADMIN_PASSWORD = "admin123"

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
        
        existing = NewsletterSubscriber.query.filter_by(email=email).first()
        if existing:
            return jsonify({'message': 'Email already subscribed'}), 409
        
        subscriber = NewsletterSubscriber(email=email)
        db.session.add(subscriber)
        db.session.commit()
        
        return jsonify({
            'message': 'Subscription successful',
            'subscriber': subscriber.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'An error occurred while processing your request'}), 500

@api.route('/reservations', methods=['GET'])
def get_reservations():
    try:
        reservations = Reservation.query.all()
        return jsonify([r.to_dict() for r in reservations])
    except Exception as e:
        return jsonify({'message': 'An error occurred while fetching reservations'}), 500

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
        
        reservation = Reservation(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            date=reservation_date,
            time=data['time'],
            guests=int(data['guests']),
            special_requests=data.get('specialRequests')
        )
        
        db.session.add(reservation)
        db.session.commit()
        
        return jsonify({
            'message': 'Reservation successful',
            'reservation': reservation.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'An error occurred while processing your request'}), 500

@api.route('/reservations/<int:id>', methods=['GET'])
def get_reservation(id):
    try:
        reservation = Reservation.query.get(id)
        if not reservation:
            return jsonify({'message': 'Reservation not found'}), 404
        return jsonify(reservation.to_dict())
    except Exception as e:
        return jsonify({'message': 'An error occurred while fetching the reservation'}), 500

@api.route('/reservations/<int:id>', methods=['DELETE'])
def delete_reservation(id):
    try:
        reservation = Reservation.query.get(id)
        if not reservation:
            return jsonify({'message': 'Reservation not found'}), 404
        
        db.session.delete(reservation)
        db.session.commit()
        
        return jsonify({'message': 'Reservation cancelled successfully'})
    except Exception as e:
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
