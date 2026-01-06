import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping from the original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Customers schema (SRS-aligned)
export const customers = pgTable("customers", {
  customerId: serial("customer_id").primaryKey(),
  customerName: text("customer_name").notNull(),
  emailAddress: text("email_address").notNull().unique(),
  phoneNumber: text("phone_number"),
  newsletterSignup: boolean("newsletter_signup").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reservations schema (SRS-aligned, normalized)
export const reservations = pgTable("reservations", {
  reservationId: serial("reservation_id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  timeSlot: timestamp("time_slot").notNull(),
  tableNumber: integer("table_number").notNull(),

  // Extra fields used by the UI (not required by SRS)
  guests: integer("guests").default(2).notNull(),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Newsletter subscriber schema (for API validation)
export const insertNewsletterSubscriberSchema = z.object({
  email: z.string().email(),
});

// API payload schemas (not 1:1 with DB columns, because reservations are normalized)
export const insertReservationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  time_slot: z.string().min(10), // ISO datetime
  guests: z.number().int().min(1).max(20).optional(),
  specialRequests: z.string().optional(),
});

// Menu Item schema (for reference, not for storage as it's static)
export const menuItems = [
  {
    category: "starters",
    items: [
      {
        id: 1,
        name: "Bruschetta",
        description: "Fresh tomatoes, basil, olive oil, and toasted baguette slices",
        price: 8.50
      },
      {
        id: 2,
        name: "Caesar Salad",
        description: "Crisp romaine with homemade Caesar dressing",
        price: 9.00
      }
    ]
  },
  {
    category: "main",
    items: [
      {
        id: 3,
        name: "Grilled Salmon",
        description: "Served with lemon butter sauce and seasonal vegetables",
        price: 22.00
      },
      {
        id: 4,
        name: "Ribeye Steak",
        description: "12 oz prime cut with garlic mashed potatoes",
        price: 28.00
      },
      {
        id: 5,
        name: "Vegetable Risotto",
        description: "Creamy Arborio rice with wild mushrooms",
        price: 18.00
      }
    ]
  },
  {
    category: "desserts",
    items: [
      {
        id: 6,
        name: "Tiramisu",
        description: "Classic Italian dessert with mascarpone",
        price: 7.50
      },
      {
        id: 7,
        name: "Cheesecake",
        description: "Creamy cheesecake with berry compote",
        price: 7.00
      }
    ]
  },
  {
    category: "beverages",
    items: [
      {
        id: 8,
        name: "Red Wine (Glass)",
        description: "A selection of Italian reds",
        price: 10.00
      },
      {
        id: 9,
        name: "White Wine (Glass)",
        description: "Crisp and refreshing",
        price: 9.00
      },
      {
        id: 10,
        name: "Craft Beer",
        description: "Local artisan brews",
        price: 6.00
      },
      {
        id: 11,
        name: "Espresso",
        description: "Strong and aromatic",
        price: 3.00
      }
    ]
  }
];

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Customer = typeof customers.$inferSelect;

export type NewsletterSubscriber = { id: number; email: string; createdAt: string };
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;

// Reservation response type (includes customer fields for UI convenience)
export type Reservation = {
  reservationId: number;
  customerId: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  timeSlot: string;
  tableNumber: number;
  guests: number;
  specialRequests?: string | null;
  createdAt?: string | null;
};
export type InsertReservation = z.infer<typeof insertReservationSchema>;

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
};

export type MenuCategory = {
  category: string;
  items: MenuItem[];
};
