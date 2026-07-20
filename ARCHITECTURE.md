# Printing Press Quotation Calculator - Architecture Document

## 1. Overview
The **Printing Press Quotation Calculator** is a comprehensive, full-stack application designed to streamline cost estimation for printing press operations. It enables users to calculate costs for single-section prints (flyers, posters) and multi-section prints (books, magazines), manage pricing configuration, track quotation history, and compare estimates.

## 2. Tech Stack
- **Frontend Framework**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons & Animation**: Lucide React, Motion
- **PDF Generation**: `jspdf` and `jspdf-autotable`
- **Build Tools**: Vite (Frontend), ESBuild (Backend)
- **Backend Engine**: Node.js, Express.js
- **Data Persistence**: File-system based JSON data stores (Local or `/tmp` for serverless environments)

## 3. Project Structure
```text
├── api/
│   └── index.ts                # Serverless function entry point for Vercel deployment
├── src/
│   ├── components/             # React UI Components
│   │   ├── AdminPanel.tsx      # Configuration for pricing schemas, papers, lamination, etc.
│   │   ├── CalculatorModeA.tsx # Estimator for single-section printing jobs
│   │   ├── CalculatorModeB.tsx # Estimator for multi-section (Inner + Wrapper) jobs
│   │   ├── ComparePanel.tsx    # Interface to compare multiple saved quotes
│   │   ├── PaperCascadingSelector.tsx # Interactive UI for picking paper profiles
│   │   └── QuotationHistory.tsx# Dashboard for previously saved quotes
│   ├── App.tsx                 # Main application shell, state management, and tab routing
│   ├── index.css               # Global styles and Tailwind CSS configurations
│   ├── mockApi.ts              # Client-side API abstraction for fetching/saving data
│   └── types.ts                # TypeScript interfaces and global type definitions
├── server.ts                   # Express backend server and static asset server
├── package.json                # Project dependencies and build scripts
└── vercel.json                 # Routing configuration for Vercel deployment
```

## 4. Architecture & Data Flow

### Frontend
- **Single Page Application (SPA)**: Operates entirely client-side for dynamic calculations, utilizing React's state management for real-time cost updates as users adjust parameters (quantity, colors, paper type).
- **Tabbed Navigation**: Users switch contexts smoothly between tools (Mode A, Mode B, Admin, History) without full page reloads.
- **Theming**: Includes full Dark Mode support, utilizing standard Tailwind `dark:` utility classes and persisting preference in `localStorage`.
- **API Abstraction**: Components interface with the backend API via the encapsulated service layer in `mockApi.ts` using standard `fetch`.

### Backend
- **Express Router**: `server.ts` exposes RESTful `/api/*` endpoints to handle CRUD operations for quotations, users, paper profiles, lamination costs, plate profiles, and printing brackets.
- **Persistence Strategy**: Uses lightweight file-system persistence. Data is serialized into `.json` files within a `data/` directory. For deployment on read-only environments (like Vercel), it safely routes to `/tmp/data`.
- **Static Asset Delivery**: Outside of serverless environments, the Express server acts as the static file host for the Vite-built `dist/` directory, securely delivering the frontend assets.

## 5. Build and Deployment Pipeline
The application uses a hybrid build process to prepare both the frontend and backend for production.
- **Build Script (`npm run build`)**: 
  1. `vite build` bundles the React frontend into static, highly optimized HTML/CSS/JS inside the `dist/` directory.
  2. `esbuild` transpiles and bundles the backend `server.ts` into a standalone CommonJS file (`dist/server.cjs`), bypassing native ESM/CJS quirks and speeding up cold starts.
- **Vercel Integration**: The `vercel.json` and `api/index.ts` setup intercepts `/api/*` requests and pipes them to the serverless Express instance, allowing seamless deployment on Vercel's edge network while Vercel naturally serves the `dist/` artifacts.
