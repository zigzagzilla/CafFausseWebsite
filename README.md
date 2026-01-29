# Cafe_Fausse

**Overview**

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
Update: Encountered and fixed issues converting AM/PM to 24HR time and vice versa per html.
Update: Added a feature that assigned 4 persons per table, thus a reservation for 5-8 people will occupy 2 of the 30 available tables.

Using the Application
	•	Navigate through the site using the top navigation bar.
	•	Create a reservation via the Reservations page.
	•	Sign up for the newsletter using the email form.
	•	Reservation and newsletter data will be stored in the PostgreSQL database.

**AI Tooling Disclosure**

AI-assisted development tools were used to support this project in accordance with course guidance.
	•	Replit.com was used as a development environment and for rapid prototyping (“vibe coding”), enabling quick iteration on UI components and backend scaffolding.
	•	ChatGPT was used as a development assistant for:
	•	Analyzing the Software Requirements Specification
 	• 	Generating imagery suitable to the topic
	•	Reasoning about backend logic and data models
	•	Debugging issues and refining implementation details

All code was reviewed, adapted, and integrated by the author, and the final application reflects intentional design and implementation decisions.

Notes
	•	This project is intended as a development/demo application and is not hardened for production use.
	•	Database tables are created automatically on application startup for convenience.
	•	AI insisted on using node.js express rather than flask initially, and required significant rewrite cycles to ensure flask was used in both development and production environments--since it was in one and not the other, 				constant persistence errors surfaced.

**Dependencies**

System Requirements
	•	Operating System: macOS, Windows, or Linux
	•	Git: version 2.x or newer
	•	Python: version 3.10 or newer
	•	Node.js: version 18 or newer
	•	npm: included with Node.js
	•	PostgreSQL: version 13 or newer

Backend Dependencies (Flask)

The backend is implemented using Flask and SQLAlchemy. Dependencies are installed via pip using requirements.txt.

Required Python packages:
	•	Flask – Web framework used to implement REST API endpoints
	•	Flask-CORS – Enables cross-origin requests from the React frontend
	•	SQLAlchemy – ORM used to define models and interact with PostgreSQL
	•	psycopg2-binary – PostgreSQL database adapter
	•	python-dotenv – Loads environment variables such as DATABASE_URL

Backend dependencies are installed with:

pip install -r requirements.txt

Frontend Dependencies (React)

The frontend is implemented using React and built with Vite. All frontend dependencies are defined in client/package.json and installed via npm.

Key frontend dependencies include:
	•	React – Component-based UI library
	•	React DOM – Renders React components in the browser
	•	Vite – Development server and build tooling
	•	React Router DOM – Client-side routing between pages
	•	Tailwind CSS (or equivalent CSS tooling) – Responsive layout using Flexbox and Grid
	•	TypeScript (if enabled) – Static typing for frontend code
	•	Client-side validation libraries (e.g., Zod) – Form input validation

Frontend dependencies are installed with:

npm install

Database Requirements
	•	PostgreSQL is used for persistent data storage.
	•	The application creates and uses the following tables:
	•	customers
	•	reservations
	•	The reservation system enforces:
	•	A maximum of 30 tables per time slot
	•	Random assignment of available tables
	•	Prevention of double bookings using database constraints

The database connection is configured using the DATABASE_URL environment variable.

Example:

DATABASE_URL=postgresql://<user>:<password>@localhost:5432/cafe_fausse

Running and Monitoring the Application

Backend
	•	Start the Flask backend with:

python app.py
	•	API endpoints can be monitored using:
	•	Browser developer tools
	•	Terminal logs
	•	Tools such as curl, Postman, or similar REST clients

Frontend
	•	Start the React development server with:

npm run dev
	•	The UI can be inspected and monitored using browser developer tools (DOM, network requests, console logs).

Database
	•	PostgreSQL can be monitored using:
	•	psql command-line tool
	•	Database GUI tools such as pgAdmin
	•	Database state can be inspected to verify that reservations and newsletter signups are being persisted correctly.
