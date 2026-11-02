# CivicFix --- Master Build Specification

**For Codex / Google Antigravity \| Version 1.0**

## 1. Purpose

Build **CivicFix**, a civic engagement and municipal accountability
platform. Residents can (1) report an existing public problem that needs
repair or maintenance and (2) request a public facility or improvement
that does not exist in their locality. Municipal staff use separate
role-based workspaces to review, assign, update, and measure work.

This document is the build brief for the coding agent. It combines the
selected CivicFix direction with the eight Cognifyz internship task
divisions. Some technical/product decisions remain unconfirmed; see
Section 5. Do not silently treat recommendations as user-approved
decisions.

## 2. Product principles

-   Solve a real civic problem; do not build a generic CRUD demo with a
    civic theme.
-   Keep **Issue Reports** and **Facility Requests** as separate domain
    concepts with separate workflows.
-   Record who changed a status, when, and why.
-   Protect personal information and staff-only notes.
-   Enforce authorization on the server, not merely by hiding frontend
    buttons.
-   Make the interface responsive, accessible, and understandable.
-   Prefer simple, maintainable engineering over unnecessary complexity.
-   Do not add AI, OAuth, queues, maps, or other advanced features just
    for decoration. Each must solve a defined problem.

## 3. Users and permissions

### Citizen

Can register/sign in, submit issue reports, submit facility requests,
view their own submissions and histories, provide requested information,
receive notifications, and provide feedback on resolved issues. Cannot
access other citizens' private records, staff notes, assignment
controls, or administrative functions.

### Municipal Officer

Can review submissions in their authorized department/assignment scope,
request information, verify, assign/update work where permitted, add
internal notes, publish citizen-visible updates, and attach completion
evidence. Cannot self-promote or rewrite audit history.

### Department Administrator (proposed)

May manage officers and workload within one department, assign/reassign
work, and view department-level metrics.

### Super Administrator (proposed)

May manage platform-wide users, roles, departments, categories,
configuration, and audit/operational views.

Confirm whether both administrator roles are needed in the MVP.
Centralize authorization policies so the role model can evolve without
rewriting route handlers.

## 4. Core product experience

### Separate role-based homepages

**Citizen dashboard** - Main actions: **Report an Issue** and **Request
a Facility**. - Counts for the citizen's own open, in-progress, and
closed submissions. - Recent updates, links to **My Issue Reports** and
**My Facility Requests**. - Community feed/map only if the visibility
policy is approved.

**Municipal staff dashboard** - New submissions awaiting review. -
Assigned, in-progress, and overdue work. - Filters by department,
category, status, date, and locality. - Review queue, submission detail,
assignment/status actions. - Workload and resolution metrics within the
user's permission scope.

Do not create one dashboard for every role and rely only on hidden
buttons. Route users to the correct dashboard and filter server-side
data by permission.

### Service A: Report an Issue

Use this when something already exists but is damaged, unsafe,
overflowing, blocked, broken, or neglected.

Suggested categories: 1. **Streetlight & Electrical:** broken
streetlights, damaged lamp posts, exposed public wiring. 2. **Garbage &
Sanitation:** overflowing bins, missed collection, illegal dumping,
unclean public spaces. 3. **Road & Footpath:** potholes, damaged
roads/footpaths, open manholes, damaged dividers. 4. **Water &
Drainage:** leaks, blocked drains, waterlogging, damaged drainage
covers, public water-supply problems. 5. **Public Spaces & Facilities:**
damaged park equipment, benches, public toilets, neglected community
spaces. 6. **Public Safety & Signage:** damaged/missing traffic signs,
faded crossings, damaged barriers, missing warnings.

### Service B: Request a Facility

Use this when a public facility or infrastructure is missing or a new
improvement is needed.

Suggested categories: 1. Streetlight installation. 2. Public dustbin
installation. 3. Public drinking-water facility. 4. Road and pedestrian
infrastructure. 5. Public transport facility. 6. Public amenities and
community spaces. 7. Drainage and sanitation infrastructure. 8. Other
community development request.

Capture the requested facility, reason/benefit, locality/location,
optional supporting evidence, and nearby landmark.

**Mandatory distinction:** broken streetlight = issue; no streetlight
exists = facility request. Overflowing bin = issue; no bin exists =
facility request. Damaged drain = issue; new drainage infrastructure
needed = facility request.

