// lib/couponApi.ts
import axios from "axios";
import Cookies from "js-cookie";
import { Coupon } from "../types/coupon";
import { API_BASE_URL, USER_API } from "./config";

export async function getCoupons(): Promise<Coupon[]> {
  const res = await axios.get(`${API_BASE_URL}/public/coupons/valid`);
  return res.data.coupons as Coupon[];
}

export async function saveCoupon(coupon_id: number) {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const { token } = JSON.parse(cookieData);
  const res = await axios.post(
    `${USER_API.COUPONS}/${coupon_id}/save`,
    {},
    {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    }
  );
  return res.data; // { message: "...", ... }
}

// Helper map code -> id
export function buildCodeToIdMap(coupons: Coupon[]) {
  const map: Record<string, number> = {};
  for (const c of coupons) map[c.code.toUpperCase()] = c.id;
  return map;
}

// Helper hiển thị nội dung giảm
export function formatCoupon(c: Coupon) {
  const badges = [];
  if (c.free_shipping) badges.push("Miễn phí vận chuyển");
  if (c.type === "percent" && c.total_discount)
    badges.push(`Giảm ${c.total_discount}%`);
  if (c.type !== "percent" && c.total_discount)
    badges.push(`Giảm ${c.total_discount.toLocaleString()}đ`);
  if (c.product_discount)
    badges.push(`SP: ${c.product_discount}${c.type === "percent" ? "%" : "đ"}`);
  if (c.shipping_discount)
    badges.push(
      `Ship: ${c.shipping_discount}${c.type === "percent" ? "%" : "đ"}`
    );
  return badges.join(" · ") || "Ưu đãi";
}
