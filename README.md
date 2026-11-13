# Home Service Marketplace

A full-stack web application that connects customers with home-service
professionals through a centralized marketplace. Customers can discover
services, submit service requests, manage bookings and payments, while
service providers can manage their profiles, assignments, availability
and work progress. Administrators manage and monitor the platform.

## Live Demo

  Application   URL
  ------------- ------------------------------------------------------
  Frontend      https://home-service-marketplace-frontend.vercel.app
  Backend       https://home-service-marketplace-backend.vercel.app

Backend health check:

``` text
https://home-service-marketplace-backend.vercel.app/
```

The root endpoint currently returns a backend welcome response.

## Demo Admin Account

The following account was supplied for project demonstration:

  Field      Value
  ---------- -----------------------------------------------------------
  Email      `admin@test.com`
  Password   `Admin@123`
  Role       Admin (if this account is configured with the ADMIN role)


## Overview

Home Service Marketplace simplifies the process of finding and managing
home services. Instead of searching for professionals through
disconnected channels, users can explore available services and submit
requests through one platform.

The application has three main user roles:

-   **Customer:** Discovers services, creates and manages service
    requests, reviews estimates, tracks bookings, makes payments and
    submits reviews.
-   **Provider:** Maintains a provider profile, manages offered services
    and availability, responds to assignments, handles bookings and
    records work progress.
-   **Admin / Super Admin:** Oversees users, providers, service
    categories, services, requests, assignments, bookings, estimates,
    payments and work logs.

## Main Features

### Public Features

-   Responsive landing page and public navigation.
-   Browse service categories and available services.
-   View service information.
-   About Us and Contact pages.
-   Registration and login.
-   Email/password authentication.
-   Google authentication integration.
-   Password recovery and account verification flows.

### Customer Dashboard

-   Customer dashboard and profile management.
-   Create and manage service requests.
-   View request details and request status.
-   Cancel eligible requests.
-   View estimates.
-   View and manage bookings.
-   View payment history and payment status.
-   Submit provider reviews.

### Provider Dashboard

-   Provider profile management.
-   Manage services offered.
-   Manage availability.
-   View assigned service requests.
-   Accept or reject assignments where permitted.
-   Update assignment and booking progress.
-   Manage estimates.
-   Create and view work logs.
-   View earnings and payment information.
-   View customer reviews and provider rating information.

### Admin Dashboard

-   Dashboard overview and analytics.
-   Manage users and providers.
-   Verify or unverify providers.
-   Manage service categories and services.
-   View and manage service requests.
-   Assign providers to service requests.
-   Monitor bookings and estimates.
-   Monitor payments.
-   View availability and work logs.

### Booking and Service Workflow

A typical workflow is:

1.  A customer browses the available services.
2.  The customer submits a service request with relevant details and
    location.
3.  The administrator reviews the request and assigns an eligible
    provider.
4.  The provider responds to the assignment.
5.  The booking and service progress are managed through the platform.
6.  The provider records work progress where applicable.
7.  The customer completes the payment and can submit a review.

The exact status transitions depend on the backend business rules.

### Payment

The backend project includes payment records and payment status
management. The data model supports payment provider/method information,
amounts, transaction references and gateway response data. A bKash
tokenized checkout integration has also been part of the backend
implementation.

Payment gateway credentials must be configured privately in the backend
environment. Never publish them in this README or in source control.

## Technology Stack

### Frontend

-   Next.js 16
-   React
-   TypeScript
-   Tailwind CSS
-   TanStack Query
-   TanStack Form
-   shadcn/ui and Base UI components
-   Recharts
-   Lucide React
-   ofetch for API requests

### Backend

-   Node.js
-   TypeScript
-   Express.js
-   PostgreSQL
-   Prisma ORM
-   Zod validation
-   JWT-based authentication
-   bcryptjs for password hashing
-   Redis for caching/token-related operations
-   Nodemailer and EJS for email-related functionality
-   Multer for file uploads
-   Google authentication integration

