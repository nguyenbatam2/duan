export interface AdminStatistics {
  total_revenue: number;
  orders_today: number;
  orders_this_week: number;
  orders_this_month: number;
  products_sold: number;
  total_users: number;
}
export interface RevenueOrder {
  id: number;
  name: string;
  total: number;
  created_at: string;
}
export interface RevenueStatistic {
  date: string;
  revenue: number;
  orders: RevenueOrder[];
}

export interface OrderCountByStatus {
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  refunded: number;
}
export interface TopSellingProduct {
  product_id: number;
  total_sold: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
}
export interface SlowSellingProduct {
  product_id: number;
  total_sold: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
}
export interface TopCustomer {
  user_id: number;
  orders_count: number;
  total_spent: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
export interface RevenueByCategory {
  id: number;
  name: string;
  revenue: number;
}

export interface NewUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface NewUsersStatistic {
  count: number;
  users: NewUser[];
}
export interface RevenueByCategory {
    id: number;
    name: string;
    revenue: number;
  }

export interface RevenueSummaryOrder {
  id: number;
  order_number: string;
  customer: string;
  total: number;
  created_at: string;
}

export interface RevenueSummary {
  date: string;
  revenue: number;
  orders: RevenueSummaryOrder[];
}

export interface VisitsStatistics {
  date: string;
  visits: number;
  unique_visitors: number;
  page_views: number;
}