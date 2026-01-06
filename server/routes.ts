import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertNewsletterSubscriberSchema, 
  insertReservationSchema,
  menuItems 
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";

  // Get menu items
  app.get(`${apiPrefix}/menu`, (req: Request, res: Response) => {
    res.json(menuItems);
  });

  // Newsletter subscription
  app.post(`${apiPrefix}/newsletter`, async (req: Request, res: Response) => {
    try {
      const subscriberData = insertNewsletterSubscriberSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscriber = await storage.getNewsletterSubscriberByEmail(subscriberData.email);
      if (existingSubscriber) {
        return res.status(409).json({ message: "Email already subscribed" });
      }

      const newSubscriber = await storage.createNewsletterSubscriber(subscriberData);
      res.status(201).json({ 
        message: "Subscription successful", 
        subscriber: newSubscriber 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "An error occurred while processing your request" });
    }
  });

  // Create reservation
  app.post(`${apiPrefix}/reservations`, async (req: Request, res: Response) => {
    try {
      const reservationData = insertReservationSchema.parse(req.body);
      
      // Parse the time_slot string to ensure it's valid
      if (reservationData.time_slot) {
        const dateObj = new Date(reservationData.time_slot);
        if (isNaN(dateObj.getTime())) {
          return res.status(400).json({ message: "Invalid time_slot format" });
        }
      }

      const newReservation = await storage.createReservation(reservationData);
      res.status(201).json({ 
        message: "Reservation successful", 
        reservation: newReservation 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "An error occurred while processing your request" });
    }
  });

  // Get all reservations (would be protected in a real app)
  app.get(`${apiPrefix}/reservations`, async (req: Request, res: Response) => {
    try {
      const allReservations = await storage.getReservations();
      res.json(allReservations);
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching reservations" });
    }
  });

  // Delete reservation (cancel)
  app.delete(`${apiPrefix}/reservations/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid reservation ID" });
      }

      const success = await storage.deleteReservation(id);
      if (success) {
        res.json({ message: "Reservation cancelled successfully" });
      } else {
        res.status(404).json({ message: "Reservation not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while cancelling the reservation" });
    }
  });

  // Get single reservation (would be protected in a real app)
  app.get(`${apiPrefix}/reservations/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid reservation ID" });
      }

      const reservation = await storage.getReservation(id);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }

      res.json(reservation);
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching the reservation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
