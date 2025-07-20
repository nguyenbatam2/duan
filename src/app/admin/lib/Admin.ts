import Cookies from "js-cookie";
import axios from "axios";
import { Admin } from "../types/Admin";

export async function getAdmins(): Promise<Admin[]> {
  const token = Cookies.get("token");
  console.log("Token khi gọi getAdmins:", token);
  if (!token) throw new Error("Token không tồn tại");

  try {
    const res = await axios.get("http://127.0.0.1:8000/api/v1/admin/admins", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return res.data.admins as Admin[];
  } catch (err: any) {
    console.error("Lỗi API getAdmins:", err.response?.data || err.message);
    throw err;
  }
}
