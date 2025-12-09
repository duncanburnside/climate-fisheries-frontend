# Climate-Fisheries - Next.js (2025)

This is a Next.js rebuild of the Climate-Fisheries application, migrated from Angular 16 to Next.js 16 with TypeScript and Tailwind CSS.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Visualization**: D3.js 7.9, Chart.js 4.5 (via react-chartjs-2)
- **HTTP Client**: Axios
- **Build Tool**: Next.js with Turbopack

## Key Changes from Angular Version

- Replaced Angular components with React components
- Converted Bootstrap to Tailwind CSS
- Replaced Angular Services with utility classes and hooks
- Replaced RxJS Observables with async/await and Promise-based APIs
- Replaced Angular Router with Next.js App Router
- Replaced ng2-charts with react-chartjs-2

## Getting Started

### Prerequisites

- Node.js 18.0.0 or 20.0.0
- pnpm (install with `npm install -g pnpm` or `corepack enable`)

### Installation

```bash
pnpm install
```

### Development Server

```bash
pnpm dev
```

Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

### Build

```bash
pnpm build
```

The build artifacts will be stored in the `.next/` directory.

### Production Server

```bash
pnpm start
```

## Project Structure

```
climatefisheries-nextjs/
├── app/                    # Next.js app directory (routes)
│   ├── page.tsx           # Home page
│   ├── map/               # Map visualization page
│   └── information/       # Information pages (FAQ, Methods)
├── components/             # React components
│   └── map/               # Map-related components
├── lib/                    # Utilities and services
│   ├── models/            # TypeScript models
│   └── services/          # Service classes
└── public/                 # Static assets
    └── assets/            # Images, geoJSONs, etc.
```

## Features

- Interactive ocean data visualization using D3.js
- Climate indicators visualization (MCP, MSIS, NPP, OXY, PH, SBOT, SPP, SST)
- Multiple map types (FAO, EEZ, LME, BGCP, Grid)
- Climate scenario modeling (RCP 2.6, RCP 8.5)
- Time period analysis
- Revenue calculations
- Interactive charts using Chart.js

## Notes

- The application uses Next.js App Router for routing
- All client-side components are marked with `'use client'` directive
- D3.js map rendering is handled in a React component with useEffect hooks
- Chart.js is configured with react-chartjs-2 wrapper
