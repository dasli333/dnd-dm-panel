# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## Architecture Overview

This is an Astro 5 project configured for server-side rendering with Node.js adapter. The project uses a hybrid approach where:

- **Astro components** (.astro) handle static content and layouts
- **React components** (.tsx) provide interactivity when needed
- **API routes** are handled through Astro's server endpoints

### Key Configuration

- **Output mode**: Server-side rendering (`output: "server"`)
- **Port**: Development server runs on port 3000
- **Adapter**: Node.js standalone mode
- **Path alias**: `@/*` maps to `./src/*`

### Project Structure

```
src/
├── components/        # UI components (Astro & React)
│   └── ui/           # Shadcn/ui components
├── layouts/          # Astro layouts
├── pages/            # Astro pages
│   └── api/          # API endpoints
├── lib/              # Services and utilities
├── styles/           # Global styles
└── assets/           # Static internal assets
```

### Tech Stack Integration

- **Styling**: Tailwind CSS v4 with utility-first approach
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: ESLint + Prettier with lint-staged pre-commit hooks

### Development Guidelines

Based on Cursor rules in `.cursor/rules/`:

1. **Error Handling**: Use early returns and guard clauses
2. **API Routes**: Use uppercase HTTP methods (GET, POST) with `export const prerender = false`
3. **Validation**: Use Zod for API input validation
4. **Services**: Extract business logic to `src/lib/services`
5. **Accessibility**: Follow ARIA best practices for interactive elements
6. **Responsive Design**: Use Tailwind responsive variants (sm:, md:, lg:)

### Component Architecture

- Use Astro components for static content and server-side logic
- Implement React components only when client-side interactivity is required
- Leverage Astro's partial hydration for optimal performance
- Use Shadcn/ui components for consistent design system