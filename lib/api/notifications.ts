export type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

type NotificationUpdates = Partial<Pick<Notification, "message" | "read">>;

// In-memory "database"
let notifications: Notification[] = [
  {
    id: "n_1001",
    message: "Your weekly report is ready to view.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 8),
  },
  {
    id: "n_1002",
    message: "Security alert: New sign-in from Chrome on Windows.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 22),
  },
  {
    id: "n_1003",
    message: "Payment received: $49.00 for March subscription.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: "n_1004",
    message: "Reminder: Team standup starts in 15 minutes.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "n_1005",
    message: "Your password was changed successfully.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
  },
  {
    id: "n_1006",
    message: "New comment on your post: “Nice write-up!”",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
  },
  {
    id: "n_1007",
    message: "Your download is complete: invoice_2026_03.pdf",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28),
  },
  {
    id: "n_1008",
    message: "System maintenance scheduled for tonight at 11:00 PM.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 34),
  },
  {
    id: "n_1009",
    message: "New follower: @alex-dev started following you.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40),
  },
  {
    id: "n_1010",
    message: "Invite accepted: Jamie joined “Q1 Planning”.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 52),
  },
  {
    id: "n_1011",
    message: "Storage warning: You're at 90% of your quota.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 70),
  },
  {
    id: "n_1012",
    message: "Update available: Version 2.3.0 is ready to install.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 80),
  },
  {
    id: "n_1013",
    message: "You were mentioned in #design: “Can you review this?”",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 95),
  },
  {
    id: "n_1014",
    message: "Backup completed successfully.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
  },
];

// Add more synthetic notifications so the list is large enough to test performance / UX.
const TARGET_TOTAL = 10000;
if (notifications.length < TARGET_TOTAL) {
  const baseCount = notifications.length;
  const now = Date.now();

  for (let i = 0; i < TARGET_TOTAL - baseCount; i += 1) {
    const idNumber = 2000 + i;
    notifications.push({
      id: `n_${idNumber}`,
      message: `Auto-generated notification #${idNumber}`,
      // Roughly alternate read/unread to keep the dataset mixed.
      read: i % 3 === 0,
      // Spread createdAt timestamps over the last ~120 days.
      createdAt: new Date(now - i * 1000 * 60 * 30),
    });
  }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function cloneNotification(n: Notification): Notification {
  return { ...n, createdAt: new Date(n.createdAt) };
}

export async function getNotifications(): Promise<Notification[]> {

  return notifications
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((n) => ({ ...n, createdAt: new Date(n.createdAt) }));
}

export async function updateNotification(
  id: string,
  updates: NotificationUpdates,
): Promise<Notification> {
  await sleep(450);

  const idx = notifications.findIndex((n) => n.id === id);
  if (idx === -1) {
    throw new Error("Notification not found");
  }

  notifications[idx] = {
    ...notifications[idx],
    ...updates,
  };

  return cloneNotification(notifications[idx]);
}

export async function markAllAsRead(): Promise<number> {
  await sleep(700);

  let updatedCount = 0;
  notifications = notifications.map((n) => {
    if (n.read) return n;
    updatedCount += 1;
    return { ...n, read: true };
  });
  return updatedCount;
}
