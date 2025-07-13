// product.d.ts
export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  variant_id?: number; // <- optional
}


export interface Product {
  discount_price(discount_price: string): unknown;
  discount_price: string;
  id: number;
  name: string;
  slug: string;
  description: string;
  status: number;
  product_type: string;
  price: string;
  stock_quantity: number;
  image: string;
  average_rating: number | null;
  views_count: number;
  quantity: number;
  variant_id?: number; 
  variants?: { id: number }[]; 
}
