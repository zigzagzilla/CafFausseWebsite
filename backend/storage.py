from __future__ import annotations

import random
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Optional

TOTAL_TABLES = 30


@dataclass
class Customer:
    customer_id: int
    customer_name: str
    email_address: str
    phone_number: Optional[str]
    newsletter_signup: bool
    created_at: datetime

    def to_dict(self):
        return {
            "customerId": self.customer_id,
            "customerName": self.customer_name,
            "emailAddress": self.email_address,
            "phoneNumber": self.phone_number,
            "newsletterSignup": self.newsletter_signup,
            "createdAt": self.created_at.isoformat(),
        }


@dataclass
class Reservation:
    reservation_id: int
    customer_id: int
    name: str
    email: str
    phone: Optional[str]
    time_slot: datetime
    table_number: int
    guests: int
    special_requests: Optional[str]
    created_at: datetime
    additional_tables: Optional[List[int]] = None

    def to_dict(self):
        if self.additional_tables:
            table_display = ", ".join(str(t) for t in [self.table_number] + self.additional_tables)
        else:
            table_display = self.table_number
        return {
            "id": self.reservation_id,
            "reservationId": self.reservation_id,
            "customerId": self.customer_id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "timeSlot": self.time_slot.isoformat(),
            "tableNumber": table_display,
            "guests": self.guests,
            "specialRequests": self.special_requests,
            "createdAt": self.created_at.isoformat(),
        }


class MemStorage:
    def __init__(self):
        self.customers: Dict[int, Customer] = {}
        self.reservations: Dict[int, Reservation] = {}
        self.customer_id_counter = 1
        self.reservation_id_counter = 1

    # Customers
    def get_customer_by_email(self, email: str) -> Optional[Customer]:
        email_l = email.strip().lower()
        for c in self.customers.values():
            if c.email_address.lower() == email_l:
                return c
        return None

    def create_or_update_customer(
        self,
        customer_name: str,
        email_address: str,
        phone_number: Optional[str] = None,
        newsletter_signup: Optional[bool] = None,
    ) -> Customer:
        existing = self.get_customer_by_email(email_address)
        if existing:
            existing.customer_name = customer_name or existing.customer_name
            if phone_number is not None:
                existing.phone_number = phone_number
            if newsletter_signup is not None:
                existing.newsletter_signup = newsletter_signup
            return existing

        c = Customer(
            customer_id=self.customer_id_counter,
            customer_name=customer_name,
            email_address=email_address,
            phone_number=phone_number,
            newsletter_signup=bool(newsletter_signup) if newsletter_signup is not None else False,
            created_at=datetime.utcnow(),
        )
        self.customers[self.customer_id_counter] = c
        self.customer_id_counter += 1
        return c

    # Newsletter
    def get_newsletter_subscribers(self) -> List[Customer]:
        """Get all customers who have signed up for the newsletter."""
        return [c for c in self.customers.values() if c.newsletter_signup]

    def update_subscriber(self, customer_id: int, email: Optional[str] = None, name: Optional[str] = None) -> Optional[Customer]:
        """Update a newsletter subscriber's information."""
        customer = self.customers.get(customer_id)
        if not customer:
            return None
        if email:
            customer.email = email
        if name is not None:
            customer.name = name
        return customer

    def subscribe_newsletter(self, email_address: str) -> Customer:
        # If we don't know the name yet, keep blank
        c = self.get_customer_by_email(email_address)
        if c:
            c.newsletter_signup = True
            return c
        return self.create_or_update_customer(
            customer_name="",
            email_address=email_address,
            phone_number=None,
            newsletter_signup=True,
        )

    # Reservations
    def get_reservations(self) -> List[Reservation]:
        return list(self.reservations.values())

    def get_reservation(self, reservation_id: int) -> Optional[Reservation]:
        return self.reservations.get(reservation_id)

    def delete_reservation(self, reservation_id: int) -> bool:
        if reservation_id in self.reservations:
            del self.reservations[reservation_id]
            return True
        return False

    def check_duplicate_reservation(
        self,
        email_address: str,
        phone_number: Optional[str],
        time_slot: datetime,
    ) -> Optional[Reservation]:
        """Check if there's an existing reservation within 1 hour 59 minutes for same email or phone."""
        from datetime import timedelta
        DUPLICATE_WINDOW_MINUTES = 119  # 1 hour 59 minutes
        
        time_window_start = time_slot - timedelta(minutes=DUPLICATE_WINDOW_MINUTES)
        time_window_end = time_slot + timedelta(minutes=DUPLICATE_WINDOW_MINUTES)
        
        email_l = email_address.strip().lower()
        phone_normalized = phone_number.strip() if phone_number else None
        
        for r in self.reservations.values():
            if time_window_start <= r.time_slot <= time_window_end:
                if r.email.lower() == email_l:
                    return r
                if phone_normalized and r.phone and r.phone == phone_normalized:
                    return r
        
        return None

    def _find_sequential_tables(self, available: List[int], count: int = 2) -> Optional[List[int]]:
        """Find sequential available table numbers."""
        available_set = set(available)
        for t in sorted(available):
            if all((t + i) in available_set for i in range(count)):
                return [t + i for i in range(count)]
        return None

    def create_reservation(
        self,
        customer_name: str,
        email_address: str,
        phone_number: Optional[str],
        time_slot: datetime,
        guests: int,
        special_requests: Optional[str] = None,
    ) -> Reservation:
        tables_needed = 2 if guests > 4 else 1
        
        taken_tables = set()
        for r in self.reservations.values():
            if r.time_slot == time_slot:
                taken_tables.add(r.table_number)
                if r.additional_tables:
                    taken_tables.update(r.additional_tables)
        
        available = [t for t in range(1, TOTAL_TABLES + 1) if t not in taken_tables]
        
        if len(available) < tables_needed:
            raise ValueError("This time slot is fully booked")

        if tables_needed == 2:
            assigned_tables = self._find_sequential_tables(available, 2)
            if not assigned_tables:
                raise ValueError("No sequential tables available for your party size. Please call the restaurant for assistance.")
        else:
            assigned_tables = [random.choice(available)]

        customer = self.create_or_update_customer(
            customer_name=customer_name,
            email_address=email_address,
            phone_number=phone_number,
        )

        additional = assigned_tables[1:] if len(assigned_tables) > 1 else None
        
        r = Reservation(
            reservation_id=self.reservation_id_counter,
            customer_id=customer.customer_id,
            name=customer_name,
            email=email_address,
            phone=phone_number,
            time_slot=time_slot,
            table_number=assigned_tables[0],
            guests=guests,
            special_requests=special_requests,
            created_at=datetime.utcnow(),
            additional_tables=additional,
        )
        self.reservations[self.reservation_id_counter] = r
        self.reservation_id_counter += 1
        
        return r


storage = MemStorage()
