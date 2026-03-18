import {
  getNotifications,
  markAllAsRead,
  updateNotification,
} from "@/lib/api/notifications";

describe("notifications API (in-memory)", () => {
  test("fetches, updates, and marks all as read", async () => {
    jest.useFakeTimers();

    const fetch1 = getNotifications();
    jest.advanceTimersByTime(700);
    const list1 = await fetch1;

    expect(list1.length).toBeGreaterThanOrEqual(10);
    expect(list1[0].createdAt.getTime()).toBeGreaterThanOrEqual(
      list1[list1.length - 1].createdAt.getTime(),
    );

    const target = list1.find((n) => n.read === false);
    expect(target).toBeTruthy();

    const update = updateNotification(target!.id, { read: true });
    jest.advanceTimersByTime(500);
    const updated = await update;
    expect(updated.read).toBe(true);

    const markAll = markAllAsRead();
    jest.advanceTimersByTime(800);
    await markAll;

    const fetch2 = getNotifications();
    jest.advanceTimersByTime(700);
    const list2 = await fetch2;
    expect(list2.every((n) => n.read)).toBe(true);
  });
});
