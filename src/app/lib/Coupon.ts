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

