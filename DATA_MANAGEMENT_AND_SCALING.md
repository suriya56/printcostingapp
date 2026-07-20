# Press Costing Calculator: System Build & Data Scaling Guide

This document provides a detailed overview of the technical architecture of the Press Costing Calculator application, how its data is managed, and how its Firestore database operations scale under your team's daily workload.

---

## 1. How the Application is Built

The Press Costing Calculator is built as a modern, high-performance, responsive Single-Page Application (SPA) using a robust and modern tech stack.

### Tech Stack Overview
*   **Frontend Framework:** React 19 (using modern functional components and hooks).
*   **Build Tool & Dev Server:** Vite 6. Vite provides ultra-fast development reloads and outputs optimized, highly compressed production assets.
*   **Programming Language:** TypeScript (ensuring complete compile-time type safety, structured data contracts, and bug prevention).
*   **Styling:** Tailwind CSS (for an elegant, highly responsive, utility-first user interface with seamless support for light/dark mode).
*   **Animations:** `motion` (via `motion/react` for smooth, low-overhead micro-interactions and tab transitions).
*   **PDF Generation:** `jspdf` and `jspdf-autotable` (for clean, high-resolution client-side export of quotations).

### Build & Run Pipeline
*   **Development Script:** `npm run dev` (starts the Vite bundler locally on port 3000).
*   **Production Build Script:** `npm run build` (compiles and minifies TypeScript and Tailwind assets into a lightweight static bundle inside the `/dist` directory).
*   **Deployment Model:** Can be hosted serverlessly on services like Vercel, Firebase Hosting, or Cloud Run. The built bundle runs entirely in the user's browser, fetching and writing data directly to Firestore.

---

## 2. How the Data is Managed

The application is designed around an **Offline-First, Real-Time Architecture** using Google Firebase (Firestore Database and Firebase Authentication).

### Architecture Highlights
1.  **Direct-to-Client Web SDK:** The application connects directly from the browser to Firestore using the secure Firebase Web SDK. This eliminates the need for an intermediate server, minimizing loading times and reducing points of failure.
2.  **Mock API Abstraction Layer (`mockApi.ts`):** To preserve a clean REST-like standard, the application routes backend operations through a clean abstraction called `apiFetch`. This translation layer handles POST, PUT, and DELETE operations, mapping them safely to Firestore documents.
3.  **Real-Time Subscriptions (`onSnapshot`):**
    *   **Catalog Data:** The pricing structures (`papers`, `lamination`, `plate-profiles`, `misc-costs`, and `brackets/main`) are loaded using real-time listeners on startup. If an administrator edits a paper price or laminating rate, every open browser tab updates instantly without refreshing.
    *   **Lazy Loading for History:** The quotation history listener is **only active** when a user actively clicks on the "History" tab. This keeps operational reads to an absolute minimum during normal calculations.
4.  **Local Offline Cache & Multi-Tab Syncing:**
    *   The database client is initialized with **Firestore Persistent Cache** (`persistentLocalCache` with `persistentMultipleTabManager`).
    *   This caches data locally in the browser’s indexedDB. If employees have multiple tabs open, or their internet connection drops, the app remains fully functional, queueing updates to sync once connection is restored. It also dramatically reduces Firestore read counts by reusing cached data.

---

## 3. Workload Analysis: 4 Employees, 20+ Costings Per Day

This section simulates the exact expected database reads, writes, and storage footprint for your team of **4 employees** performing an average of **20 costing calculations/saves per day** (total of **80 operations/day**).

### A. expected Daily Writes
Every time an employee finishes a calculation and clicks **"Save to History"**, a single write operation is performed to create or update a document in the `quotations` collection.

*   **Costings Saved per Day:** 4 employees × 20 costings = **80 writes/day**.
*   **Admin Edits/Updates:** Let's assume administrative staff update paper prices or plates 10 times a day (highly conservative).
*   **Total Expected Writes:** **~90 writes/day**.

> **Spark Plan Allowance:** **20,000 writes/day for free**.
> **Your Usage:** **0.45%** of the free daily allowance.

### B. Expected Daily Reads
Reads happen during three events: app loading, real-time syncs, and viewing history.

1.  **App Loading (Initial Read):**
    When an employee opens the app or refreshes, the initial sync loads the catalog collections. Let's assume you have a substantial inventory catalog:
    *   `papers` catalog: ~30 papers
    *   `lamination` profiles: ~5 rates
    *   `misc-costs`: ~10 profiles
    *   `plate-profiles`: ~10 sizes
    *   `brackets`: 1 main document
    *   **Total reads on full load:** **56 reads**.
    *   If 4 employees load/refresh the app 5 times a day: 4 × 5 × 56 = **1,120 reads/day**.
    *   *(Note: Thanks to local persistent caching, subsequent loads will often cost 0 reads as Firestore checks metadata instead of downloading documents again.)*

2.  **Viewing History:**
    When clicking the **History** tab, the app loads the latest 50 quotations (`limit(50)`).
    *   If each employee opens the History tab 10 times a day: 4 × 10 = 40 history views.
    *   Each view queries up to 50 documents: 40 × 50 = **2,000 reads/day**.
    *   *(Note: Firestore Web SDK is smart; if the documents are already in the local cache and haven't changed, they cost 0 reads from your network quota.)*

3.  **Real-Time Synchronization Updates:**
    When Employee A saves a quotation, if Employee B is looking at the History tab, the change is pushed to Employee B (1 read). This is negligible.

*   **Total Expected Reads:** 1,120 (loads) + 2,000 (history queries) = **~3,120 reads/day**.

> **Spark Plan Allowance:** **50,000 reads/day for free**.
> **Your Usage:** **6.24%** of the free daily allowance.

### C. Expected Storage Accumulation
Quotation documents in Firestore are stored as structured JSON. A standard quotation (containing input parameters, mode flags, date, user info, and breakdown costs) is extremely small.

*   **Average Quotation Document Size:** **~1.5 KB**.
*   **Daily Accumulation:** 80 quotations × 1.5 KB = **120 KB/day**.
*   **Annual Accumulation:** 120 KB × 365 = **43.8 MB/year**.

> **Spark Plan Allowance:** **1.0 GB (1,024 MB) of storage for free**.
> **Time to reach the free limit:** **~23 years** of continuous data logging!

---

## 4. Scaling Verification & Performance

### Will it endure?
**Yes, absolutely and effortlessly.**
The Firestore serverless engine is built to scale to millions of users and handle tens of thousands of requests *per second*. A team of 4 employees performing 20 costings a day is exceptionally light, representing less than **1%** of what the database can process on its **free Spark tier**.

### Key Technical Advantages of this Setup
1.  **Zero Server Cold Starts:** Because this is a static client-side React SPA querying Firestore directly, there is no backend server to "sleep" or experience lag. Calculations and data retrievals will feel instantaneous.
2.  **Zero Overhead Hosting Costs:** You can run both the database and the frontend completely for free on the Spark plan indefinitely.
3.  **No Lockouts or Session Loss:** Because local persistence is enabled, if an employee loses connection mid-calculation, their input is preserved, and saving will resume the moment connection is re-established.
