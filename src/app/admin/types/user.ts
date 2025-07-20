export interface CustomerRank {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  total: number;
  created_at: string;
}

export interface User {
  [x: string]: string;
  id: number;
  name: string;
  email: string;
  phone: string;
  email_verified_at: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  customer_rank_id: number | null;
  customer_rank: CustomerRank | null;
  orders: Order[];
}
