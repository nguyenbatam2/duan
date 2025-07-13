import Cookies from "js-cookie";
import axios from "axios";
import { Product } from "../types/product";

const API_URL = "http://127.0.0.1:8000/api/v1/user/orders";

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  variant_id?: number; // <- optional
}


export interface CouponItem {
  product_id: number;
  price: number;
  quantity: number;
}

export async function getOrders(page = 1) {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  const res = await axios.get(`${API_URL}?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data;
}

export async function getOrdersById(id: number){
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");

  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  const res = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return res.data;
}

export async function cancelOrder(id: number) {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");

  const { token } = JSON.parse(cookieData);

  const res = await axios.post(
    `${API_URL}/${id}/cancel`,{},{
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}



export async function getOrdersTotal() {
  const orders: { price: number; quantity: number }[] = await getOrders();
  return orders.reduce(
    (total: number, item: { price: number; quantity: number }) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
}

export const applyCoupon = async (
  coupon_code: string,
  items: { product_id: number; price: number; quantity: number }[],
  subtotal: number,
  shipping_fee: number,
  tax: number,
  payment_method: string
) => {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");

  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  const response = await axios.post(
    `${API_URL}/apply-coupon`,
    {
      coupon_code,
      items,
      subtotal,
      shipping_fee,
      tax,
      payment_method,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};



export async function placeOrder(
  items: OrderItem[],
  name: string,
  phone: string,
  address: string,
  email: string,
  payment_method: "cod",
  coupon_code: string | null,
  note: string,
  subtotal: number,
  shipping_fee: number,
  tax: number,
  discount: number,
  total: number
) {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");

  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  const res = await axios.post(
    `${API_URL}/place-order`,
    {
      items,
      name,
      phone,
      address,
      email,
      payment_method,
      coupon_code: coupon_code ?? undefined,
      notes: note,
      subtotal,
      shipping_fee,
      tax,
      discount,
      total,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}
