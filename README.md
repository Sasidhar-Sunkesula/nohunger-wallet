# NoHunger-Wallet

## Overview

NoHunger-Wallet is a comprehensive food delivery platform with an integrated digital wallet system. The application allows users to browse restaurants, order food, and make payments using their in-app wallet. The wallet system supports features like balance management, locked funds for pending transactions, and bank integration for adding money.

## Key Features

- **Integrated Wallet System**: Secure digital wallet with support for:
  - Balance tracking (locked and unlocked funds)
  - P2P transfers between users
  - Payment processing for food orders
  - Transaction history

- **Food Ordering Platform**:
  - Restaurant browsing and filtering
  - Menu exploration
  - Cart management
  - Order tracking

- **Bank Integration**:
  - Mock bank interface for demonstration
  - Webhook system for transaction processing
  - Secure payment flow

## Project Architecture

The project is structured as a monorepo using Turborepo, containing multiple applications and shared packages:

### Applications

1. **User App** (`apps/user-app`)
   - Next.js application for the user-facing interface
   - Handles authentication, restaurant browsing, ordering, and wallet management
   - Communicates with the bank webhook for payment processing

2. **Bank Webhook** (`apps/bank-webhook`)
   - Express.js server that handles bank transaction webhooks
   - Processes incoming payment confirmations
   - Updates user balances by moving funds from locked to available

### Shared Packages

1. **Database** (`packages/db`)
   - Prisma ORM setup with PostgreSQL
   - Shared database schema and client

2. **UI Components** (`packages/ui`)
   - Reusable UI components shared across applications

3. **Store** (`packages/store`)
   - Redux store configuration
   - Shared state management

4. **TypeScript Config** (`packages/typescript-config`)
   - Shared TypeScript configurations

5. **ESLint Config** (`packages/eslint-config`)
   - Shared ESLint configurations

## Wallet System

The wallet system implements a dual-balance approach for secure transactions:

- **Available Balance**: Funds that can be spent immediately
- **Locked Balance**: Funds that are reserved for pending transactions

When a user initiates a transaction to add money:

1. Funds are first added to the locked balance
2. The bank webhook confirms the transaction
3. Funds are moved from locked to available balance

This approach prevents double-spending and ensures transaction integrity.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v10.2.4 or higher)
- PostgreSQL database

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/NoHunger-Wallet.git
   cd NoHunger-Wallet
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables
   - Create a `.env` files in both `apps/user-app` and `packages/db`
   - Check the `.env.example` file for required variables

4. Generate Prisma client

   ```bash
   npm run db:generate
   ```

### Running the Applications

1. Start the user app

   ```bash
   npm run dev
   ```

   This will start the Next.js application on <http://localhost:3000>

2. In a separate terminal, start the bank webhook

   ```bash
   cd apps/bank-webhook
   npm run dev
   ```

   This will start the webhook server

## Development

### Project Structure

```
├── apps/
│   ├── user-app/         # Next.js user application
│   └── bank-webhook/     # Express.js webhook server
├── packages/
│   ├── db/               # Prisma database configuration
│   ├── ui/               # Shared UI components
│   ├── store/            # Redux store
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
└── docker/               # Docker configuration files
```

### Available Scripts

- `npm run dev`: Start all applications in development mode
- `npm run build`: Build all applications
- `npm run lint`: Run linting on all applications
- `npm run db:generate`: Generate Prisma client
- `npm run start-user-app`: Start the user app in production mode
- `npm run start-webhook`: Start the bank webhook in production mode

## Deployment

The project includes Docker configuration for containerized deployment:

1. Build the Docker images

   ```bash
   docker build -f docker/Dockerfile.user -t nohunger-user .
   docker build -f docker/Dockerfile.webhook -t nohunger-webhook .
   ```

2. Run the containers

   ```bash
   docker run -p 3000:3000 nohunger-user
   docker run -p 3001:3001 nohunger-webhook
   ```
