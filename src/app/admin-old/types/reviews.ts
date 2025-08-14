import { User } from "../types/user";
import { Product } from "../types/product";

export interface Review {
  [x: string]: any;
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  flagged: number;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  product: Product;
}

export interface ReviewResponse {
  data: {
    current_page: number;
    data: Review[];
  };
}
