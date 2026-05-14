<a id="readme-top"></a>



<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/lumiere-estate-hotel-management-saas">
    <img src="images/logo.png" alt="Lumiere Estate Logo" width="80" height="80">
  </a>

<h3 align="center">Lumiere Estate Hotel Management SaaS</h3>

  <p align="center">
    Full-stack hotel booking and management platform built with a React 19 + TypeScript frontend and a Quarkus 3 + Java 21 microservice backend.
    <br />
    <a href="https://github.com/github_username/lumiere-estate-hotel-management-saas"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/lumiere-estate-hotel-management-saas">View Demo</a>
    &middot;
    <a href="https://github.com/github_username/lumiere-estate-hotel-management-saas/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/github_username/lumiere-estate-hotel-management-saas/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#highlights">Highlights</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#architecture">Architecture</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#frontend-routes">Frontend Routes</a></li>
    <li><a href="#backend-services">Backend Services</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#current-notes">Current Notes</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

**Lumiere Estate Hotel Management SaaS** is a connected hotel booking and operations platform. The frontend communicates with the backend through a centralized fetch client and the Kong API gateway, so the application runs as a real integrated system rather than a mock-only prototype.

The platform supports the full guest journey, account management, staff operations, administration workflows, payments, and localization for English and Vietnamese users.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Highlights

* Guest booking flow with home, search, room detail, checkout, and VNPay callback screens.
* Auth and account flows with login, register, OAuth callback, forgot/reset password, guest dashboard, and profile pages.
* Separate staff and admin portals at `/staff` and `/admin`.
* English and Vietnamese localization.
* Shared UI shell with splash screen, layout chrome, chatbot, and animated sections.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React][React.js]][React-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Vite][Vite]][Vite-url]
* [![Quarkus][Quarkus]][Quarkus-url]
* [![Java][Java]][Java-url]
* [![PostgreSQL][PostgreSQL]][PostgreSQL-url]
* [![Redis][Redis]][Redis-url]
* [![RabbitMQ][RabbitMQ]][RabbitMQ-url]
* [![Kong][Kong]][Kong-url]
* [![Docker][Docker]][Docker-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Architecture

In development, Vite proxies `/api` to Kong at `http://localhost:8000`. Kong routes requests to four Quarkus services:

| Gateway Path | Service |
| --- | --- |
| `/api/users`, `/api/auth` | `user-service` |
| `/api/inventory`, `/api/settings`, `/api/housekeeping` | `inventory-service` |
| `/api/bookings`, `/api/promotions`, `/api/analytics` | `booking-service` |
| `/api/payments` | `payment-service` |

Shared infrastructure in the Docker stack includes PostgreSQL, Redis, RabbitMQ, and Kong.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Follow the steps below to run the frontend, backend services, or full Docker stack locally.

### Prerequisites

Make sure the following tools are installed:

* Node.js and npm
* Java 21
* Maven or the included Maven wrapper
* Docker and Docker Compose

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/github_username/lumiere-estate-hotel-management-saas.git
   ```
2. Navigate into the project
   ```sh
   cd lumiere-estate-hotel-management-saas
   ```
3. Install frontend dependencies
   ```sh
   npm install
   ```
4. Start the frontend
   ```sh
   npm run dev
   ```
5. Open the app at `http://localhost:5173`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### Frontend

From the project root:

```sh
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

### Backend Services

From `backend/`, run each service in a separate terminal:

```sh
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

```sh
docker-compose up -d --build
```

This starts the four backend services, four PostgreSQL databases, Kong, Redis, and RabbitMQ.

For the production compose file, use:

```sh
docker-compose -f docker-compose.prod.yml up -d --build
```

If you use the production stack, set the required environment variables for database credentials, JWT keys, SMTP, VNPay, and frontend/API URLs.

### Optional Build Commands

Frontend:

```sh
npm run build
npm run preview
```

Backend:

```sh
.\mvnw.cmd clean install
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



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

> `/dashboard` is the guest dashboard; staff access lives on `/staff`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Backend Services

Backend root: `backend/`

| Service | Port | Base paths | Notes |
| --- | --- | --- | --- |
| `user-service` | 8081 | `/api/users`, `/api/auth` | Registration, login, OAuth, profile, password reset, CRM, roles |
| `inventory-service` | 8082 | `/api/inventory`, `/api/settings`, `/api/housekeeping` | Rooms, room types, availability, amenities, housekeeping, settings |
| `booking-service` | 8083 | `/api/bookings`, `/api/promotions`, `/api/analytics` | Reservations, booking lifecycle, promotions, analytics |
| `payment-service` | 8084 | `/api/payments` | Payments, refunds, VNPay integration, payment events |

The backend is a Maven multi-module project with Quarkus DevServices configured for local PostgreSQL startup when running services individually.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



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

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Current Notes

* The frontend API layer is implemented in `src/api/client.ts` and `src/api/index.ts`.
* Auth uses bcrypt + JWT, and social login routes hit `/api/auth/google` and `/api/auth/facebook`.
* Booking and payment flows coordinate through service-to-service REST clients and RabbitMQ events.
* Dev traffic goes through Kong on port `8000`; the UI proxy points `/api` there.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Guest booking flow
- [x] Authentication and account management
- [x] Staff and admin portals
- [x] VNPay payment callback flow
- [x] Kong API gateway routing
- [x] Dockerized local infrastructure
- [ ] Add production deployment documentation
- [ ] Add screenshots and demo link
- [ ] Add API documentation links

See the [open issues](https://github.com/github_username/lumiere-estate-hotel-management-saas/issues) for a full list of proposed features and known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also open an issue with the tag `enhancement`.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/github_username/lumiere-estate-hotel-management-saas/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=github_username/lumiere-estate-hotel-management-saas" alt="contrib.rocks image" />
</a>



<!-- LICENSE -->
## License

Distributed under the project license. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/github_username/lumiere-estate-hotel-management-saas](https://github.com/github_username/lumiere-estate-hotel-management-saas)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* React, TypeScript, Vite, Quarkus, and Java communities
* Kong, PostgreSQL, Redis, RabbitMQ, and Docker documentation
* VNPay integration resources

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/lumiere-estate-hotel-management-saas.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/lumiere-estate-hotel-management-saas/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/lumiere-estate-hotel-management-saas.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/lumiere-estate-hotel-management-saas/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/lumiere-estate-hotel-management-saas.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/lumiere-estate-hotel-management-saas/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/lumiere-estate-hotel-management-saas.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/lumiere-estate-hotel-management-saas/issues
[license-shield]: https://img.shields.io/github/license/github_username/lumiere-estate-hotel-management-saas.svg?style=for-the-badge
[license-url]: https://github.com/github_username/lumiere-estate-hotel-management-saas/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png

[React.js]: https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vite.dev/
[Quarkus]: https://img.shields.io/badge/Quarkus_3-4695EB?style=for-the-badge&logo=quarkus&logoColor=white
[Quarkus-url]: https://quarkus.io/
[Java]: https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white
[Java-url]: https://openjdk.org/projects/jdk/21/
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Redis]: https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white
[Redis-url]: https://redis.io/
[RabbitMQ]: https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white
[RabbitMQ-url]: https://www.rabbitmq.com/
[Kong]: https://img.shields.io/badge/Kong-003459?style=for-the-badge&logo=kong&logoColor=white
[Kong-url]: https://konghq.com/
[Docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
