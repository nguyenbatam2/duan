import  Cookies  from 'js-cookie';
import axios from "axios";
import { Category } from "../types/cartegory";
export async function getCategories(): Promise<Category> {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/v1/public/categories?per_page=15 "
    );
    return res.data as Category   ; // trả về { data: {...}
}

export async function postCategory(data: { name: string; slug: string }): Promise<Category> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");

  const res = await axios.post(
    "http://127.0.0.1:8000/api/v1/admin/categories",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  console.log("res", res.data);
  return res.data;
}

export async function putCategory(id: number, data: { name: string; slug: string }): Promise<Category> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");

  const res = await axios.put(
    `http://127.0.0.1:8000/api/v1/admin/categories/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  return res.data;
}
export async function deleteCategory(id: number): Promise<void> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");

  await axios.delete(`http://127.0.0.1:8000/api/v1/admin/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
}

