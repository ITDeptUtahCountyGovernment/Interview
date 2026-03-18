import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotificationsPage from "@/app/notifications/page";

const seed = [
  {
    id: "a",
    message: "Unread notification",
    read: false,
    createdAt: "2026-03-18T12:00:00.000Z",
  },
  {
    id: "b",
    message: "Read notification",
    read: true,
    createdAt: "2026-03-18T11:59:00.000Z",
  },
];

type FetchOptions = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
};

global.fetch = jest.fn().mockImplementation(async (
  url: RequestInfo | URL,
  options?: FetchOptions
) => {
  const method = options?.method ?? "GET";

  if (typeof url === "string" && url === "/api/notifications" && method === "GET") {
    return {
      ok: true,
      json: async () => seed,
    } as Response;
  }

  if (typeof url === "string" && url.startsWith("/api/notifications/") && method === "PATCH") {
    const id = url.split("/").pop() as string;
    const patch = JSON.parse(options?.body ?? "{}") as { read?: boolean };

    const found = seed.find((n) => n.id === id);
    if (!found) {
      return { ok: false, json: async () => ({}) } as Response;
    }

    if (typeof patch.read === "boolean") {
      found.read = patch.read;
    }

    return {
      ok: true,
      json: async () => found,
    } as Response;
  }

  if (typeof url === "string" && url === "/api/notifications/mark-all" && method === "POST") {
    const unreadCount = seed.filter((n) => !n.read).length;
    seed.forEach((n) => {
      n.read = true;
    });

    return {
      ok: true,
      json: async () => ({ updatedCount: unreadCount }),
    } as Response;
  }

  return {
    ok: true,
    json: async () => ({}),
  } as Response;
});

describe("/notifications page", () => {
  test("filters and toggles read state", async () => {
    render(<NotificationsPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
    );

    expect(screen.getByText("Unread notification")).toBeInTheDocument();
    expect(screen.getByText("Read notification")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Unread" }));
    expect(screen.getByText("Unread notification")).toBeInTheDocument();
    expect(screen.queryByText("Read notification")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "All" }));
    const markReadBtn = screen.getByRole("button", { name: "Mark Read" });
    fireEvent.click(markReadBtn);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Mark Unread" }),
      ).toBeInTheDocument(),
    );
  });
});
