/* eslint-disable @typescript-eslint/no-explicit-any */
import { Coupon } from "../types/coupon";
import Cookies from "js-cookie";
import { ADMIN_API } from "../../lib/config";

export async function getAllCoupons(
  page = 1,
  query = ""
): Promise<{ data: Coupon[]; meta?: any }> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại hoặc không hợp lệ");

  // Thêm query và page vào URL nếu API hỗ trợ
  const url = new URL(ADMIN_API.COUPONS, window.location.origin);
  url.searchParams.set("page", String(page));
  if (query) url.searchParams.set("search", query);

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `Lỗi lấy danh sách coupon: ${res.status}`);
  }
  const data = await res.json();
  // Chuẩn hóa trả về
  if (Array.isArray(data.coupons))
    return { data: data.coupons, meta: data.meta };
  if (Array.isArray(data.data)) return { data: data.data, meta: data.meta };
  if (Array.isArray(data)) return { data, meta: data.meta };
  return { data: [], meta: data.meta };
}

export interface AddCouponPayload {
  code: string;
  name: string;
  description?: string;
  type: string;
  value: number;
  min_order_amount?: number;
  valid_from: string;
  valid_to: string;
  free_shipping?: boolean;
  shipping_discount?: number;
  shipping_discount_percent?: number;
}

export async function addCoupon(data: AddCouponPayload): Promise<Coupon> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại hoặc không hợp lệ");

  const res = await fetch(ADMIN_API.COUPONS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `Lỗi tạo coupon: ${res.status}`);
  }
  const result = await res.json();
  return result.data || result;
}

export async function updateCouponStatus(id: number): Promise<{ is_active: boolean }> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại hoặc không hợp lệ");

  const res = await fetch(`${ADMIN_API.COUPONS}/${id}/toggle-status`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `Lỗi cập nhật trạng thái coupon: ${res.status}`);
  }
  const result = await res.json();
  return { is_active: result.is_active };
}