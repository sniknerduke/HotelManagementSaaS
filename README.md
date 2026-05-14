# Lumiere Estate Hotel Management SaaS

Full-stack hotel booking and management platform built with a React 19 + TypeScript frontend and a Quarkus 3 + Java 21 microservice backend. The frontend talks to the backend through a centralized fetch client and the Kong API gateway, so the app runs as a connected system rather than a mock-only prototype.

## Highlights

- Guest booking flow with home, search, room detail, checkout, and VNPay callback screens.
- Auth and account flows with login, register, OAuth callback, forgot/reset password, guest dashboard, and profile pages.
- Separate staff and admin portals at `/staff` and `/admin`.
- English and Vietnamese localization.
- Shared UI shell with splash screen, layout chrome, chatbot, and animated sections.

## Architecture

In development, Vite proxies `/api` to Kong at `http://localhost:8000`, and Kong routes requests to four Quarkus services:

- `/api/users` and `/api/auth` -> `user-service`
- `/api/inventory`, `/api/settings`, and `/api/housekeeping` -> `inventory-service`
- `/api/bookings`, `/api/promotions`, and `/api/analytics` -> `booking-service`
- `/api/payments` -> `payment-service`

Shared infrastructure in the Docker stack includes PostgreSQL, Redis, RabbitMQ, and Kong.

## Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Home |
| `/search` | Search results |
| `/room/:id` | Room detail |
| `/amenities` | Amenities |
| `/contact` | Contact |
| `/experiences` | Experiences |
| `/faq` | FAQ |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/login` | Login |
| `/register` | Register |
| `/oauth/callback` | Social auth callback |
| `/checkout` | Checkout flow |
| `/payment/success` | VNPay success callback |
| `/payment/failed` | VNPay failure callback |
| `/dashboard` | Guest dashboard |
| `/profile` | Guest profile |
| `/staff` | Staff portal |
| `/admin` | Admin dashboard |

`/dashboard` is the guest dashboard; staff access lives on `/staff`.

## Backend Services

Backend root: `backend/`

| Service | Port | Base paths | Notes |
| --- | --- | --- | --- |
| `user-service` | 8081 | `/api/users`, `/api/auth` | Registration, login, OAuth, profile, password reset, CRM, roles |
| `inventory-service` | 8082 | `/api/inventory`, `/api/settings`, `/api/housekeeping` | Rooms, room types, availability, amenities, housekeeping, settings |
| `booking-service` | 8083 | `/api/bookings`, `/api/promotions`, `/api/analytics` | Reservations, booking lifecycle, promotions, analytics |
| `payment-service` | 8084 | `/api/payments` | Payments, refunds, VNPay integration, payment events |

The backend is a Maven multi-module project with Quarkus DevServices configured for local PostgreSQL startup when running services individually.

## Run Locally

### Frontend

From the project root:

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

### Backend Services

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

### Docker Stack

Start the full local stack from `backend/`:

```bash
docker-compose up -d --build
```

This brings up the four services, four PostgreSQL databases, Kong, Redis, and RabbitMQ.

For the production compose file, use:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

If you use the production stack, set the required environment variables for database credentials, JWT keys, SMTP, VNPay, and frontend/API URLs.

### Optional Build Commands

Frontend:

```bash
npm run build
npm run preview
```

Backend:

```bash
.\mvnw.cmd clean install
```

## Project Structure

```text
src/                    # React frontend
backend/
  kong/                 # Declarative API gateway config
  user-service/         # User auth/profile service
  inventory-service/    # Room, amenity, housekeeping, and settings service
  booking-service/      # Reservation, promotion, and analytics service
  payment-service/      # Payment and VNPay service
  docker-compose*.yml   # Local and production stack definitions
```

## Current Notes

- The frontend API layer is implemented in `src/api/client.ts` and `src/api/index.ts`.
- Auth uses bcrypt + JWT, and social login routes hit `/api/auth/google` and `/api/auth/facebook`.
- Booking and payment flows coordinate through service-to-service REST clients and RabbitMQ events.
- Dev traffic goes through Kong on port `8000`; the UI proxy points `/api` there.
