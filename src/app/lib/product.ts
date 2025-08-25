import axios from "axios";
import Cookies from "js-cookie";
import { PUBLIC_API, USER_API } from "./config";

import { Product } from "@/app/types/product";
export async function getProducts() {
  try {
    const res = await axios.get(PUBLIC_API.PRODUCTS);
    return res.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductsPage(page: number = 1) {
  try {
    const res = await axios.get(
      `${PUBLIC_API.PRODUCTS}?page=${page}`
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(id: number) {
  try {
    const res = await axios.get(
      `${PUBLIC_API.PRODUCTS}/${id}`
    );
    
    if (!res.data) {
      throw new Error("Product not found");
    }
    
    return res.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function getProductReviews(productId: number) {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  const res = await axios.get(
    `${USER_API.PRODUCTS}/${productId}/reviews`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return res.data.data.data;
}

export async function createProductReviews(
  productId: number,
  reviewData: {
    rating: number;
    comment: string;
    images?: string[];
  }
) {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  const res = await axios.post(
    `${USER_API.PRODUCTS}/${productId}/reviews`,
    reviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return res.data;
}

export async function reportProductReview(
  reviewId: number,
  reviewData: { reason: string }
) {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  const res = await axios.post(
    `${USER_API.REVIEWS}/${reviewId}/report`, 
    reviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return res.data;
}


export async function createProductReview(
  productId: number,
  reviewData: {
    rating: number;
    comment: string;
    images?: File[];
  }
) {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  const formData = new FormData();
  formData.append("rating", reviewData.rating.toString());
  formData.append("comment", reviewData.comment);

  if (reviewData.images && reviewData.images.length > 0) {
    reviewData.images.forEach((file, idx) => {
      formData.append(`images[${idx}]`, file);
    });
  }
  console.log(token);

  const res = await axios.post(
    `${USER_API.PRODUCTS}/${productId}/reviews`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}



export async function searchProducts(query: string): Promise<Product[]> {
  const res = await axios.get<{
    data: Product[];
  }>(
    `${PUBLIC_API.PRODUCTS}-search?query=${encodeURIComponent(
      query
    )}`
  );
  return res.data.data as Product[];
}

