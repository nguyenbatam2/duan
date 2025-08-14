import  Cookies  from 'js-cookie';
import axios from "axios";
import { Category } from "../types/cartegory";
import { PUBLIC_API, ADMIN_API } from '../../lib/config';

export async function getCategories(): Promise<Category> {
    const res = await axios.get(
      `${PUBLIC_API.CATEGORIES}?per_page=15`
    );
    return res.data as Category   ; // trả về { data: {...}
}

export async function postCategory(data: { name: string; slug: string }): Promise<Category> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");

  const res = await axios.post(
    ADMIN_API.CATEGORIES,
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
    `${ADMIN_API.CATEGORIES}/${id}`,
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

  await axios.delete(`${ADMIN_API.CATEGORIES}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
}

