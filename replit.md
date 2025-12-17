# Kinder Délice - Luxury Creperie Website

## Overview

A premium, Kinder chocolate-inspired creperie website for "Creperie Kinder 5" located in Batna, Algeria. This is a luxury brand website featuring cinematic animations, 3D elements, and an elegant design aesthetic comparable to award-winning agency work. The application includes a customer-facing storefront with menu browsing and cart functionality, plus a complete admin dashboard for managing orders, menu items, and categories.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite
- **Styling**: Tailwind CSS v4 with a custom Kinder-inspired luxury color palette (cream whites, chocolate browns, Kinder red accents, gold highlights)
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: 
  - Framer Motion for page transitions and micro-interactions
  - GSAP with ScrollTrigger for cinematic scroll sequences
  - Anime.js for staggered text animations
  - Lenis for smooth scrolling
- **3D Graphics**: React Three Fiber with Drei helpers for luxury-grade 3D elements
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, React Context for cart state

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with tsx for development
- **API Pattern**: RESTful JSON API with session-based authentication for admin routes
- **File Uploads**: Multer for image handling with local storage in `/uploads` directory
- **Build**: esbuild bundles server code, Vite builds the client

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` - defines admins, categories, menuItems, and orders tables
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)

### Authentication
- **Admin Auth**: Express sessions with session secret from environment variable
- **Password Hashing**: bcryptjs for secure password storage
- **Session Storage**: In-memory by default (consider connect-pg-simple for production)

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components (sections, layout, ui library)
│   │   ├── context/      # React context providers (CartContext)
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities and query client
│   │   └── pages/        # Route components (Home, admin pages)
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database operations interface
│   └── db.ts         # Drizzle database connection
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle schema and Zod validators
└── migrations/       # Database migrations
```

### Key Design Decisions
1. **Monorepo Structure**: Client and server in single repo with shared schema for type safety
2. **Lazy Loading**: All major page sections use React.lazy for performance
3. **Custom WebGL Effects**: FloatingLines and PrismaticBurst components use raw Three.js/OGL shaders
4. **Typography**: Playfair Display for headings, DM Sans for body text
5. **Mobile-First**: Responsive design with dedicated mobile menu and touch-friendly interactions

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries with automatic migration support

### Third-Party Libraries
- **Animation**: GSAP, Framer Motion, Anime.js, Lenis smooth scroll
- **3D Graphics**: Three.js via React Three Fiber, OGL for WebGL shaders
- **UI**: Radix UI primitives, shadcn/ui components, Lucide icons
- **Forms**: React Hook Form with Zod validation
- **Carousel**: Embla Carousel

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: (Optional) Secret for session encryption, auto-generated if not provided

### Font Loading
- Google Fonts: Playfair Display, DM Sans (loaded via CDN in index.html)