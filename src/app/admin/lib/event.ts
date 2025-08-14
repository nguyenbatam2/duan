import adminAxios from "./axios";
import { PaginatedEvents } from "../types/event";

export async function fetchAdminEvents(page: number = 1): Promise<PaginatedEvents> {
  const res = await adminAxios.get("/admin/events", {
    params: { page }
  });
  return res.data as PaginatedEvents;
}

export function toMySQLDatetime(iso: string) {
  return new Date(iso).toISOString().slice(0, 19).replace('T', ' ');
}

export async function createAdminEvent(event: {
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  status: string;
  banner_image?: string;
  discount_type?: string;
  discount_value?: number;
  is_featured?: boolean;
  sort_order?: number;
}) {
  const res = await adminAxios.post("/admin/events", event);
  return res.data;
}

export async function changeEventStatus(eventId: number, status: string) {
  const res = await adminAxios.post(
    `/admin/events/${eventId}/change-status`,
    { status }
  );
  return res.data;
}

export const addProductToEvent = async (
  eventId: number,
  data: {
    product_id: number;
    event_price: number;
    original_price: number;
    discount_price: number;
    quantity_limit: number;
    status: string;
    sort_order: number;
  },
  token: string
) => {
  if (!token) throw new Error("Token không tồn tại hoặc không hợp lệ");
  if (!eventId || !data.product_id) throw new Error("Thiếu eventId hoặc product_id");

  const response = await adminAxios.post(
    `/admin/events/${eventId}/products`,
    data
  );

  return response.data;
};

