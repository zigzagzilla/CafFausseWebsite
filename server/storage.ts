import { 
  users, type User, type InsertUser,
  customers, reservations,
  type Reservation, type InsertReservation,
  type NewsletterSubscriber, type InsertNewsletterSubscriber 
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const result = await db.select().from(customers).where(eq(customers.newsletterSignup, true));
    return result.map(c => ({
      id: c.customerId,
      email: c.emailAddress,
      createdAt: c.createdAt.toISOString()
    }));
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const result = await db.select().from(customers)
      .where(eq(customers.emailAddress, email));
    if (result.length === 0) return undefined;
    const c = result[0];
    if (!c.newsletterSignup) return undefined;
    return {
      id: c.customerId,
      email: c.emailAddress,
      createdAt: c.createdAt.toISOString()
    };
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const existing = await db.select().from(customers)
      .where(eq(customers.emailAddress, subscriber.email));
    
    if (existing.length > 0) {
      await db.update(customers)
        .set({ newsletterSignup: true })
        .where(eq(customers.emailAddress, subscriber.email));
      return {
        id: existing[0].customerId,
        email: existing[0].emailAddress,
        createdAt: existing[0].createdAt.toISOString()
      };
    }

    const result = await db.insert(customers).values({
      customerName: "Newsletter Subscriber",
      emailAddress: subscriber.email,
      newsletterSignup: true
    }).returning();
    
    return {
      id: result[0].customerId,
      email: result[0].emailAddress,
      createdAt: result[0].createdAt.toISOString()
    };
  }

  async getReservations(): Promise<Reservation[]> {
    const result = await db.select({
      reservationId: reservations.reservationId,
      customerId: reservations.customerId,
      timeSlot: reservations.timeSlot,
      tableNumber: reservations.tableNumber,
      guests: reservations.guests,
      specialRequests: reservations.specialRequests,
      createdAt: reservations.createdAt,
      customerName: customers.customerName,
      emailAddress: customers.emailAddress,
      phoneNumber: customers.phoneNumber
    })
    .from(reservations)
    .innerJoin(customers, eq(reservations.customerId, customers.customerId));
    
    return result.map(r => ({
      reservationId: r.reservationId,
      customerId: r.customerId,
      name: r.customerName,
      email: r.emailAddress,
      phone: r.phoneNumber,
      timeSlot: r.timeSlot.toISOString(),
      tableNumber: r.tableNumber,
      guests: r.guests,
      specialRequests: r.specialRequests,
      createdAt: r.createdAt.toISOString()
    }));
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    const result = await db.select({
      reservationId: reservations.reservationId,
      customerId: reservations.customerId,
      timeSlot: reservations.timeSlot,
      tableNumber: reservations.tableNumber,
      guests: reservations.guests,
      specialRequests: reservations.specialRequests,
      createdAt: reservations.createdAt,
      customerName: customers.customerName,
      emailAddress: customers.emailAddress,
      phoneNumber: customers.phoneNumber
    })
    .from(reservations)
    .innerJoin(customers, eq(reservations.customerId, customers.customerId))
    .where(eq(reservations.reservationId, id));
    
    if (result.length === 0) return undefined;
    const r = result[0];
    return {
      reservationId: r.reservationId,
      customerId: r.customerId,
      name: r.customerName,
      email: r.emailAddress,
      phone: r.phoneNumber,
      timeSlot: r.timeSlot.toISOString(),
      tableNumber: r.tableNumber,
      guests: r.guests,
      specialRequests: r.specialRequests,
      createdAt: r.createdAt.toISOString()
    };
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const timeSlotDate = new Date(insertReservation.time_slot);
    
    let customer = await db.select().from(customers)
      .where(eq(customers.emailAddress, insertReservation.email));
    
    let customerId: number;
    if (customer.length === 0) {
      const newCustomer = await db.insert(customers).values({
        customerName: insertReservation.name,
        emailAddress: insertReservation.email,
        phoneNumber: insertReservation.phone || null,
        newsletterSignup: false
      }).returning();
      customerId = newCustomer[0].customerId;
    } else {
      customerId = customer[0].customerId;
      await db.update(customers)
        .set({
          customerName: insertReservation.name,
          phoneNumber: insertReservation.phone || customer[0].phoneNumber
        })
        .where(eq(customers.customerId, customerId));
    }

    const existingTablesResult = await db.select({ tableNumber: reservations.tableNumber })
      .from(reservations)
      .where(eq(reservations.timeSlot, timeSlotDate));
    
    const usedTables = new Set(existingTablesResult.map(r => r.tableNumber));
    
    if (usedTables.size >= 30) {
      throw new Error("No tables available for this time slot");
    }
    
    let tableNumber: number;
    do {
      tableNumber = Math.floor(Math.random() * 30) + 1;
    } while (usedTables.has(tableNumber));

    const result = await db.insert(reservations).values({
      customerId,
      timeSlot: timeSlotDate,
      tableNumber,
      guests: insertReservation.guests || 2,
      specialRequests: insertReservation.specialRequests || null
    }).returning();

    const customerData = await db.select().from(customers)
      .where(eq(customers.customerId, customerId));

    return {
      reservationId: result[0].reservationId,
      customerId: result[0].customerId,
      name: customerData[0].customerName,
      email: customerData[0].emailAddress,
      phone: customerData[0].phoneNumber,
      timeSlot: result[0].timeSlot.toISOString(),
      tableNumber: result[0].tableNumber,
      guests: result[0].guests,
      specialRequests: result[0].specialRequests,
      createdAt: result[0].createdAt.toISOString()
    };
  }

  async deleteReservation(id: number): Promise<boolean> {
    const result = await db.delete(reservations)
      .where(eq(reservations.reservationId, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