Categories/subcategories should be configurable data, not duplicated
hard-coded lists in multiple layers.


## 4A. Interactive City Map and Municipal Insights Dashboard — core product requirement

The map and analytics experience is a major CivicFix feature, not a decorative add-on. Build it in stages, using real database-backed records once persistence is implemented. Until then, clearly label all sample/demo data.

### Interactive map
Show the geographic locations associated with public issue reports and facility requests, subject to the approved privacy policy. Use recognizable category icons: road/construction for potholes, trash/bin for garbage, lightbulb for streetlights, water drop for leakage, drainage/waves for blocked drains, and a public-building icon for damaged facilities. Status must also be communicated accessibly; do not rely on color alone.

Selecting a marker should open a popup/detail panel containing the reference number, title, category, approximate public-problem location, submission date, current status, latest public update, description, permitted evidence images, and a link to the full record subject to permissions.

Never expose the reporter's phone number, email, home address, private attachments, or staff-only notes in public map popups. A public problem location is not automatically the reporter's home location.

### Map controls and usability
Include:
- Zoom and pan.
- Marker clustering for dense areas.
- A legend for category icons and status indicators.
- Filters for issue vs facility request, category, status, date range, locality, and department where permitted.
- Locality/address search if a suitable geocoding provider is selected.
- A synchronized list view for accessibility and users who prefer lists.
- Loading, empty, permission-denied, and map-provider-error states.
- Manual location entry as a fallback if geolocation or external map services fail.
- Responsive behaviour on mobile and desktop.

Check map-provider terms, attribution, quotas, and production suitability before integration. Never commit API keys. Keep the rest of the application useful if the map provider is unavailable.

### Status and workflow insights
Show separately labelled metrics for:
- Resolved/completed issue reports.
- Issues currently in progress.
- New or awaiting-review issue reports.
- Verified/assigned issues where work has not started.
- Reopened, rejected, duplicate, or overdue issues where useful.
- Facility requests awaiting sanction/approval.
- Facility requests approved but not yet scheduled or started.
- Facility requests scheduled or in progress.
- Facility requests implemented/closed.
- Facility requests rejected or deferred, with reasons.

Do not collapse different meanings into one ambiguous “pending” count:
- “Not sanctioned” means a facility request is awaiting an official approval/sanction decision (or has been explicitly rejected/deferred, if the dashboard separately labels those outcomes).
- “Not started” means a work item has been approved/accepted but physical or operational work has not begun.
- An issue awaiting verification/review is not the same as approved work that has not started.
- “In progress” and “resolved” must be calculated separately for issue reports and facility requests before showing combined totals.

Use separate dashboard sections or filters for **Issue Reports** and **Facility Requests**. If combined city-wide totals are displayed, document exactly which states are included in each metric.

### Analytics
Useful charts include status distribution, reports by category, reports by locality/ward, monthly submissions vs resolutions, average time to first review and resolution, overdue workload, facility requests by sanction status, and department workload/resolution performance.

Metrics must come from persisted records and have documented definitions. Use consistent date ranges and denominators. Do not call a number a “resolution rate” without defining its numerator and denominator. Never present demo numbers as real municipal performance.

### Role-specific visibility
- Citizens see approved public map information and their own private submission details.
- Officers see only records and operational filters within their authorized department/assignment scope.
- Department administrators see department metrics if that role is approved.
- Super administrators may see platform-wide aggregates if that role is approved.

Map endpoints and analytics APIs must enforce the same backend authorization and privacy rules as normal record endpoints.

### Implementation stages
- M1–M3: establish location fields in forms; optionally create a visual map/dashboard prototype using clearly labelled sample data.
- M4–M5: implement map interactions, filters, synchronized list/map views, and APIs for map markers and summary metrics.
- M6: connect the map and dashboard to persistent records and enforce role-based visibility.
- M7: integrate the selected map/geocoding provider, attribution, rate limits, fallback behaviour, and privacy-aware location handling.
- M8: add caching for suitable aggregate queries and background aggregation/refresh only when justified.

## 5. Decision register --- not yet confirmed

