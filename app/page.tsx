import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 text-zinc-900">
      <main className="w-full max-w-xl rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">
          Interview Exercise
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          A simple Notification Center built with Next.js, TypeScript, and
          Tailwind.
        </p>

        <div className="mt-6">
          <Link
            href="/notifications"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Go to Notifications
          </Link>
        </div>
      </main>
    </div>
  );
}
