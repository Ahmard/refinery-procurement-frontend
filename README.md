# Refinery Procurement Frontend

A modern, buyer-focused Purchase Order management system for refinery equipment procurement. Built with Next.js 16 and Ant Design, this application streamlines the entire PO workflow from catalog browsing to order submission.

---

## What This Does

This is a **Buyer Portal** where procurement teams can:

---

## Quick Start

### Prerequisites

- **Node.js** 18+ 
- **pnpm** (recommended) or npm/yarn
- Backend API services running (see Environment Setup below)

### Installation

```bash
# Clone the repository
cd refinery-procurement-frontend

# Install dependencies
pnpm install

# Set up environment variables (see Environment section)
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:9150) to access the application.

---

## Project Structure

```
refinery-procurement-frontend/
├── app/                      # Next.js App Router pages
│   ├── items/               # Catalog page (formerly /catalog)
│   ├── purchase-orders/     # PO list and detail pages
│   ├── login/               # Authentication page
│   └── page.tsx             # Home page (redirects to catalog)
├── components/              # Reusable UI components
│   ├── layout/             # MainAppLayout, Sidebar, Header
│   ├── ui/                 # Buttons, Cards, Tables, etc.
│   └── wizard/             # PO creation wizard steps
├── lib/                     # Core business logic
│   ├── api/                # API client and endpoints
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand state management
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
├── styles/                  # Global and module CSS
└── public/                  # Static assets
```

---

## Architecture

### Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 19 + Ant Design 5
- **State Management:** Zustand (client-side PO drafts)
- **HTTP Client:** Axios
- **Styling:** CSS Modules + Global CSS
- **Formatting:** Decimal.js for money calculations

## Environment Setup

Create a `.env.local` file in the root directory:

```bash
# API Base URLs
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_AUTH_URL=http://localhost:8000/api/v1/auth
NEXT_PUBLIC_ADMIN_URL=http://localhost:8000/api/v1/admin
NEXT_PUBLIC_CATALOG_URL=http://localhost:8000/api/v1/catalog
NEXT_PUBLIC_PROCUREMENT_URL=http://localhost:8000/api/v1/procurement

# Application Settings
NEXT_PUBLIC_APP_NAME="Refinery Procurement"
NEXT_PUBLIC_DEFAULT_PAGE_SIZE=20
```
