export interface Event {
  id?: number;
  name: string;
  description?: string;
  start_time: string; // ISO format
  end_time: string;
  status: "draft" | "active";
  banner_image?: string;
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedEvents {
  data: Event[];
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
