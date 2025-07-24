import axios from "axios";
import Cookies from "js-cookie";

import { Product } from "@/app/types/product";
export async function getProducts(): Promise<Product[]> {
  const res = await axios.get("http://127.0.0.1:8000/api/v1/public/products");
  return res.data.data as Product[];
}
// export async function Banner(): Promise<Product[]> {
//   const res = await axios.get('http://192.168.100.108:8000/api/banners');
//   console.log(res);
//   return res.data as Product[];
// }

export async function getProductsPage(page: number): Promise<Product> {
  const res = await axios.get(
    `http://127.0.0.1:8000/api/v1/public/products/?per_page=16&page=${page}`
  );
  return res.data as Product;
}

export async function getProductById(id: number) {
  const res = await axios.get(
    `http://127.0.0.1:8000/api/v1/public/products/${id}`
  );
  if (!res.data) {
    throw new Error("Product not found");
  }
  return res.data;
}

export async function getProductReviews(productId: number) {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  const res = await axios.get(
    `http://127.0.0.1:8000/api/v1/user/products/${productId}/reviews`,
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
    `http://127.0.0.1:8000/api/v1/user/products/${productId}/reviews`,
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
    `http://127.0.0.1:8000/api/v1/user/reviews/${reviewId}/report`, 
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
    `http://127.0.0.1:8000/api/v1/user/products/${productId}/reviews`,
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
  const res = await axios.get(
    `http://127.0.0.1:8000/api/v1/public/products-search?query=${encodeURIComponent(
      query
    )}`
  );
  return res.data.data as Product[];
}

