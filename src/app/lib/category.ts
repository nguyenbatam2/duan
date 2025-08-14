import axios from "axios";
import { Category } from "@/app/types/category";
import { PUBLIC_API } from "./config";

interface CategoryResponse {
    data?: Category[];
}

export async function getCategories(): Promise<Category[]> {
    try {
        const res = await axios.get(
          `${PUBLIC_API.CATEGORIES}?per_page=15`
        );
        // Handle both direct array response and wrapped response
        const responseData = res.data as Category[] | CategoryResponse;
        console.log('Category API response:', responseData);
        const categories = Array.isArray(responseData) ? responseData : (responseData?.data || []);
        console.log('Processed categories:', categories);
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export const getProductsByCategory = async (
  categoryId: number,
  page: number = 1
) => {
  const res = await axios.get(
    `${PUBLIC_API.PRODUCTS}-filter?category_id=${categoryId}&page=${page}`
  );
  return res.data;
};
