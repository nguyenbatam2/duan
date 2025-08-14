/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Product {
  [x: string]: any;
  discount: string;
  categoryId: number;
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
  variant_id?: number; // 👈 Cho phép optional
  variants?: { id: number }[]; // 👈 Thêm nếu có biến thể
}

export interface PaginatedProducts {
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    total?: number;
    per_page?: number;
  };
  links: {
    prev?: string | null;
    next?: string | null;
  };
}