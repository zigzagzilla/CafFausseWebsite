from datetime import datetime, date
from typing import Dict, List, Optional

class Reservation:
    def __init__(self, id: int, name: str, email: str, phone: str, 
                 reservation_date: date, time: str, guests: int,
                 special_requests: Optional[str] = None):
        self.id = id
        self.name = name
        self.email = email
        self.phone = phone
        self.date = reservation_date
        self.time = time
        self.guests = guests
        self.special_requests = special_requests
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time,
            'guests': self.guests,
            'specialRequests': self.special_requests,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }

class NewsletterSubscriber:
    def __init__(self, id: int, email: str):
        self.id = id
        self.email = email
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }

class MemStorage:
    def __init__(self):
        self.reservations: Dict[int, Reservation] = {}
        self.newsletter_subscribers: Dict[int, NewsletterSubscriber] = {}
        self.reservation_id_counter = 1
        self.subscriber_id_counter = 1

    def get_reservations(self) -> List[Reservation]:
        return list(self.reservations.values())

    def get_reservation(self, id: int) -> Optional[Reservation]:
        return self.reservations.get(id)

    def create_reservation(self, name: str, email: str, phone: str, 
                          reservation_date: date, time: str, guests: int,
                          special_requests: Optional[str] = None) -> Reservation:
        reservation = Reservation(
            id=self.reservation_id_counter,
            name=name,
            email=email,
            phone=phone,
            reservation_date=reservation_date,
            time=time,
            guests=guests,
            special_requests=special_requests
        )
        self.reservations[self.reservation_id_counter] = reservation
        self.reservation_id_counter += 1
        return reservation

    def delete_reservation(self, id: int) -> bool:
        if id in self.reservations:
            del self.reservations[id]
            return True
        return False

    def get_newsletter_subscribers(self) -> List[NewsletterSubscriber]:
        return list(self.newsletter_subscribers.values())

    def get_newsletter_subscriber_by_email(self, email: str) -> Optional[NewsletterSubscriber]:
        for subscriber in self.newsletter_subscribers.values():
            if subscriber.email == email:
                return subscriber
        return None

    def create_newsletter_subscriber(self, email: str) -> NewsletterSubscriber:
        subscriber = NewsletterSubscriber(
            id=self.subscriber_id_counter,
            email=email
        )
        self.newsletter_subscribers[self.subscriber_id_counter] = subscriber
        self.subscriber_id_counter += 1
        return subscriber

storage = MemStorage()
