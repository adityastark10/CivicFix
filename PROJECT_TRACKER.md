# CivicFix — Project Milestone Tracker

## Cognifyz Internship Alignment & Status

| Milestone | Curriculum Focus | Status | Key Deliverables |
| :--- | :--- | :---: | :--- |
| **Milestone 1** | HTML Forms, Express Endpoints, EJS | 🔄 In Progress | Project structure, Citizen Registration UI, Login UI, Form Validation, Express routes. |
| **Milestone 2** | Client/Server Validation, Runtime Storage | ⏳ Queued | Temporary in-memory storage, strict server sanitization. |
| **Milestone 3** | Responsive Design, CSS & Accessibility | ⏳ Queued | Mobile-first Flexbox/Grid, accessible status indicators. |
| **Milestone 4** | Complex Validation, Dynamic DOM & Routing | ⏳ Queued | Dependent category dropdowns, timeline rendering. |
| **Milestone 5** | REST CRUD APIs & Frontend Integration | ⏳ Queued | Decoupled REST endpoints for Issues and Facility Requests. |
| **Milestone 6** | Database, Auth & RBAC Authorization | ⏳ Queued | Relational schema, bcrypt/argon2, session authentication. |
| **Milestone 7** | Interactive Map, Heatmap & Rate Limiting | ⏳ Queued | Leaflet.js city map, locality heatmap, rate limits. |
| **Milestone 8** | Middleware, Background Jobs, Analytics | ⏳ Queued | Centralized error handling, Redis cache, Municipal Dashboard. |

---

## Detailed Acceptance Checklist

### Citizen Registration & Authentication UI (Current Step)
- [x] Initialized Git repository and npm package manifest (`package.json`).
- [x] Installed core dependencies: `express`, `ejs`, `dotenv`, and `nodemon`.
- [x] Configured Express app, EJS view engine, and static asset middleware.
- [x] Created dark theme UI layout matching user reference specifications.
- [x] Implemented all 13 registration fields across 3 clean sections:
  - Personal Details: Full Name, Phone Number, Email, Aadhaar Number.
  - Location Details: State, District, Local Gov Type, Local Body Name, Ward, Locality, PIN Code.
  - Account Security: Password, Confirm Password.
- [x] Dynamic dependent dropdowns (State -> District -> Local Government Type -> Administrative Body).
- [x] Live client-side formatting & validation (Phone, Email, Aadhaar, PIN code, password strength meter).
- [x] Authoritative server-side validation in `src/controllers/auth.controller.js` returning HTTP 422 with field-level errors on failure.
- [x] Confirmation screen (`/register-success`) echoing validated data with masked Aadhaar.
- [x] Separate Citizen Login page (`/login`) requiring Phone Number and Password.
