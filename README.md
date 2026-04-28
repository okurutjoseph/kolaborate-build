# Kolaborate Build Challenge (MVP)

Next.js + **Clerk** (auth) + **Convex** (backend) + **OpenAI** (brief analysis).

## Prereqs
- Node.js 20+
- A Clerk app
- An OpenAI API key

## Setup

1) Install deps

```bash
cd kolaborate-build
npm install
```

2) Convex (local)

```bash
npx convex dev
```

This writes `NEXT_PUBLIC_CONVEX_URL` to `.env.local`.

3) Clerk
- In Clerk Dashboard, enable the **Convex integration** and copy your **Frontend API domain** (dev looks like `https://verb-noun-00.clerk.accounts.dev`).
- Set these env vars:
  - In `kolaborate-build/.env.local`:
    - `CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
  - In Convex env vars:
    - `CLERK_JWT_ISSUER_DOMAIN` (the Frontend API domain)

You can set the Convex env var via:

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN "https://<your-domain>.clerk.accounts.dev"
```

4) OpenAI (used by a Convex action)
- Set in Convex env vars:
  - `OPENAI_API_KEY`
  - optionally `OPENAI_MODEL` (defaults to `gpt-4o-mini`)

```bash
npx convex env set OPENAI_API_KEY "<your-key>"
```

5) Run the app

```bash
npm run dev
```

Visit:
- `/` marketing
- `/sign-up` and `/sign-in`
- `/onboarding/role`
- `/client/projects/new` (AI analysis + create project)
- `/freelancer/profile` then `/freelancer/matches`

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
