# UI Architecture & Design System

## 1. Philosophy
High-density, single-screen utility. Minimize whitespace and scrolling.

## 2. Color Palette (Tailwind)
- **App Bg:** `bg-slate-200`
- **Header:** `bg-slate-800`
- **Workspace:** `bg-slate-300`
- **Input Panels:** `bg-slate-50`
- **Result Panels:** `bg-white`
- **Actions/Active Tabs:** `bg-blue-600 text-white shadow-inner`
- **Totals:** `bg-green-50` or `bg-blue-50`
- **Editable Inputs:** `bg-yellow-50`

## 3. Typography
- **Primary:** Sans-serif (`text-sm`, `text-xs`)
- **Numeric:** `font-mono`

## 4. Layout Structure
Container: `min-h-screen flex flex-col`

### 4.1 Header
- `shrink-0`. Contains Logo, Version, Navigation (`bg-slate-900` pill-box).

### 4.2 Workspace
- `flex-1 overflow-hidden` (internal `overflow-y-auto`).
- **Mode A Layout:** 3-col grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- **Mode B Layout:** 4-col grid (`grid-cols-1 lg:grid-cols-4`).

### 4.3 Footer
- Fixed height, `text-slate-500 text-xs`.

## 5. Components

### 5.1 Input Panels
- `border-slate-300 rounded-sm gap-2 p-2`.
- **Headers:** Bold, `border-b border-slate-300`.
- **Rows:** `grid grid-cols-2 items-center gap-1`. Left labels (`text-slate-600`), right inputs.
- **Inputs:** `py-0.5 px-1`.

### 5.2 Result Panels
- `bg-white shadow-sm`.
- **Rows:** `flex justify-between items-center py-0.5`.
- **Total:** `bg-blue-50 border-blue-200`, bold.

### 5.3 Admin Panel
- Responsive grid. Cards for groupings.
- Inline array editing (no modals).
