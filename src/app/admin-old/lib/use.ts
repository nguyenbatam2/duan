/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";
import axios from "axios";
import { CustomerRank, User } from "../types/user";

export async function getUsers(): Promise<User[]> {
  const token = Cookies.get("token");
  console.log("Token khi gọi getUsers:", token);
  if (!token) throw new Error("Token không tồn tại");

  try {
    const res = await axios.get("http://127.0.0.1:8000/api/v1/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    console.log("Dữ liệu users:", res.data);
    return res.data.users as User[];
  } catch (err: any) {
    console.error("Lỗi API getUsers:", err.response?.data || err.message);
    throw err;
  }
}

export async function getRanks(): Promise<CustomerRank[]> {
  const token = Cookies.get("token");
  console.log("Token khi gọi getRanks:", token);
  if (!token) throw new Error("Token không tồn tại");

  try {
    const res = await axios.get("http://127.0.0.1:8000/api/v1/admin/users/customer-ranks", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    console.log("Dữ liệu ranks:", res.data);
    return res.data.ranks as CustomerRank[];
  } catch (err: any) {
    console.error("Lỗi API getRanks:", err.response?.data || err.message);
    throw err;
  }
}
