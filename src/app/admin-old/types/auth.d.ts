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

export interface Author {
  id: number;
  name: string;
  email: string;
  phone: string;
  token?: string; // Optional, used for authentication
}