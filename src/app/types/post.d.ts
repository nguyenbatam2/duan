export interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PostsResponse {
  data: Post[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
} 