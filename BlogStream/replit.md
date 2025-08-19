# Overview

This is a full-stack blog application built with React, Express, and TypeScript. The application provides a modern blogging platform with features for creating, editing, and viewing blog posts with markdown support. It includes a comprehensive commenting system and a responsive design using Tailwind CSS and shadcn/ui components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: wouter for client-side routing with pages for home, post detail, editor, and 404
- **State Management**: TanStack React Query for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Markdown**: ReactMarkdown for rendering and a custom markdown editor with toolbar
- **Styling**: Tailwind CSS with CSS custom properties for theming and responsive design

## Backend Architecture
- **Framework**: Express.js with TypeScript in ESM mode
- **API Design**: RESTful API with routes for posts and comments (GET, POST operations)
- **Storage**: In-memory storage implementation with interface for future database integration
- **File Uploads**: Multer middleware for image upload handling with 2MB size limit
- **Development**: Vite middleware integration for hot module replacement in development

## Data Schema & Validation
- **Schema Definition**: Drizzle ORM schema with PostgreSQL tables for users, posts, and comments
- **Validation**: Zod schemas derived from Drizzle for runtime validation
- **Types**: Shared TypeScript types between frontend and backend via shared schema
- **Database**: PostgreSQL configured via Drizzle with Neon Database serverless driver

## Build & Development
- **Monorepo Structure**: Client and server code in same repository with shared types
- **Build Process**: Vite for frontend bundling, esbuild for server bundling
- **Development**: Hot reload for both frontend and backend with proxy setup
- **TypeScript**: Strict type checking with path mapping for clean imports

## External Dependencies

- **Database**: Neon Database (PostgreSQL) via @neondatabase/serverless driver
- **ORM**: Drizzle ORM for database operations and schema management
- **UI Components**: Extensive use of Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS for processing
- **Fonts**: Google Fonts integration (DM Sans, Fira Code, Geist Mono, Architects Daughter)
- **Icons**: Font Awesome for UI icons
- **Development Tools**: Replit-specific plugins for development environment integration
- **Session Management**: connect-pg-simple for PostgreSQL session storage