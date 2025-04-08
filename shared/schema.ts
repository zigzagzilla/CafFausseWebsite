import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
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

// Newsletter Subscriber schema
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).pick({
  email: true,
});

// Reservation schema
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  date: date("date").notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull(),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReservationSchema = createInsertSchema(reservations).pick({
  name: true,
  email: true,
  phone: true,
  date: true,
  time: true,
  guests: true,
  specialRequests: true,
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

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;

export type Reservation = typeof reservations.$inferSelect;
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