These are recommendations only. Ask the project owner before hard-coding
choices that materially affect architecture. If work must begin earlier,
document a temporary assumption and keep it configurable.

  -----------------------------------------------------------------------
  Decision                Recommended starting    Status
                          point                   
  ----------------------- ----------------------- -----------------------
  Initial geography       Kolkata/Howrah pilot,   Unconfirmed
                          expandable to other     
                          cities                  

  Public visibility       Public feed may show    Unconfirmed
                          approved/redacted       
                          reports; personal       
                          details remain private  

  Staff structure         Department-based        Unconfirmed
                          officers; decide        
                          whether department      
                          admins are in MVP       

  Facility requests       Staff review/decision   Unconfirmed
                          first; community voting 
                          can be a later optional 
                          feature                 

  Frontend                Start with EJS for the  Unconfirmed
                          server-rendering        
                          milestone; later        
                          introduce client-side   
                          routing if selected     

  Database                PostgreSQL is a strong  Unconfirmed
                          fit for relational data 
                          and audit history       

  Authentication          Secure server-side      Unconfirmed
                          sessions; OAuth only    
                          for a selected real use 
                          case/provider           

  Maps/geocoding          Select an open or       Unconfirmed
                          suitable provider after 
                          checking terms, quotas, 
                          attribution, and        
                          availability            

  Deployment              Decide after the local  Unconfirmed
                          MVP and environment     
                          needs are clear         
  -----------------------------------------------------------------------

Do not invent API keys, OAuth credentials, official municipal
integrations, or real government partnerships. Treat the product as a
prototype unless an actual integration is established.

## 6. Proposed technical architecture

The Cognifyz task sheet is the delivery framework. Its tasks cover HTML
forms, Node.js/Express, server-side rendering, validation, responsive
styling, DOM interaction/client-side routing, REST CRUD APIs,
database/authentication/authorization, external APIs, rate limiting,
middleware, background jobs, and caching.

Suggested stack, subject to confirmation: - Node.js (current LTS when
project setup occurs). - Express server. - EJS for the initial
server-rendered milestone. - HTML, CSS, JavaScript; Bootstrap may be
used for responsive styling. - A later client-side app/router only if
the architecture decision calls for it. Avoid two competing frontends. -
PostgreSQL recommended; use migrations and parameterized queries or a
maintained ORM/query builder. - Session-based web authentication. -
Server-side validation for every untrusted input. - Redis/queue only
when a real background-job or caching use case is implemented. -
Automated tests at unit, integration, and end-to-end levels.

Keep architecture layers separate: - **Routes/controllers:** HTTP
handling. - **Services:** business rules and workflow transitions. -
**Repositories/data access:** database operations. - **Validators:**
input validation. - **Policies:** authorization decisions. -
**Middleware:** authentication, parsing, logging, rate limiting, error
handling. - **Views/UI:** presentation, not core business logic. -
**Jobs:** asynchronous work. - **Config:** validated environment-based
configuration.

Avoid giant route files containing SQL, business logic, notifications,
and HTML rendering together.

## 7. Proposed data model

Confirm the database and workflows before finalizing schema. Suggested
conceptual entities: - `users` - `roles` / `user_roles` (if multiple
roles per user are supported) - `departments` - `categories` /
`subcategories` - `issues` - `facility_requests` - `assignments` -
`issue_status_history` - `facility_request_status_history` -
`attachments` (metadata; files stored separately) - `notifications` -
`audit_logs` - `comments` or `updates`, with explicit public vs internal
visibility

Do not merge issue reports and facility requests into one generic
complaints table with a shared lifecycle.

Data integrity: - Primary/foreign keys and appropriate constraints. -
Index common filters (status, category, department, created date,
locality, assignee). - Store timestamps consistently (UTC in storage;
localize for display). - Use transactions for multi-step operations. -
Preserve status and assignment history. - Define deletion/retention
rules; use controlled archival where auditability matters. - Never store
plaintext passwords.

Location: - Capture a human-readable location/landmark and optionally
latitude/longitude with user consent. - Validate coordinate ranges. - A
reported public-problem location is not automatically the reporter's
home address. - Do not expose private home/contact information in public
views.

## 8. Workflows

Implement transitions through service functions that validate allowed
transitions and actor permissions. Never accept arbitrary status strings
from the client.

