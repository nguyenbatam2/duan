import axios from "axios";
import { Category } from "@/app/types/category";
export async function getCategories(): Promise<Category[]> {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/v1/public/categories?per_page=15 "
    );
    return res.data as Category[];
}

export const getProductsByCategory = async (
  categoryId: number,
  page: number = 1
) => {
  const res = await axios.get(
    `http://127.0.0.1:8000/api/v1/public/products-filter?category_id=${categoryId}&page=${page}`
  );
  return res.data;
};
