# Pokedex - Frontend Engineering Showcase

This project is a modern, responsive Pokedex application built to demonstrate Frontend Engineering best practices, including Atomic Design architecture, comprehensive testing strategies, and efficient state management.

## 🚀 Project Overview

The application provides a rich interface for exploring Pokemon data, featuring:
- **Dashboard**: Detailed analytics and visualizations of Pokemon stats.
- **Comparison Tool**: Compare two Pokemon side-by-side with radar charts.
- **Search & Filter**: Advanced filtering by type, generation, and name.
- **Detail View**: Comprehensive Pokemon information including stats, abilities, and evolution chains.

## 🏗️ Component Architecture: Atomic Design

This project follows the **Atomic Design** methodology to ensure scalability, maintainability, and reusability.

### 1. Atoms (`src/components/atoms`)
Basic building blocks that cannot be broken down further.
- **Examples**: `PokemonTypeBadge`, `ThemeController`
- **Purpose**: Provide consistent styling and base functionality.

### 2. Molecules (`src/components/molecules`)
Groups of atoms functioning together as a unit.
- **Examples**: `DashboardControls`, `Filter`, `SearchablePokemonSelector`, `SearchableSimpleSelector`
- **Purpose**: Create functional UI components (e.g., a search bar with a label).

### 3. Organisms (`src/components/organisms`)
Complex UI sections composed of groups of molecules and/or atoms.
- **Examples**: `PokemonCard`, `PokemonComparison`, `PokemonDetail`, `EvolutionChain`
- **Purpose**: Form distinct sections of an interface (e.g., a product card, a header).

### 4. Templates (`src/components/templates`)
Page-level objects that place components into a layout.
- **Examples**: `TechBackground`, `DreamyBackground`
- **Purpose**: Define the underlying content structure.

### 5. Pages (`src/app`)
Specific instances of templates where real content is populated.
- **Examples**: Dashboard Page, Pokemon Detail Page.

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15+ (App Router)**: For server-side rendering, routing, and optimization.
- **React 19**: Utilizing the latest features like Server Components and Hooks.
- **TypeScript**: Ensuring type safety and better developer experience.

### Styling & UI
- **Tailwind CSS v4**: Utility-first CSS framework for rapid UI development.
- **DaisyUI**: Component library for Tailwind CSS.
- **Framer Motion**: For smooth animations and transitions.
- **Lucide React**: Consistent icon set.

### State Management & Data Fetching
- **Redux Toolkit**: Centralized state management for complex application states.
- **RTK Query**: Efficient data fetching and caching.

### Data Visualization
- **Recharts**: Composable charting library for React components.

## 🧪 Testing Strategy

We employ a multi-layered testing strategy to ensure reliability and maintainability.

### Unit & Integration Testing
- **Jest**: Test runner and assertion library.
- **React Testing Library (RTL)**: Testing components from the user's perspective.
- **Coverage**:
  - Component rendering and interaction.
  - Utility functions and helpers.
  - Redux slice logic and reducers.

### End-to-End (E2E) Testing
- **Playwright**: Robust cross-browser E2E testing.
- **Scope**:
  - Critical user flows (Search, Navigation, Comparison).
  - Cross-browser compatibility.
  - Performance metrics.

## 💻 Frontend Engineering Principles

1.  **Component Reusability**: Leveraging Atomic Design to maximize code reuse.
2.  **Clean Code**: Adhering to SOLID principles and meaningful naming conventions.
3.  **Performance First**: Utilizing Next.js optimizations (Image, Link prefetching) and efficient rendering.
4.  **Accessibility (a11y)**: Semantic HTML and proper ARIA attributes where necessary.
5.  **Responsive Design**: Mobile-first approach ensuring usability across all device sizes.

## 📦 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Run Tests**:
    ```bash
    npm test          # Unit Tests
    npm run test:e2e  # E2E Tests
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```