### Issue workflow (proposed)

`Submitted → Under Review → Verified / Assigned → In Progress → Resolved → Citizen Feedback / Closed`

Possible side states: `Needs Information`, `Rejected` (reason required),
`Duplicate` (link to canonical report where appropriate), `Reopened`
(reason and history required).

### Facility-request workflow (proposed)

`Submitted → Under Review → Needs Information (optional) → Approved / Rejected / Deferred → Scheduled / Assigned → Implemented / Closed`

Approval does not mean funded or immediately scheduled.
Rejection/deferral needs a clear citizen-visible reason. Scheduling
dates must come from an authorized staff action. Community voting may be
a later feature and must never be represented as official approval.

For every status transition, record entity type/ID, previous and new
status, actor, timestamp, reason/update, and visibility (`public` or
`internal`) where relevant.

## 9. Security and privacy requirements

Apply from the beginning: - Hash passwords with a reputable
password-hashing library (Argon2id or bcrypt, configured
appropriately). - Use secure, HTTP-only, same-site cookies and HTTPS in
deployed environments. - Protect cookie-authenticated state-changing
requests against CSRF. - Validate and normalize all inputs on the
server. - Use parameterized database operations. - Enforce authorization
on every protected route and resource lookup. - Prevent insecure direct
object references: users must not access records by guessing IDs. -
Rate-limit login, registration, and sensitive submission endpoints. -
Restrict upload size/type; verify actual file content, not just
extension; store files safely. - Escape untrusted content in rendered
HTML to prevent XSS. - Never log passwords, tokens, session IDs, or
secrets. - Keep secrets in environment variables; commit only
placeholder names in `.env.example`. - Return safe user-facing errors
and log diagnostic details server-side. - Separate internal notes from
citizen-visible updates. - Audit role changes, administrative actions,
assignments, and status changes. - Do not claim legal/regulatory
compliance without an appropriate review.

## 10. Eight implementation milestones aligned to Cognifyz

For each milestone, save screenshots/evidence, tests, and a short
learning note.

### M1 --- Task 1 (internship PDF p.6): HTML forms, Express endpoints, EJS

Deliver: Node/Express setup, start scripts, EJS layout/pages, citizen
issue form, separate facility-request form, POST endpoints, basic
success/error rendering, initial folder structure.

Learn: HTML structure, labels/inputs/textarea/buttons, `name`, `method`,
`action`; Node/npm; Express app, middleware, routes, request/response;
GET vs POST; HTTP status codes; EJS variables/partials; server-side
rendering and form request flow.

Acceptance: both forms render; valid submissions reach the correct
endpoint; server returns a useful result; missing required fields do not
silently succeed.

### M2 --- Task 2 (PDF p.7): client/server validation and temporary storage

Deliver: client-side usability checks, independent server validation,
field-level errors, in-memory demonstration storage, confirmation/error
states.

Learn: browser constraints vs JavaScript validation; why client checks
can be bypassed; body parsing; data structures; validation and
sanitization.

Acceptance: server rejects invalid data even if browser validation is
bypassed; valid data is held during runtime; docs clearly state
in-memory data disappears on restart and is not production persistence.

### M3 --- Task 3 (PDF p.8): responsive design and CSS

Deliver: responsive citizen homepage, separate staff dashboard layout
(mock data acceptable initially), navigation, cards, lists/tables,
status indicators, empty states, accessible focus states, purposeful
transitions.

Learn: cascade, specificity, box model, Flexbox, Grid, breakpoints,
semantic HTML, keyboard navigation, contrast, reduced motion.

Acceptance: no horizontal overflow at common viewport widths;
forms/navigation work on mobile; status is not conveyed by color alone.

### M4 --- Task 4 (PDF p.9): complex validation, DOM updates, client routing

Deliver: stronger validation (including password rules when
authentication is added), dynamic category/subcategory controls,
character counters/conditional sections, dynamic status/history display,
and a client-side routing demonstration or documented migration if
selected.

Learn: DOM tree, selectors, events, listeners, client vs server routing,
progressive enhancement. Password strength feedback is not a substitute
for secure password storage.

Acceptance: dynamic controls are accessible; server validation remains
authoritative; routing ownership is documented and not
duplicated/conflicting.

