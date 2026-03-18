"use client";

import { useEffect, useState } from "react";
import type { Notification } from "@/lib/api/notifications";

type Filter = "all" | "read" | "unread";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/notifications");
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const raw = (await res.json()) as Array<
          Omit<Notification, "createdAt"> & { createdAt: string }
        >;

        const data: Notification[] = raw.map((n) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }));

        if (!cancelled) setNotifications(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load notifications.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  let filtered = notifications;
  if (filter === "read") filtered = notifications.filter((n) => n.read);
  if (filter === "unread") filtered = notifications.filter((n) => !n.read);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const PAGE_SIZE = 50;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paged = filtered.slice(startIndex, endIndex);

  function startUpdating(id: string) {
    setUpdatingIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function stopUpdating(id: string) {
    setUpdatingIds((prev) => prev.filter((x) => x !== id));
  }

  async function onToggleRead(id: string, nextRead: boolean) {
    startUpdating(id);
    setError(null);

    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: nextRead }),
      });

      if (!res.ok) {
        throw new Error("Failed to update notification");
      }

      const raw = (await res.json()) as Omit<Notification, "createdAt"> & {
        createdAt: string;
      };

      const updated: Notification = {
        ...raw,
        createdAt: new Date(raw.createdAt),
      };

      setNotifications((prev) =>
        prev.map((n) => (n.id === updated.id ? updated : n)),
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update notification.");
    } finally {
      stopUpdating(id);
    }
  }

  async function onMarkAllAsRead() {
    setIsMarkingAll(true);
    setError(null);

    try {
      // Re-fetch from the API to reflect the updated state.
      const resMarkAll = await fetch("/api/notifications/mark-all", {
        method: "POST",
      });

      if (!resMarkAll.ok) {
        throw new Error("Failed to mark all as read");
      }

      const res = await fetch("/api/notifications");
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      const raw = (await res.json()) as Array<
        Omit<Notification, "createdAt"> & { createdAt: string }
      >;

      const data: Notification[] = raw.map((n) => ({
        ...n,
        createdAt: new Date(n.createdAt),
      }));

      setNotifications(data);
    } catch (err) {
      console.error(err);
      setError("Failed to mark all as read.");
    } finally {
      setIsMarkingAll(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Notification Center
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              {unreadCount} unread{unreadCount === 1 ? "" : "s"}
            </p>
          </div>

          <button
            type="button"
            onClick={onMarkAllAsRead}
            disabled={isLoading || isMarkingAll || unreadCount === 0}
            className={[
              "mt-4 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors sm:mt-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
              isLoading || isMarkingAll || unreadCount === 0
                ? "cursor-not-allowed bg-zinc-200 text-zinc-600"
                : "bg-blue-600 text-white hover:bg-blue-700",
            ].join(" ")}
          >
            {isMarkingAll ? "Marking..." : "Mark All as Read"}
          </button>
        </header>

        <section className="mt-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-700">Filter:</span>
            <div className="inline-flex overflow-hidden rounded-md border border-zinc-200 bg-white">
              <button
                type="button"
                onClick={() => {
                  setFilter("all");
                  setPage(1);
                }}
                className={[
                  "px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                  filter === "all"
                    ? "bg-zinc-900 text-white"
                    : "bg-white text-zinc-700 hover:bg-zinc-50",
                ].join(" ")}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilter("unread");
                  setPage(1);
                }}
                className={[
                  "px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                  filter === "unread"
                    ? "bg-zinc-900 text-white"
                    : "bg-white text-zinc-700 hover:bg-zinc-50",
                ].join(" ")}
              >
                Unread
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilter("read");
                  setPage(1);
                }}
                className={[
                  "px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                  filter === "read"
                    ? "bg-zinc-900 text-white"
                    : "bg-white text-zinc-700 hover:bg-zinc-50",
                ].join(" ")}
              >
                Read
              </button>
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {isLoading ? (
            <p className="mt-10 text-sm text-zinc-600">Loading...</p>
          ) : filtered.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed border-zinc-300 bg-white p-6">
              <p className="text-sm text-zinc-700">No notifications to show.</p>
            </div>
          ) : (
            <>
              <ul className="mt-6 space-y-3">
                {paged.map((n) => {
                  const isUpdating = updatingIds.includes(n.id) || isMarkingAll;
                  const nextRead = !n.read;
                  const buttonLabel = n.read ? "Mark Unread" : "Mark Read";

                  return (
                    <li
                      key={n.id}
                      className={[
                        "flex items-start justify-between gap-4 rounded-lg border px-4 py-3",
                        n.read
                          ? "border-zinc-200 bg-white"
                          : "border-blue-200 bg-blue-50",
                      ].join(" ")}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={[
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                              n.read
                                ? "bg-zinc-100 text-zinc-700"
                                : "bg-blue-100 text-blue-800",
                            ].join(" ")}
                          >
                            {n.read ? "Read" : "Unread"}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {n.createdAt.toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <p
                          className={[
                            "mt-2 wrap-break-word text-sm leading-6",
                            n.read
                              ? "text-zinc-600"
                              : "font-semibold text-zinc-900",
                          ].join(" ")}
                        >
                          {n.message}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => onToggleRead(n.id, nextRead)}
                          className={[
                            "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                            isUpdating
                              ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-500"
                              : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
                          ].join(" ")}
                        >
                          {isUpdating ? "Updating..." : buttonLabel}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 flex items-center justify-between text-xs text-zinc-600">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={[
                      "rounded-md border px-3 py-1 font-medium transition-colors",
                      currentPage === 1
                        ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400"
                        : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={[
                      "rounded-md border px-3 py-1 font-medium transition-colors",
                      currentPage === totalPages
                        ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400"
                        : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
