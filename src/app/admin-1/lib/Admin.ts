import Cookies from "js-cookie";
import adminAxios from "./axios";
import { Admin } from "../types/Admin";

export async function getAdmins(): Promise<Admin[]> {
  try {
    const res = await adminAxios.get("/admin/admins");
    return res.data.admins as Admin[];
  } catch (err: any) {
    console.error("Lỗi API getAdmins:", err.response?.data || err.message);
    throw err;
  }
}
