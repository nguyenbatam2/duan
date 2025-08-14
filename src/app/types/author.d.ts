export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserAddress {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address: string;
  is_default: number;
  created_at: string;
  updated_at: string;
}
export interface Author {
  id: number;
  name: string;
  email: string;
  phone: string;
  token?: string; 
  avatar: string;
  customer_rank_id: string;
  address: string;
}