### Deployment

-   Frontend: Vercel
-   Backend: Vercel
-   Database: PostgreSQL
-   Source control: Git and GitHub

> This stack summary reflects the project implementation and development
> details. Check the package manifests and deployment environment for
> exact installed package versions and infrastructure configuration.

## Project Structure

The repository is organized as two separate applications:

``` text
Home-Service-Marketplace/
├── home-service-marketplace-frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   ├── next.config.ts
│   └── package.json
│
└── Home-Service-Marketplace-Backend/
    ├── prisma/
    ├── src/
    │   ├── config/
    │   ├── generated/
    │   ├── lib/
    │   ├── middlewares/
    │   ├── modules/
    │   └── server.ts
    └── package.json
```

The exact folders may differ slightly from the current local repository.

## Getting Started

### Prerequisites

Install the following before running the project locally:

-   Node.js (use a version compatible with the package manifests)
-   npm
-   PostgreSQL
-   Redis (if the local configuration requires it)
-   Git

### 1. Clone the Repository

If the frontend and backend are maintained in separate repositories,
clone each repository separately.

``` bash
git clone <FRONTEND_REPOSITORY_URL>
git clone <BACKEND_REPOSITORY_URL>
```

If both applications are in one repository, clone that repository and
open its root folder.

### 2. Configure the Backend

Open the backend project directory:

``` bash
cd Home-Service-Marketplace-Backend
npm install
```

Create a `.env` file in the backend root directory. Use the actual
variable names expected by the backend configuration.

Example configuration template:

``` env
NODE_ENV=development
PORT=5000

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"

JWT_ACCESS_SECRET="replace-with-a-long-random-secret"
JWT_REFRESH_SECRET="replace-with-a-long-random-secret"

REDIS_URL="redis://localhost:6379"

FRONTEND_URL="http://localhost:3000"

# Configure email, Google OAuth, file storage and payment
# gateway credentials using the exact names expected by
# the backend config files. Do not commit real values.
```

The names above are a template. Your backend may require additional
variables or use different names. Check the backend configuration files
before running it.

Generate the Prisma Client and apply the database migrations using the
commands supported by the repository's Prisma setup. For a standard
Prisma project, these commonly include:

``` bash
npx prisma generate
npx prisma migrate deploy
```

For local development with a new migration, use the project's
established migration workflow rather than applying production
migrations blindly.

Start the backend:

``` bash
npm run dev
```

The local backend has been configured to use port `5000` in the project
setup.

### 3. Configure the Frontend

Open the frontend project directory:

``` bash
cd home-service-marketplace-frontend
npm install
```

Create a `.env` file in the frontend root:

``` env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

For production, the frontend environment variable should point to the
deployed backend API base URL:

``` env
NEXT_PUBLIC_API_BASE_URL=https://home-service-marketplace-backend.vercel.app/api/v1
```

Start the frontend:

``` bash
npm run dev
```

Open:

``` text
http://localhost:3000
```

### 4. Build the Frontend

Before deployment, verify the production build:

``` bash
npm run build
```

A successful build confirms that the Next.js application compiles and
passes its build-time TypeScript checks. It does not itself deploy the
application.

## API Overview

The backend API is versioned under:

``` text
/api/v1
```

The following module groups are part of the project implementation.
Exact methods, permissions and request payloads should be checked in the
backend route files.

  -----------------------------------------------------------------------
  Module                              Purpose
  ----------------------------------- -----------------------------------
  Auth                                Registration, login, logout,
                                      current user, verification and
                                      password flows

  Users                               User profile and user
                                      administration

  Providers                           Provider profile, provider listing
                                      and verification

  Categories                          Service category management

  Services                            Service catalog management

  Service Requests                    Customer requests and request
                                      management

  Assignments                         Provider assignment and assignment
                                      status

  Availability                        Provider availability management

  Estimates                           Service estimate management

  Bookings                            Booking lifecycle management

  Payments                            Payment records and payment status

  Reviews                             Customer reviews and provider
                                      ratings

  Work Logs                           Provider work progress records
  -----------------------------------------------------------------------

### Example Routes

The following service-request and assignment routes were implemented
during development:

``` text
/api/v1/service-requests
/api/v1/service-requests/my-requests
/api/v1/service-requests/:id
/api/v1/service-requests/:id/cancel

