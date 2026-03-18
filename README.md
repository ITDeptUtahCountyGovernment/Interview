# Notification Center (Interview Exercise)

Tech stack:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- In-memory state only (no database)

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Then visit `http://localhost:3000` and click **Go to Notifications** (or go to `/notifications`).

## Tests

```bash
npm test
```

## Project Structure (intentionally simple)

- `app/notifications/page.tsx`
  - Client component
  - Fetches notifications, holds state in `useState`
  - Filtering logic lives in the component (on purpose — easy to critique/improve)
- `components/NotificationItem.tsx`
  - Renders a single notification row + Mark Read/Unread button
- `lib/api/notifications.ts`
  - Fake API layer that simulates async requests with small delays
  - In-memory "store" initialized with seeded notifications

## Notes / Intentional Imperfections

- The API is a simple in-memory module (shared state inside the module), and the UI re-fetches after “Mark All” rather than doing a more careful local update.
- Time formatting uses `toLocaleString` and isn’t consistent across locales (fine for this exercise).

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
