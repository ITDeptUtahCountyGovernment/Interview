import { NextResponse } from "next/server";
import { getNotifications } from "@/lib/api/notifications";

export async function GET() {
  const notifications = await getNotifications();

  // Serialize Date objects to ISO strings so they can be sent over HTTP.
  const body = notifications.map((n) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
  }));

  return NextResponse.json(body);
}

