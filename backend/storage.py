import random
from datetime import datetime, date
from typing import Dict, List, Optional, Set

TOTAL_TABLES = 30

class Reservation:
    def __init__(self, id: int, name: str, email: str, phone: str, 
                 reservation_date: date, time: str, guests: int,
                 table_number: int,
                 special_requests: Optional[str] = None):
        self.id = id
        self.name = name
        self.email = email
        self.phone = phone
        self.date = reservation_date
        self.time = time
        self.guests = guests
        self.table_number = table_number
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
            'tableNumber': self.table_number,
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

    def get_reservations_for_time_slot(self, reservation_date: date, time: str) -> List[Reservation]:
        return [
            r for r in self.reservations.values()
            if r.date == reservation_date and r.time == time
        ]

    def get_booked_tables_for_time_slot(self, reservation_date: date, time: str) -> Set[int]:
        reservations = self.get_reservations_for_time_slot(reservation_date, time)
        return {r.table_number for r in reservations}

    def get_available_tables_for_time_slot(self, reservation_date: date, time: str) -> List[int]:
        booked_tables = self.get_booked_tables_for_time_slot(reservation_date, time)
        all_tables = set(range(1, TOTAL_TABLES + 1))
        return list(all_tables - booked_tables)

    def is_time_slot_available(self, reservation_date: date, time: str) -> bool:
        available_tables = self.get_available_tables_for_time_slot(reservation_date, time)
        return len(available_tables) > 0

    def get_random_available_table(self, reservation_date: date, time: str) -> Optional[int]:
        available_tables = self.get_available_tables_for_time_slot(reservation_date, time)
        if not available_tables:
            return None
        return random.choice(available_tables)

    def create_reservation(self, name: str, email: str, phone: str, 
                          reservation_date: date, time: str, guests: int,
                          special_requests: Optional[str] = None) -> Optional[Reservation]:
        table_number = self.get_random_available_table(reservation_date, time)
        if table_number is None:
            return None
        
        reservation = Reservation(
            id=self.reservation_id_counter,
            name=name,
            email=email,
            phone=phone,
            reservation_date=reservation_date,
            time=time,
            guests=guests,
            table_number=table_number,
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
