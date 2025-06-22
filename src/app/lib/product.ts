import axios from "axios";
import { Product } from "@/app/types/product";
export async function getProducts(): Promise<Product[]> {
    const res = await axios.get("http://localhost:8000/api/v1/products");
    return res.data as Product[];
}

// lib/product.ts
export async function getProductsPage(page: number): Promise<Product> {
  const res = await axios.get(
    `http://127.0.0.1:8000/api/v1/products/?per_page=16&page=${page}`
  );
  return res.data as Product; // trả về { data: {...} }
}

export async function getProductById(id: number) {
  const res = await axios.get(`http://127.0.0.1:8000/api/v1/products/${id}`);
  console.log(res.data);
  if (!res.data) { 
    throw new Error("Product not found");
  }
  return res.data; // trả về { data: {...} }
}