### M5 --- Task 5 (PDF p.10): REST CRUD API and frontend integration

Deliver: separate REST resources for issues and facility requests;
frontend fetches/displays API data; loading/empty/success/error states;
pagination/filtering as needed; API documentation.

Possible route shape (adapt after design): - `POST /api/issues` -
`GET /api/issues` - `GET /api/issues/:id` - `PATCH /api/issues/:id`
(authorized fields only) - `POST /api/facility-requests` -
`GET /api/facility-requests` - `GET /api/facility-requests/:id` -
`PATCH /api/facility-requests/:id` (authorized fields only)

Do not expose unrestricted update/delete. Prefer explicit workflow
actions for status transitions.

Learn: REST resources/methods/status codes, JSON, headers, fetch,
promises, async/await, API error formats and pagination.

Acceptance: API works through tests/API client; frontend consumes it;
unauthorized actions fail; the two workflows remain separate.

### M6 --- Task 6 (PDF p.11): database, authentication, authorization

Deliver: persistent database/migrations; users and roles; separate
issue/request records; departments/assignments if confirmed; status
history/audit; registration/login/logout/session; role-aware dashboards
and protected routes.

Learn: relational modelling, keys, joins, indexes, migrations,
transactions, password hashing, sessions, authentication vs
authorization, record-level permissions.

Acceptance: data survives restarts; citizens access only their own
private records; officers access only their authorized scope; backend
enforces roles; passwords are never plaintext; tests cover cross-user
and unauthorized access.

### M7 --- Task 7 (PDF p.12): OAuth/external APIs/rate limits/errors

Deliver: choose a real external API use case (e.g. geocoding/map);
document terms, attribution, quotas, secrets, and failure behaviour; add
location/map features if approved; rate-limit relevant endpoints; add
timeouts and graceful failure. Implement OAuth only if a provider and
genuine use case are selected; otherwise document a justified
demonstration strategy and confirm how the internship requirement will
be addressed.

Learn: API keys, environment config, OAuth redirects/scopes/state if
used, external API responses, timeouts/retries, rate limits, geocoding
accuracy and consent.

Acceptance: app remains usable if provider is down; no secret in Git;
limits return clear errors; external data is treated as untrusted.

### M8 --- Task 8 (PDF p.13): middleware, background jobs, caching

Deliver: request logging with redaction, centralized error middleware,
correct parsing/security middleware, a genuine background task
(e.g. notifications), queue/Redis if justified, cache a clearly
identified read-heavy resource with expiry/invalidation, operational
notes.

Learn: middleware order and `next()`, request-response vs jobs,
queues/workers/retries/idempotency, cache keys/TTL/invalidation,
logging.

Acceptance: consistent errors; background work does not unnecessarily
block requests; failed jobs can be inspected/retried safely; cache
invalidates after relevant writes; logs do not leak sensitive data.

## 11. Suggested repository structure

Adapt to the final architecture. Do not create empty directories just to
match this illustration.

``` text
civicfix/
├── README.md
├── PROJECT_TRACKER.md
├── DEVELOPMENT_LOG.md
├── ARCHITECTURE.md
├── API_DOCUMENTATION.md
├── TESTING.md
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   ├── policies/
│   ├── validators/
│   ├── jobs/
│   ├── views/
│   └── public/
│       ├── css/
│       ├── js/
│       └── images/
├── database/
│   ├── migrations/
│   └── seeds/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docs/
    ├── decisions/
    ├── screenshots/
    └── milestones/
```

If a React frontend is chosen later, use a clearly separated `client/`
directory and document its communication with the Express API. Do not
duplicate business rules in the browser.

## 12. Testing strategy

Write tests with features, not only at the end: - Validation tests for
missing, malformed, and oversized inputs. - Service tests for
allowed/forbidden workflow transitions. - API integration tests for
success/error cases. - Authentication/session tests. - Authorization
tests for role boundaries and record ownership. - Upload tests if
uploads are enabled. - End-to-end tests for citizen and staff
journeys. - Regression tests for fixed bugs.

Critical scenarios: 1. Citizen submits an issue and sees it in their own
issue list. 2. Citizen submits a facility request and sees it
separately. 3. Citizen cannot read another citizen's private record by
guessing its ID. 4. Officer cannot update records outside their
authorized scope. 5. Rejected facility request includes a reason. 6.
Status changes create history entries. 7. Map/geocoding failure does not
prevent manual location entry. 8. Notification failure can be retried
without duplicate notifications.

