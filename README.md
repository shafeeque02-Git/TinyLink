# Auth Server (NextAuth + Prisma)

This folder contains a minimal Next.js app configured with NextAuth and Prisma (SQLite) for local development.

Quick start

1. Copy the example env file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
cd auth-server
npm install
```

3. Generate Prisma client and push schema to SQLite:

```bash
npm run prisma:generate
npm run prisma:push
```

4. Seed a demo user:

```bash
npm run seed
```

Demo user: `demo@example.com` / `password123`

5. Run the dev server:

```bash
npm run dev
```

Environment variables (see `.env.example`):
- `NEXTAUTH_URL` — URL where NextAuth runs (default `http://localhost:3000`)
- `NEXTAUTH_SECRET` — a random secret for NextAuth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — for Google provider (optional)
- `DATABASE_URL` — SQLite file path (default `file:./dev.db`)

How this works with the Vite app

- The frontend Vite app calls NextAuth endpoints (e.g. `/api/auth/csrf`, `/api/auth/callback/credentials`, and `/api/auth/signin/google`). The service client in the Vite app is configured to talk to `http://localhost:3000` by default.
- After a successful sign-in, NextAuth sets secure cookies and will redirect back to the `callbackUrl` you provide.

Security notes

- For production, use a managed database and set `NEXTAUTH_SECRET` to a strong secret. Run behind HTTPS.
- Rate-limit authentication endpoints and configure proper session cookie settings as needed.
