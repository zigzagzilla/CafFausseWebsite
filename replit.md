# Café Fausse - Restaurant Website

## Overview

Café Fausse is a full-stack web application for a fine-dining restaurant in Washington DC. The project provides a responsive website with menu display, table reservations, newsletter signup, and an admin dashboard. It follows a dual-backend architecture where the frontend is built with React/TypeScript and can be served by either a Flask (Python) backend or an Express (Node.js) backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite with custom plugins for Replit integration
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
**Flask Backend (Python)** - Active
- Located in `/backend` directory
- Uses in-memory storage (`MemStorage` class in `backend/storage.py`)
- Serves static files from `dist/public`
- CORS enabled for development
- Entry point: `run.py` via `start_flask.sh`
- SQLAlchemy models ready for PostgreSQL (in `backend/models.py`)

**Legacy Express Backend (Node.js)** - Not in use
- Located in `/server` directory
- Can be restored by changing `npm run dev` script

### Data Layer
- **Schema Definition**: Drizzle ORM with PostgreSQL dialect (`shared/schema.ts`)
- **Current Storage**: In-memory storage (both backends)
- **Database Ready**: Schema configured for PostgreSQL when database is provisioned
- **Tables**: users, newsletter_subscribers, reservations

### API Structure
All endpoints prefixed with `/api`:
- `GET /api/menu` - Retrieve menu items (static data)
- `POST /api/newsletter` - Subscribe to newsletter
- `GET /api/reservations` - List all reservations
- `POST /api/reservations` - Create new reservation
- `GET /api/reservations/:id` - Get single reservation
- `DELETE /api/reservations/:id` - Delete reservation (admin)
- `POST /api/admin/login` - Admin authentication (password: "admin123")

### Key Design Decisions

1. **Dual Backend Support**: Allows flexibility between Python and Node.js environments. The dev script runs Flask by default.

2. **Shared Schema**: TypeScript schema in `shared/schema.ts` defines data structures used by both frontend and Node.js backend, ensuring type safety.

3. **In-Memory Storage**: Current implementation uses in-memory storage for rapid prototyping. The Drizzle schema is ready for PostgreSQL migration.

4. **Component Library**: Uses shadcn/ui (Radix primitives + Tailwind) for consistent, accessible UI components.

5. **Static Menu Data**: Menu items are hardcoded in `backend/menu_data.py` and `shared/schema.ts` rather than database-driven.

## External Dependencies

### Frontend Libraries
- React, React DOM, React Hook Form
- TanStack React Query (data fetching)
- Radix UI primitives (accessibility)
- Tailwind CSS, class-variance-authority
- Zod (schema validation)
- Wouter (routing)
- Lucide React (icons)

### Backend Dependencies (Python)
- Flask, Flask-CORS
- Flask-SQLAlchemy (prepared for database)
- python-dotenv

### Backend Dependencies (Node.js)
- Express
- Drizzle ORM with @neondatabase/serverless
- Zod, zod-validation-error

### Database
- PostgreSQL (via Neon serverless or standard connection)
- Drizzle Kit for migrations
- Connection configured via `DATABASE_URL` environment variable

### Build Tools
- Vite (frontend bundling)
- esbuild (server bundling)
- TypeScript
- PostCSS, Autoprefixer