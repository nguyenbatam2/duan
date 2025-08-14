import { PaginatedEvents } from "../types/event";

export async function fetchEvents(page: number): Promise<PaginatedEvents> {
  // Thay đổi URL API cho phù hợp với backend của bạn
  const res = await fetch(`/api/events?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}
