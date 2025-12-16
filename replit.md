# SCOLARIX - School Management Platform

## Overview
SCOLARIX is a French school management platform ("plateforme de gestion scolaire") built with a React frontend and FastAPI backend.

## Project Structure
- **frontend/**: React + Vite + TypeScript + Tailwind CSS
  - `src/pages/`: Page components (auth, dashboard, admin, reports)
  - `src/services/`: API service layer
  - `src/components/`: Reusable UI components
  - `src/contexts/`: React contexts (Auth)
- **backend/**: FastAPI + SQLAlchemy + PostgreSQL
  - `routes/`: API endpoints
  - `controller/`: Business logic
  - `models/`: Database models
  - `schemas/`: Pydantic schemas
  - `config/`: Database and settings configuration

## Running the Application
The application runs via `run.sh` which starts:
1. Backend: FastAPI on port 8000 (localhost)
2. Frontend: Vite dev server on port 5000 (0.0.0.0)

The frontend proxies `/api` requests to the backend.

## Database
Uses Replit's built-in PostgreSQL database. Connection via `DATABASE_URL` environment variable.

## Demo Accounts
- admin@scolarix.com
- teacher@scolarix.com
- student@scolarix.com
- Password: password

## Key Features
- User authentication (JWT)
- Student management
- Teacher management
- Class management
- Academic operations
- Reports dashboard

## Recent Changes
- 2025-12-16: Migrated from MySQL to PostgreSQL for Replit environment
- 2025-12-16: Configured Vite for Replit proxy compatibility
- 2025-12-16: Set up combined frontend/backend workflow
