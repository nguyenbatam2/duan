/* eslint-disable @typescript-eslint/no-explicit-any */
import adminAxios from "./axios";
import { CustomerRank, User } from "../types/user";

export async function getUsers(params?: { customer_rank_id?: string | number }): Promise<User[]> {
  let url = "/admin/users";
  if (params?.customer_rank_id) {
    url += `?customer_rank_id=${params.customer_rank_id}`;
  }

  try {
    const res = await adminAxios.get(url);
    return (res.data as any).users as User[];
  } catch (err: any) {
    console.error("Lỗi API getUsers:", err.response?.data || err.message);
    throw err;
  }
}

export async function getRanks(): Promise<CustomerRank[]> {
  try {
    const res = await adminAxios.get("/admin/users/customer-ranks");
    console.log("Dữ liệu ranks:", res.data);
    return (res.data as any).ranks as CustomerRank[];
  } catch (err: any) {
    console.error("Lỗi API getRanks:", err.response?.data || err.message);
    throw err;
  }
}

export async function toggleUserStatus(id: number): Promise<any> {
  try {
    const res = await adminAxios.post(`/admin/users/${id}/toggle-status`, {});
    return res.data;
  } catch (err: any) {
    if (err.response) {
      console.error("Lỗi API toggleUserStatus:", err.response.data, "Status:", err.response.status);
      throw new Error(err.response.data?.message || `Lỗi API: ${err.response.status}`);
    }
    console.error("Lỗi API toggleUserStatus (no response):", err);
    throw err;
  }
}