## 13. Project documentation

Maintain these files throughout development: - `README.md`: overview,
features, setup, scripts, screenshots, limitations. -
`PROJECT_TRACKER.md`: milestones, checklist, status, blockers,
acceptance evidence. - `DEVELOPMENT_LOG.md`: what was built/learned,
decisions, bugs. - `ARCHITECTURE.md`: components, request flow, data
model, role boundaries. - `API_DOCUMENTATION.md`: endpoints,
authentication, examples, errors. - `TESTING.md`: test commands and
coverage. - `docs/decisions/`: architecture decision records. -
`docs/milestones/`: screenshots/evidence for each internship task.

Never mark a feature complete unless it runs and acceptance criteria
have been checked.

## 14. Required coding-agent workflow

### Before coding

1.  Read this whole document.
2.  Inspect the repository before changing anything.
3.  Preserve existing work; summarize what is already present.
4.  List unresolved decisions from Section 5.
5.  Ask only concise questions that materially affect architecture; do
    not ask for information already provided.
6.  Propose a milestone plan, dependencies, risks, and assumptions.
7.  Explain how each internship task will be demonstrated.

### During implementation

1.  Work one milestone or small vertical slice at a time.
2.  Explain the planned change before large structural changes.
3.  Prefer readable, maintainable code.
4.  Use descriptive names; avoid unexplained abbreviations and magic
    values.
5.  Comment non-obvious reasoning, not every obvious line.
6.  Validate all untrusted input on the server.
7.  Add/update tests for each meaningful behaviour.
8.  Run tests, linting, and relevant build/start commands after changes.
9.  Fix errors before proceeding.
10. Do not silently remove existing functionality.
11. Never invent credentials, integrations, or municipal data.
12. Add AI only when its problem, data, evaluation, and fallback are
    defined.
13. Keep dependencies minimal and explain each new dependency.

### At the end of each milestone

Report files changed, features completed, commands run/results,
tests/results, limitations, manual verification steps, and a
beginner-friendly explanation of the important code paths. Update
`PROJECT_TRACKER.md` and `DEVELOPMENT_LOG.md`.

Do not begin the next milestone until acceptance criteria pass, unless
the project owner explicitly approves a documented blocker.

## 15. Learning mode --- mandatory

The project owner wants to understand the code deeply, not merely
receive generated files. For every milestone, teach one file or logical
code path at a time.

Explain: - Each file's responsibility. - How a browser request travels
through the app. - What important functions receive and return. -
Important keywords, operators, punctuation, symbols, and syntax. -
Object/array literals; strings, numbers, booleans, `null`;
destructuring; callbacks; promises; async/await. - Middleware and route
execution order. - How data is validated, transformed, stored, queried,
and returned. - How frontend state changes and how API responses update
the UI. - Why a design was selected and what alternatives exist. -
Common bugs and debugging methods. - How to explain the feature in an
interview.

Do not dump an enormous explanation of the whole repository at once.
Teach incrementally and check understanding before proceeding.

## 16. MVP definition of done

The MVP is demonstrable when: - A citizen can register/sign in. - A
citizen can submit an issue report. - A citizen can submit a separate
facility request. - A citizen can view and track their own
submissions. - An authorized officer can review/update submissions
within their scope. - Issue and facility workflows are distinct and
enforced. - Important actions have status history. - Validation and
authorization are server-side. - Data persists in the chosen database. -
UI works on mobile and desktop. - Tests cover main journeys and
access-control risks. - Setup and documentation are accurate.

Voting, sophisticated analytics, AI classification, and real municipal
integrations are not MVP requirements unless explicitly approved.

## 17. First instruction to Codex / Antigravity

**Do not generate the entire application immediately.**

First: 1. Inspect the repository. 2. Summarize this specification. 3.
List unresolved decisions that block architecture. 4. Recommend a
minimal milestone-aligned plan. 5. Wait for approval of decisions and
Milestone 1 scope.

After approval, implement **Milestone 1 only**, demonstrate it, explain
the code, and wait for approval before continuing.
