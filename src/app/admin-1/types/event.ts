export interface AdminEvent {
  id: number;
  name: string;
  status: string;
  is_featured?: boolean;
  // Thêm các trường khác nếu API trả về
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedEvents {
  data: Event[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface Event {
  id: number;
  name: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: string;
  banner_image?: string;
  discount_type?: string;
  discount_value?: number;
  is_featured?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  eventProducts?: EventProduct[];
}

export interface EventProduct {
  id: number;
  event_id: number;
  product_id: number;
  event_price: number;
  original_price: number;
  discount_price: number;
  quantity_limit: number;
  status: string;
  sort_order: number;
  product?: Product;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  image?: string;
  description?: string;
}