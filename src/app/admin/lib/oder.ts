import { PaginatedOrders } from "../types/oder";
import axios from "axios";
import Cookies from "js-cookie";

export async function fetchOrders(page: number = 1): Promise<PaginatedOrders> {
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("No token found. Please login.");
  }

  const response = await axios.get<PaginatedOrders>(
    `http://127.0.0.1:8000/api/v1/admin/orders?page=${page}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export interface UpdateOrderResponse {
  message: string;
  order: Record<string, unknown>;
}

export async function updateOrder(
  id: number,
  data: { status: string; tracking_number?: string; note?: string }
): Promise<UpdateOrderResponse> {
  const token = Cookies.get("token");
  if (!token) throw new Error("No token found. Please login.");

  const response = await axios.put(
    `http://127.0.0.1:8000/api/v1/admin/orders/${id}/status`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}
