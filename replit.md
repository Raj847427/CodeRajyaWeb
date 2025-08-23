# CodeRajya

## Overview

CodeRajya is a comprehensive MERN-inspired full-stack learning platform designed as a single-page application (SPA). The project follows the tagline "Jahan har coder banega king" (Where every coder becomes a king) and provides a complete ecosystem for coding education including skill-based learning modules, mentor connections, interview preparation, community forums, and progress tracking.

The application uses a modern React frontend with a Node.js/Express backend, PostgreSQL database via Drizzle ORM, and implements Replit's authentication system. It's architected as a monorepo with clear separation between client, server, and shared code.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript in SPA mode using Wouter for client-side routing
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS styling
- **State Management**: React Query (TanStack Query) for server state and built-in React hooks for local state
- **Build System**: Vite with custom configuration for development and production builds
- **Component Structure**: Feature-based organization with reusable UI components, layout components, and page-specific components

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **API Design**: RESTful API with middleware-based request processing and error handling
- **Route Organization**: Feature-based route grouping with centralized registration system
- **Storage Layer**: Abstracted storage interface for database operations with support for user management, modules, progress tracking, mentors, forum posts, and interview challenges

### Authentication & Authorization
- **Authentication Provider**: Replit's OpenID Connect (OIDC) system with Passport.js integration
- **Session Management**: Express sessions with PostgreSQL session store for persistence
- **User Management**: Automatic user creation/updates via OIDC claims with role-based access (student, mentor, admin)
- **Security**: JWT tokens, secure session cookies, and middleware-based route protection

### Database Design
- **Primary Database**: PostgreSQL with connection pooling via Neon serverless
- **Schema Management**: Drizzle migrations with type-safe schema definitions
- **Core Entities**: Users, learning modules, user progress, mentors, mentor sessions, forum posts/answers, interview challenges, challenge attempts, and user badges
- **Relationships**: Proper foreign key relationships between entities with support for complex queries

### Development & Deployment
- **Environment**: Development mode with Vite HMR and production builds with esbuild
- **Monorepo Structure**: Shared schema and types between frontend and backend
- **Code Quality**: TypeScript strict mode, path aliases for clean imports, and ESM module format
- **Development Tools**: Runtime error overlay, source maps, and development banner integration

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection with WebSocket support
- **drizzle-orm** & **drizzle-kit**: Type-safe ORM with PostgreSQL dialect and migration tools
- **@tanstack/react-query**: Server state management and caching for React
- **wouter**: Lightweight client-side routing for React SPA

### UI & Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives (dialog, dropdown, tooltip, etc.)
- **tailwindcss**: Utility-first CSS framework with custom design tokens
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Icon library for consistent iconography

### Authentication & Session Management
- **openid-client**: OpenID Connect client for Replit authentication
- **passport**: Authentication middleware with OpenID Connect strategy
- **express-session**: Session middleware with PostgreSQL store via connect-pg-simple

### Development & Build Tools
- **vite**: Fast build tool with React plugin and development server
- **@vitejs/plugin-react**: React support for Vite with JSX transformation
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution for development server

### Form & Validation
- **react-hook-form**: Performant forms with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for react-hook-form
- **zod**: Runtime type validation and schema validation
- **drizzle-zod**: Integration between Drizzle schemas and Zod validation

### Utilities & Helpers
- **date-fns**: Modern date utility library for JavaScript
- **clsx** & **tailwind-merge**: Utility functions for conditional CSS classes
- **memoizee**: Function memoization for performance optimization