/api/v1/assignments
/api/v1/assignments/my-assignments
/api/v1/assignments/:id/status
/api/v1/assignments/request/:serviceRequestId

/api/v1/providers
/api/v1/providers/profile
```

These are route examples, not a complete API specification. Refer to the
backend source code for the complete route list and authorization
requirements.

## Authentication and Authorization

-   Authentication uses HTTP-only cookies for access and refresh tokens.
-   Production cookies are configured for secure cross-site usage
    (`Secure` and `SameSite=None`) where required by the deployed
    frontend/backend domains.
-   Passwords are hashed before storage.
-   Role-based access distinguishes `CUSTOMER`, `PROVIDER`, `ADMIN` and
    `SUPER_ADMIN`.
-   Protected backend endpoints must enforce authentication and role
    authorization independently of frontend route guards.

For local development, ensure the frontend and backend URLs, CORS origin
and cookie settings are configured consistently.

## Deployment

### Frontend on Vercel

1.  Push the frontend code to its connected GitHub repository.

2.  Import or select the repository in Vercel.

3.  Set the frontend environment variable:

    ``` env
    NEXT_PUBLIC_API_BASE_URL=https://home-service-marketplace-backend.vercel.app/api/v1
    ```

4.  Confirm the correct root directory and build settings.

5.  Deploy the project.

### Backend on Vercel

1.  Connect the backend GitHub repository to Vercel.
2.  Configure the backend environment variables in Vercel.
3.  Set the production frontend origin in the backend CORS
    configuration.
4.  Configure PostgreSQL, Redis and any required external service
    credentials.
5.  Deploy and verify the backend root endpoint and API routes.

When GitHub is connected to Vercel, pushing to the configured deployment
branch normally triggers a new deployment automatically.

## Environment and Security Notes

-   Do not commit `.env` files.
-   Keep database URLs, JWT secrets, email credentials, Google OAuth
    secrets and payment gateway credentials private.
-   Use separate credentials for development and production.
-   Do not use a shared demo administrator account for real operations.
-   Change or disable the demo administrator password before making the
    repository public.
-   Configure CORS to allow only trusted frontend origins.
-   Validate and authorize every protected backend operation.
-   Validate uploaded files and restrict their size and allowed types.

## Current Limitations and Verification

This README describes the features and architecture reflected in the
project development information and the deployed application. It is not
a claim that every integration or workflow has been independently tested
end-to-end.

Before presenting the project, verify:

-   Customer, Provider and Admin login and dashboard access.
-   Registration, email verification and password recovery.
-   Provider verification and service assignment.
-   Request, estimate and booking status transitions.
-   Payment success, failure and cancellation flows.
-   File upload and image rendering.
-   Review submission and provider rating updates.
-   Production CORS and cookie behavior.

## Future Improvements

Potential improvements include:

-   Automated end-to-end testing for all role-based workflows.
-   More detailed API documentation with Swagger/OpenAPI.
-   Stronger monitoring and structured backend logging.
-   Notification improvements for request, assignment and booking
    updates.
-   Additional analytics and reporting.
-   Rate limiting and enhanced abuse protection.

## Contributing

1.  Fork or clone the repository.
2.  Create a feature branch.
3.  Make focused changes.
4.  Run the relevant checks and production build.
5.  Submit a pull request with a clear description.

## License

Add the license that applies to this project before distributing or
reusing the source code.

------------------------------------------------------------------------

**Home Service Marketplace** --- Making home services simpler, more
accessible and easier to manage.
