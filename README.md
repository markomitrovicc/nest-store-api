# Web Shop API

NestJS backend for the **store-frontend** web shop: product catalog, cart, orders, and authentication.

## Host

Production API:

**https://nest-store-api-1.onrender.com/**

- Swagger UI: [https://nest-store-api-1.onrender.com/api](https://nest-store-api-1.onrender.com/api)
- Auth base: `https://nest-store-api-1.onrender.com/api/auth`

Locally the API listens on `http://localhost:3000` (or `PORT` from `.env`). The frontend (Angular) is expected at `http://localhost:4200` unless `FRONTEND_URL` is set otherwise.

## What the API does

| Area | Description |
| --- | --- |
| Products | Public listing with search, filters, and pagination. Create / update / delete are admin-only. |
| Auth | Sign-up and sign-in via Better Auth (email + password, cookie session). |
| User | `GET /users/me` returns the current user and `isAdmin`. |
| Cart | One cart per authenticated user, with stock checks. |
| Orders | Checkout from the cart; line items store a snapshot of product name and price. |

Stack: **NestJS 11**, **MongoDB / Mongoose**, **Better Auth**, **Swagger**, **Helmet**, **CORS** (credentials), **rate limit** (60 requests / 60s).

## Getting started

```bash
npm install
cp .env.example .env
npm run start:dev
```

Other commands:

```bash
npm run start          # dist build (after nest build)
npm run start:prod
npm run build
npm run lint
npm run test
npm run test:e2e
```

Seed products (requires `MONGODB_URI`):

```bash
node scripts/seed-products.js
```

## Environment

Copy `.env.example` to `.env`:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string. If unset, an in-memory Mongo instance is started (local dev only). |
| `PORT` | API port (default `3000`). |
| `BETTER_AUTH_SECRET` | Required secret for sessions. |
| `BETTER_AUTH_URL` | Public URL of this API (`http://localhost:3000` locally). |
| `FRONTEND_URL` | Origin of the store-frontend app (CORS + trusted origin). |
| `ADMIN_USER_ID` | Better Auth user id treated as admin. |
| `ADMIN_EMAIL` | Email treated as admin (default `admin@gmail.com`). |

On the host, `BETTER_AUTH_URL` should be `https://nest-store-api-1.onrender.com`, and `FRONTEND_URL` should be the deployed store-frontend URL.

## Authentication

Auth routes live under `/api/auth` (Better Auth), **not** `/users/register` or `/users/login`.

Typical flow:

1. `POST /api/auth/sign-up/email` — registration
2. `POST /api/auth/sign-in/email` — login (cookie + `user`, including `isAdmin`)
3. `GET /api/auth/get-session` — current session
4. `GET /users/me` — the same user in shop format (`id`, `name`, `email`, `isAdmin`)

The client must send `credentials: 'include'` (cookies). CORS allows only `FRONTEND_URL`.

An admin (navbar edit, product CRUD) is a user whose **id** matches `ADMIN_USER_ID` or whose **email** matches `ADMIN_EMAIL`. The `isAdmin` field is included in sign-in, session, and `/users/me` responses.

## Routes

Public (no session):

- `GET /` — health / hello
- `GET /products` — query: `search`, `category`, `brand`, `minPrice`, `maxPrice`, `page`, `limit`
- `GET /products/:id`

Session required:

- `GET /users/me`
- `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:productId`, `DELETE /cart/items/:productId`, `DELETE /cart`
- `POST /orders`, `GET /orders`, `GET /orders/:id`

Admin only:

- `POST /products`
- `PATCH /products/:id`
- `DELETE /products/:id`

Swagger covers the REST routes at `/api`. Auth endpoints are exposed by Better Auth at `/api/auth`.

Example HTTP requests for products are in [`rest-client.http`](rest-client.http).

## Structure

```
src/
  auth/          Better Auth + admin check
  products/      catalog
  cart/          cart
  orders/        orders
  users/         GET /users/me
  main.ts        bootstrap, CORS, Swagger, Helmet
scripts/
  seed-products.js
```
