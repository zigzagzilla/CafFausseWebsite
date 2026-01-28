# Cafe_Fausse

Overview

Café Fausse is a full-stack web application developed as part of the Web Application & Interface Design course. The application serves as the digital front door for a fine-dining restaurant, allowing users to view the menu, learn about the restaurant, browse a gallery of images and awards, sign up for a newsletter, and make table reservations online.

The project was built to meet the functional and non-functional requirements defined in the provided Software Requirements Specification (SRS), with particular emphasis on clean UI/UX design, responsive layout, and full front-end/back-end integration.

Technology Stack

Front End
	•	React with JSX
	•	Vite for development and build tooling
	•	CSS (Flexbox / Grid-based layout)
	•	Responsive design for desktop and mobile

Back End
	•	Flask (Python)
	•	SQLAlchemy ORM
	•	RESTful API endpoints for reservations and newsletter signup

Database
	•	PostgreSQL
	•	Two core tables:
	•	customers
	•	reservations

Core Features
	•	Home page with restaurant information, hours, and navigation
	•	Menu page with categorized menu items and prices
	•	About Us page describing the restaurant’s history and mission
	•	Gallery page featuring images, awards, and customer reviews
	•	Newsletter email signup with validation and persistence
	•	Reservation system with:
	•	Time-slot based bookings
	•	Automatic random table assignment (30 tables total)
	•	Prevention of overbooking
	•	Persistent storage in PostgreSQL

Reservation System Design

The reservation system is implemented using a React form on the frontend and a Flask API on the backend. When a reservation is submitted:
	1.	Customer information is inserted or updated in the customers table. Inputs are validated against expected       sequences.
	2.	The backend checks how many tables are already booked for the selected time slot.
	3.	If availability exists, an available table (from 1–30) is randomly assigned.
	4.	The reservation is stored in the reservations table.
	5.	A success or error message is returned to the user.

The admin panel is available at https://caf-fausse-website-zigzagzilla.replit.app/admin.
Login - Use password: admin123

Update: Encountered and fixed an issue with React component hooks (useState, useQuery, useMutation) placed after a conditional return statement."  

4. Using the Application
	•	Navigate through the site using the top navigation bar.
	•	Create a reservation via the Reservations page.
	•	Sign up for the newsletter using the email form.
	•	Reservation and newsletter data will be stored in the PostgreSQL database.

AI Tooling Disclosure

AI-assisted development tools were used to support this project in accordance with course guidance.
	•	Replit.com was used as a development environment and for rapid prototyping (“vibe coding”), enabling quick iteration on UI components and backend scaffolding.
	•	ChatGPT was used as a development assistant for:
	•	Analyzing the Software Requirements Specification
  • Generating imagery suitable to the topic
	•	Reasoning about backend logic and data models
	•	Debugging issues and refining implementation details

All code was reviewed, adapted, and integrated by the author, and the final application reflects intentional design and implementation decisions.

Notes
	•	This project is intended as a development/demo application and is not hardened for production use.
	•	Database tables are created automatically on application startup for convenience.
