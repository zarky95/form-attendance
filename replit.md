# Overview

PetFolio is a portfolio showcase application for pet care professionals. It allows businesses like pet groomers, trainers, veterinarians, photographers, and boarding facilities to display their work through before/after transformations, detailed case studies, and professional profiles. The application features filtering by category, search functionality, detailed case study modals, and social sharing capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript, using a modern component-based architecture:
- **Framework**: React with Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with custom CSS variables for theming and pet-specific color palette
- **State Management**: TanStack Query for server state management and caching
- **Forms**: React Hook Form with Zod for validation

The application follows a clean component structure with reusable UI components, custom hooks, and utility functions. The design system uses a pet-themed color palette with CSS variables for consistent theming.

## Backend Architecture
The backend is implemented as a RESTful API using Express.js:
- **Framework**: Express.js with TypeScript for type safety
- **API Design**: RESTful endpoints following standard conventions
- **Storage**: In-memory storage implementation with interface for easy database integration
- **Data Validation**: Zod schemas for request validation
- **Development**: Hot reload with Vite integration for seamless full-stack development

The storage layer uses an interface pattern (`IStorage`) allowing easy swapping between in-memory storage (for development) and database implementations.

## Data Storage Solutions
Currently uses in-memory storage with seeded sample data for development. The application is designed to easily integrate with PostgreSQL:
- **Current**: In-memory storage with Map-based data structures
- **Planned**: PostgreSQL integration using Drizzle ORM
- **Schema**: Three main entities - portfolios, case studies, and professionals
- **Relationships**: Case studies are linked to portfolios via foreign keys

The database schema supports portfolio metadata, before/after images, detailed case studies with process steps and metrics, and professional profiles.

## Authentication and Authorization
Currently no authentication system is implemented. The application is designed as a public showcase platform where all portfolio content is publicly viewable.

# External Dependencies

## Database Integration
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **Drizzle Kit**: Database migrations and schema management

## UI and Styling
- **Shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Accessible, unstyled UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

## State Management and Data Fetching
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management and validation
- **Zod**: TypeScript-first schema validation

## Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## Utilities and Enhancement
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **class-variance-authority**: Type-safe variant-based styling
- **wouter**: Lightweight routing library for React