# BAMS — Blockchain Attendance Management System

This is a full-stack skeleton for a hierarchical blockchain-based attendance system:
Department → Class → Student → Attendance blocks.

## Setup

### Backend
1. `cd backend`
2. `npm install`
3. Ensure MongoDB is running locally or set `MONGODB_URI` env var.
4. `npm run dev` (or `npm start`)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000`

## Notes
- Blocks are built with a simple PoW (default difficulty: 4 leading zeros).
- Updates/deletes are represented by appending blocks (immutability preserved).
- Chains are stored as arrays of block objects inside MongoDB documents.

This skeleton is ready to expand with:
- search endpoints,
- bulk attendance marking,
- chain validation endpoints,
- UI polish (Tailwind / charts),
- authentication/authorization.
