// product.d.ts
export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  product_name: string; // Required để fix SQL error
  variant_id?: number; // <- optional
}


export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: number;
  product_type: string;
  price: string;
  discount_price: string;
  stock_quantity: number;
  image: string;
  average_rating: number | null;
  views_count: number;
  quantity: number;
  variant_id?: number; 
  variants?: { id: number }[]; 
  
  // Event pricing fields (theo document.md)
  base_price?: number;
  base_discount?: number;
  event_price?: number;
  original_price?: number;
  display_price?: number;
  has_active_event?: boolean;
  event_discount_percentage?: number;
  event_info?: {
    id: number;
    name: string;
    description: string;
    start_time: string;
    end_time: string;
    discount_type: string;
    discount_value: number;
    banner_image: string;
  };
}
