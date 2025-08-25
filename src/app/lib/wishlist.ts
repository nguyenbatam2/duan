import axios, { isAxiosError } from "axios";
import Cookies from "js-cookie";
import { Product } from "../types/product";
import { USER_API } from "./config";

const API_URL = USER_API.WISHLIST;

export async function getWishlist() {
  const cookieData = Cookies.get("author");
  if (!cookieData) return [];
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;
  try {
    const res = await axios.get<{data: Product[]}>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return res.data.data;
  } catch (error) {
    // Ignore 401 error
    if (isAxiosError(error) && error.response?.status === 401) {
      return [];
    }
    console.error(error);
    return [];
  }
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

