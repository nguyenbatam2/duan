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
  status: string;
  is_featured?: boolean;
  // Thêm các trường khác nếu API trả về
}