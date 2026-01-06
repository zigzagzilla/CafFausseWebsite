from datetime import datetime
from .database import db

# Optional: admin/user table (not required by SRS but kept for compatibility)
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
        }


class Customer(db.Model):
    """SRS Customers table."""
    __tablename__ = "customers"

    customer_id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.Text, nullable=False)
    email_address = db.Column(db.Text, unique=True, nullable=False)
    phone_number = db.Column(db.Text, nullable=True)
    newsletter_signup = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "customerId": self.customer_id,
            "customerName": self.customer_name,
            "emailAddress": self.email_address,
            "phoneNumber": self.phone_number,
            "newsletterSignup": self.newsletter_signup,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class Reservation(db.Model):
    """SRS Reservations table + additional helpful fields."""
    __tablename__ = "reservations"

    reservation_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.customer_id"), nullable=False)
    customer = db.relationship("Customer", backref=db.backref("reservations", lazy=True))
    time_slot = db.Column(db.DateTime, nullable=False)
    table_number = db.Column(db.Integer, nullable=False)

    # Extra (not in SRS but supports the UI)
    guests = db.Column(db.Integer, nullable=False, default=2)
    special_requests = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Prevent double-booking of a table in a given time slot
    __table_args__ = (
        db.UniqueConstraint("time_slot", "table_number", name="uq_time_slot_table"),
    )

    def to_dict(self):
        customer_name = self.customer.customer_name if self.customer else None
        email_address = self.customer.email_address if self.customer else None
        phone_number = self.customer.phone_number if self.customer else None

        # Include customer fields for UI convenience while keeping DB normalized.
        return {
            "id": self.reservation_id,
            "reservationId": self.reservation_id,
            "customerId": self.customer_id,
            "name": customer_name,
            "email": email_address,
            "phone": phone_number,
            "timeSlot": self.time_slot.isoformat() if self.time_slot else None,
            "tableNumber": self.table_number,
            "guests": self.guests,
            "specialRequests": self.special_requests,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
