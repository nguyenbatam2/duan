export interface Order {
  id: number;
  order_number: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  subtotal: string;
  shipping_fee: string;
  tax: string;
  discount: string;
  total: string;
  status: string;
  payment_status: string;
  payment_method: string;
}

export interface PaginatedOrders {
  orders: Order[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
