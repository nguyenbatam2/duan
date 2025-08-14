import adminAxios from "./axios";

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
  per_page: number;
  total: number;
}

interface PaginatedOrders {
  orders: Order[];
  pagination: Pagination;
}

export const fetchOrders = async (query: string): Promise<PaginatedOrders> => {
  const res = await adminAxios.get(`${API_BASE}?${query}`);
  return res.data as PaginatedOrders;
};

export const updateOrderStatus = async (
  id: number,
  data: { status: string; tracking_number?: string; note?: string }
) => {
  const res = await adminAxios.put(`${API_BASE}/${id}/status`, data);
  return res.data;
};