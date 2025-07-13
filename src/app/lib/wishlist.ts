import axios from "axios";
import Cookies from "js-cookie";
import { Product } from "../types/product";

const API_URL = "http://127.0.0.1:8000/api/v1/user";

export async function getWishlist() {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;
  const res = await axios.get(`${API_URL}/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data.data;
}
   

export async function addToWishlist(product: Product) {
    const cookieData = Cookies.get("author");
    if (!cookieData) throw new Error("Không có token");
    const parsed = JSON.parse(cookieData);
    const token = parsed.token;

  const res = await axios.post(
    `${API_URL}/wishlist`,
    { product_id: product.id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  console.log(res.data);
  return res.data;
}
