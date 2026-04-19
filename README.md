# Hotel Management SaaS (Lumiere Estate)

This project is a full-stack hotel management and booking platform prototype with:

- A React + TypeScript frontend (customer-facing pages, account area, admin dashboard)
- A Quarkus microservice backend (user, inventory, booking, payment)

The UI is highly complete and interactive. The backend services expose real REST APIs. At the moment, the frontend is mostly running with mock/demo data and is not yet wired to backend APIs.

## What the Website Can Do Right Now

### 1. Public Website (Guest-Facing)

- Browse the hotel homepage with hero search bar and highlighted room categories.
- Use a custom booking search UI with destination, check-in/check-out dates, and guest/room selectors.
- Navigate to room search results.
- View room search results with amenity filters, room cards, pricing, and reserve actions.
- Browse dedicated content pages: Amenities, Contact, Experiences, FAQ, Privacy Policy, and Terms of Service.

### 2. Checkout Flow

- Step-by-step checkout UX with 3 stages: guest info, payment details, and confirmation.
- Booking summary panel with stay breakdown and total price.
- Final confirmation screen with a reservation reference.

### 3. Authentication and Role Navigation (Demo Mode)

- Login page supports demo role-based entry.
- Sign in as Guest redirects to profile.
- Sign in as Admin redirects to admin dashboard.
- Registration form with terms/privacy consent checkbox.
- In-memory auth context for role and session state.

### 4. Guest Profile Portal

- Multi-tab profile area with the following sections.
- Active stay overview (room number, Wi-Fi details, live folio).
- Booking management (upcoming and past stays).
- Personal profile and account settings.
- Saved payment methods.
- Guest preferences (room, dietary, notification settings).
- Language toggle support from profile controls.

### 5. Admin Dashboard

- Multi-section admin workspace with tabbed management areas.
- Global overview (KPIs, operations, alerts).
- Reservation management table and status views.
- Inventory and room status controls.
- User/staff management with role actions.
- Reports and exports panel.
- System settings and integration placeholders.

### 6. Internationalization

- i18next-based localization is implemented.
- Supported resources: English (`src/locales/en/common.json`) and Vietnamese (`src/locales/vi/common.json`).
- Header language switching between EN and VN is active in UI.

## Frontend Routes

Implemented routes in `src/App.tsx`:

- `/` - Home
- `/search` - Search Results
- `/amenities` - Amenities
- `/contact` - Contact
- `/checkout` - Checkout
- `/experiences` - Experiences
- `/faq` - FAQ
- `/privacy` - Privacy Policy
- `/terms` - Terms of Service
- `/dashboard` - Staff-style dashboard page
- `/login` - Login
- `/register` - Register
- `/profile` - Guest profile portal
- `/admin` - Admin dashboard

## Backend Microservices and APIs

Backend root: `backend/`

### Service Map

| Service | Port | Base Path | Purpose |
| --- | --- | --- | --- |
| user-service | 8081 | `/api/users` | User registration/login/profile |
| inventory-service | 8082 | `/api/inventory` | Room types, rooms, availability |
| booking-service | 8083 | `/api/bookings` | Create/list/update reservations |
| payment-service | 8084 | `/api/payments` | Record and fetch payments |

### Implemented Endpoints

#### User Service (`/api/users`)
- `POST /register` - register user
- `POST /login` - login validation
- `GET /{id}` - get user by UUID

#### Inventory Service (`/api/inventory`)
- `GET /rooms/availability?checkIn=&checkOut=&guests=` - list available room types by guest count
- `GET /room-types/{id}` - get room type details
- `POST /rooms` - create room
- `POST /room-types` - create room type

#### Booking Service (`/api/bookings`)
- `POST /` - create reservation
- `GET /user/{userId}` - list bookings for a user
- `PATCH /{id}/status` - update reservation status

#### Payment Service (`/api/payments`)
- `POST /` - create payment (mock transaction)
- `GET /reservation/{reservationId}` - get payment by reservation

## Current Implementation Status (Important)

### Fully implemented now

- Rich frontend UI and navigation flows
- Modular backend services with persistence models and REST endpoints
- Basic CORS and per-service configuration

### Not fully implemented yet

- Frontend does not currently call backend APIs (no fetch/axios layer yet)
- User passwords are stored as plain text in current user-service logic
- JWT token generation is marked TODO in user-service
- Booking service does not yet lock/check room inventory via service-to-service call
- Payment service uses mock completion and generated fake transaction IDs

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- i18next + react-i18next

### Backend

- Java 21
- Quarkus 3
- Hibernate ORM Panache
- PostgreSQL (via Quarkus Dev Services in dev mode)
- Maven multi-module build

## How to Run Locally

### 1) Frontend

From project root:

```bash
npm install
npm run dev
```

Frontend runs on:

- `http://localhost:5173`

### 2) Backend Services

From `backend/`, run each service in a separate terminal:

```bash
# Terminal 1
.\mvnw.cmd -pl user-service quarkus:dev

# Terminal 2
.\mvnw.cmd -pl inventory-service quarkus:dev

# Terminal 3
.\mvnw.cmd -pl booking-service quarkus:dev

# Terminal 4
.\mvnw.cmd -pl payment-service quarkus:dev
```

Each service starts with its own Quarkus dev profile and configured port.

### 3) Optional Build Commands

Frontend:

```bash
npm run build
npm run preview
```

Backend (from `backend/`):

```bash
.\mvnw.cmd clean install
```

## Project Structure

```text
src/                    # Frontend app (pages, layout, i18n, auth context)
backend/
  user-service/         # User auth/profile service
  inventory-service/    # Room and availability service
  booking-service/      # Reservation service
  payment-service/      # Payment service
```

## Conclusion

This website already delivers a complete product-style experience from discovery to checkout, plus guest and admin portals. The backend service architecture is in place with working endpoints. The next main milestone is wiring frontend API integration and finishing security/transaction workflows (password hashing, JWT, real payment gateway, and booking-inventory consistency).
