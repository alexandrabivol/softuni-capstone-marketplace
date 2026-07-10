# 🛒 MarketAI - Multi-Page Product Marketplace Platform

A robust, secure, and modern multi-page product marketplace platform built as a SoftUni AI Capstone Project. This application implements a full-stack architecture combining a Vite-powered front end with a live Supabase relational database backend.

## 🚀 Key Features

* **Multi-Page Architecture:** Explicit routing configuration across 5 entry points (`index.html`, `login.html`, `register.html`, `dashboard.html`, `admin.html`) ensuring clean viewport segregation.
* **Supabase Authentication:** Secured signup and session state validation logic integrated into modular client scripts.
* **Full Database CRUD Operations:** Users can create, view, and safely remove their personal marketplace product listings.
* **Role-Based Access Control (RBAC):** Built-in route guards that restrict administrative workflows strictly to users possessing an `admin` flag inside the database schema.
* **Responsive Bootstrap Interface:** Dynamic card layouts, clear visual cues, and optimized hover feedback tailored for desktop and mobile viewports.

## 🛠️ Technology Stack

* **Front End:** Vite, Vanilla JavaScript (ES6+ Blocks), Bootstrap 5, Custom CSS3
* **Back End & Database:** Supabase JS Client Client, PostgreSQL Relational Core
* **Version Control:** Git & GitHub Integration

## 📂 Project Architecture

```text
├── .github/                   # Configuration layers
├── src/
│   ├── services/
│   │   ├── supabase.js        # Supabase client initializer
│   │   └── auth.js            # Authentication event handlers
│   ├── main.js                # Global Bootstrap entry core
│   ├── index-view.js          # Marketplace search & feed render
│   ├── register.js            # Registration validation routines
│   ├── login.js               # Login form integration
│   ├── dashboard-view.js      # User storage & listing management
│   ├── admin-view.js          # Admin authorization checks
│   └── style.css              # Custom layout properties
├── supabase/
│   └── migrations/
│       └── 01_create_marketplace_tables.sql # Relational database definitions
├── index.html, login.html, register.html, dashboard.html, admin.html
├── vite.config.js             # Rollup multi-page build routes
└── .env                       # Environment environment variables