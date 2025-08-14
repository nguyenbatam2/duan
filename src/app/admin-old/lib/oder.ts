import axios from "axios";
import Cookies from "js-cookie";

const API_BASE = "http://127.0.0.1:8000/api/v1/admin/orders";

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  status: string;
  payment_status: string;
  total_price: number;
  created_at: string;
}

interface Pagination {
  current_page: number;
  last_page: number;
}

interface PaginatedOrders {
  orders: Order[];
  pagination: Pagination;
}

export const fetchOrders = async (query: string): Promise<PaginatedOrders> => {
  const token = Cookies.get("token");
  const res = await axios.get(`${API_BASE}?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data;
};

export const updateOrderStatus = async (
  id: number,
  data: { status: string; tracking_number?: string; note?: string }
) => {
  const token = Cookies.get("token");
  const res = await axios.put(`${API_BASE}/${id}/status`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
