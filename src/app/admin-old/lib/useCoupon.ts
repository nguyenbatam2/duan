/* eslint-disable @typescript-eslint/no-explicit-any */
import { Coupon } from "../types/coupon";
import Cookies from "js-cookie";

export async function getAllCoupons(): Promise<Coupon[]> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại hoặc không hợp lệ");

  const res = await fetch(`http://127.0.0.1:8000/api/v1/admin/coupons`, {
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
  if (Array.isArray(data.coupons)) return data.coupons;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
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

  const res = await fetch(`http://127.0.0.1:8000/api/v1/admin/coupons`, {
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

  const res = await fetch(`http://127.0.0.1:8000/api/v1/admin/coupons/${id}/toggle-status`, {
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