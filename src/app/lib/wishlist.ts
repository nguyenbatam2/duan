import axios from "axios";
import Cookies from "js-cookie";
import { Product } from "../types/product";
import { USER_API } from "./config";

const API_URL = USER_API.WISHLIST;

export async function getWishlist() {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;
  const res = await axios.get(API_URL, {
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
    API_URL,
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
