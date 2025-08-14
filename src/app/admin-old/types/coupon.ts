export interface Coupon {
  id: number;
  code: string;
  name: string;
  description: string | null;
  type: string;
  value: string;
  max_discount: string | null;
  scope: string | null;
  target_ids: string | null;
  free_shipping: boolean | number;
  shipping_discount: string | null;
  shipping_discount_percent: string | null;
  min_order_value: string | null;
  max_order_value: string | null;
  usage_limit: number | null;
  used_count: number;
  only_once_per_user: boolean | number;
  first_time_only: boolean | number;
  allowed_rank_ids: string | null;
  start_at: string;
  end_at: string;
  time_rules: string | null;
  is_active: boolean | number;
  allowed_payment_methods: string | null;
  allowed_regions: string | null;
  created_at: string;
  updated_at: string;
}
