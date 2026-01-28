import { 
  users, type User, type InsertUser,
  type Reservation, type InsertReservation,
  type NewsletterSubscriber, type InsertNewsletterSubscriber 
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;

  getReservations(): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  deleteReservation(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private newsletterSubscribers: Map<number, NewsletterSubscriber>;
  private reservations: Map<number, Reservation>;
  private userIdCounter: number;
  private subscriberIdCounter: number;
  private reservationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.newsletterSubscribers = new Map();
    this.reservations = new Map();
    this.userIdCounter = 1;
    this.subscriberIdCounter = 1;
    this.reservationIdCounter = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values());
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    return Array.from(this.newsletterSubscribers.values()).find(
      (subscriber) => subscriber.email === email,
    );
  }

  async createNewsletterSubscriber(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = this.subscriberIdCounter++;
    const subscriber: NewsletterSubscriber = { 
      ...insertSubscriber, 
      id, 
      createdAt: new Date().toISOString() 
    };
    this.newsletterSubscribers.set(id, subscriber);
    return subscriber;
  }

  async getReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = this.reservationIdCounter++;
    const reservation: Reservation = { 
      reservationId: id,
      customerId: id,
      name: insertReservation.name,
      email: insertReservation.email,
      phone: insertReservation.phone || null,
      timeSlot: insertReservation.time_slot,
      tableNumber: Math.floor(Math.random() * 30) + 1,
      guests: insertReservation.guests || 2,
      specialRequests: insertReservation.specialRequests || null,
      createdAt: new Date().toISOString()
    };
    this.reservations.set(id, reservation);
    return reservation;
  }

  async deleteReservation(id: number): Promise<boolean> {
    return this.reservations.delete(id);
  }
}

export const storage = new MemStorage();
