import { NextResponse } from "next/server";
import {
  updateNotification,
  type Notification,
} from "@/lib/api/notifications";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const body = (await req.json()) as Partial<
    Pick<Notification, "message" | "read">
  >;

  const updated = await updateNotification(id, body);

  return NextResponse.json({
    ...updated,
    createdAt: updated.createdAt.toISOString(),
  });
}

