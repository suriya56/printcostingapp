# PrintEst Pro - Architecture & Logic Updates

## Architecture Overview
The application is a robust, full-stack quotation estimation tool designed for print shops.
- **Frontend**: React 18 with TypeScript, powered by Vite.
- **Styling**: Tailwind CSS for responsive, modern UI design.
- **Backend/API**: Express.js server providing RESTful endpoints for authentication, data processing, and PDF/CSV generation.
- **Database**: Google Cloud Firestore (Firebase), providing durable cloud persistence and real-time data synchronization.

## Recent Changes & Migrations

### 1. Real-Time Cloud Database Migration (Firestore)
Previously, the application relied on local JSON files (`papers.json`, `quotations.json`, etc.) on the server to store settings. We have migrated the entire data layer to **Firebase Firestore**.
- **Real-Time Sync**: The application now uses Firestore's `onSnapshot` listeners on the frontend. If an administrator updates paper prices, lamination costs, or printing brackets in the "Pricing Dashboard", those changes are instantly pushed to all active users' screens without requiring them to refresh the page.
- **Durable Storage**: Data is now safely backed up in the cloud, resolving issues with local file overwrites or container ephemeral storage loss.

### 2. Live Quotation Breakdown Fixes
We resolved a bug in the Calculator modes (Mode A and Mode B) where selecting certain paper profiles or custom papers would cause the "Live Quotation Breakdown" panel to disappear.
- **The Issue**: The live calculation functions (`calculateLive`) were strictly returning `null` if a paper profile was momentarily undefined or if a custom paper lacked complete object references.
- **The Fix**: We implemented graceful fallbacks (e.g., `const safeActivePaper = activePaper || { pricePerFullSheet: 0 };`) in both Mode A and Mode B. This ensures the calculation engine always returns a valid mathematical structure, keeping the live preview visible and responsive even during intermediate user input states.

## Core Logic & Data Flow
1. **Initial Load**: Upon login, the app establishes WebSocket connections to Firestore collections (papers, plates, brackets, quotations).
2. **State Management**: The React state acts as a mirror of the Firestore database. As Firestore updates, the React state updates, triggering UI re-renders.
3. **Calculation Engine**: The calculators (Mode A & Mode B) are purely client-side functions that take the current real-time pricing state and the user's input parameters to compute wastage, sheet counts, impressions, and final costs instantly.
4. **Saving Quotations**: When a user saves a quotation, an API call is made to the Express server, which then persists the structured quote into Firestore, subsequently triggering an update in the "Estimations Ledger" for all users.
