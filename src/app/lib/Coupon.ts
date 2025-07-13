import axios from "axios";
import Cookies from "js-cookie";

export async function getCoupons() {
  const res = await axios.get(
    `http://127.0.0.1:8000/api/v1/public/coupons/valid`
  );
  return res.data.coupons;
}

export async function saveCoupon(coupon_id: number) {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  const res = await axios.post(
    `http://127.0.0.1:8000/api/v1/user/coupons/${coupon_id}/save`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return res.data;
}
