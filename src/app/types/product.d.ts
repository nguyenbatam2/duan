export interface Product {
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
}