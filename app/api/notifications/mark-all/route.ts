import { NextResponse } from "next/server";
import { getNotifications, markAllAsRead } from "@/lib/api/notifications";

export async function POST() {
  await markAllAsRead();

  // Return the updated list so the client can re-render immediately.
  const notifications = await getNotifications();
  const body = notifications.map((n) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
  }));

  return NextResponse.json(body);
}

