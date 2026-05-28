<a id="readme-top"></a>
<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]



<br />
<div align="center">
  <h3 align="center">Lumiere Estate Hotel Management SaaS</h3>

  <p align="center">
    Full-stack hotel booking and management platform built with a React 19 + TypeScript frontend and a Quarkus 3 + Java 21 microservice backend.
    <br />
    <a href="https://github.com/sniknerduke/HotelManagementSaaS"><strong>Explore the docs &raquo;</strong></a>
    <br />
    <br />
    <a href="https://sniknerduke.dev">View Demo</a>
    &middot;
    <a href="https://github.com/sniknerduke/HotelManagementSaaS/issues/new?labels=bug"><strong>Report Bug</strong></a>
    &middot;
    <a href="https://github.com/sniknerduke/HotelManagementSaaS/issues/new?labels=enhancement"><strong>Request Feature</strong></a>
  </p>
</div>



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



## About The Project

**Lumiere Estate Hotel Management SaaS** is a connected hotel booking and operations platform. The frontend communicates with the backend through a centralized fetch client and the Kong API gateway, so the application runs as a real integrated system rather than a mock-only prototype.

The platform supports the full guest journey, account management, staff operations, administration workflows, payments, and localization for English and Vietnamese users.

<p align="right"><a href="#readme-top">🔼</a></p>



### Highlights

* Guest booking flow with home, search, room detail, checkout, and VNPay callback screens.
* Auth and account flows with login, register, OAuth callback, forgot/reset password, guest dashboard, and profile pages.
* Separate staff and admin portals at `/staff` and `/admin`.
* English and Vietnamese localization.
* Shared UI shell with splash screen, layout chrome, chatbot, and animated sections.
* API-wired frontend with a centralized client in `src/api/client.ts` and service modules in `src/api/index.ts`.

<p align="right"><a href="#readme-top">🔼</a></p>



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

The frontend also uses Tailwind CSS v4, React Router, i18next/react-i18next, Framer Motion, Lucide React, Recharts, jsPDF, and jsPDF-AutoTable for styling, navigation, localization, motion, charts, and reporting.

<p align="right"><a href="#readme-top">🔼</a></p>



### Architecture

In development, Vite proxies `/api` to Kong at `http://localhost:8000`. Kong routes requests to four Quarkus services:

| Gateway Path | Service |
| --- | --- |
| `/api/users`, `/api/auth` | `user-service` |
| `/api/inventory`, `/api/settings`, `/api/housekeeping` | `inventory-service` |
| `/api/bookings`, `/api/promotions`, `/api/analytics` | `booking-service` |
| `/api/payments` | `payment-service` |

Shared infrastructure in the Docker stack includes PostgreSQL, Redis, RabbitMQ, and Kong.

<p align="right"><a href="#readme-top">🔼</a></p>



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
   git clone [https://github.com/sniknerduke/HotelManagementSaaS.git](https://github.com/sniknerduke/HotelManagementSaaS.git)
