import { AdminStatistics,RevenueStatistic,OrderCountByStatus,TopSellingProduct,SlowSellingProduct, NewUsersStatistic,RevenueByCategory, TopCustomer, RevenueSummary, VisitsStatistics } from "../types/Statistic";
import adminAxios from "./axios";


export async function fetchAdminStatistics(): Promise<AdminStatistics> {
  const res = await adminAxios.get("/admin/statistics/overview");
  return res.data as AdminStatistics;
}



export async function fetchRevenueStatisticsByDate(from?: string, to?: string): Promise<RevenueStatistic[]> {
  const params: Record<string, string> = {};
  if (from) params.from = from;
  if (to) params.to = to;
  const res = await adminAxios.get("/admin/statistics/revenue", { params });
  return res.data as RevenueStatistic[];
}


export async function fetchRevenueSummaryByType(type: 'today' | 'week' | 'month' | 'year'): Promise<RevenueSummary[]> {
  const res = await adminAxios.get("/admin/statistics/revenue-summary", { params: { type } });
  return res.data as RevenueSummary[];
}


export async function fetchOrderCountByStatus(): Promise<OrderCountByStatus> {
  const res = await adminAxios.get("/admin/statistics/orders-by-status");
  return res.data as OrderCountByStatus;
}



export async function fetchTopSellingProducts(): Promise<TopSellingProduct[]> {
  const res = await adminAxios.get("/admin/statistics/top-products");
  return res.data as TopSellingProduct[];
}


export async function fetchSlowSellingProducts(): Promise<SlowSellingProduct[]> {
  const res = await adminAxios.get("/admin/statistics/slow-products");
  return res.data as SlowSellingProduct[];
}


export async function fetchNewUsersStatistic(type: 'week' | 'month'): Promise<NewUsersStatistic> {
  const res = await adminAxios.get("/admin/statistics/new-users", { params: { type } });
  return res.data as NewUsersStatistic;
}

export async function fetchRevenueByCategory(): Promise<RevenueByCategory[]> {
  const res = await adminAxios.get("/admin/statistics/revenue-by-category");
  return res.data as RevenueByCategory[];
}

export async function fetchTopCustomers(): Promise<TopCustomer[]> {
  const res = await adminAxios.get("/admin/statistics/top-customers");
  return res.data as TopCustomer[];
}

// Thống kê lượt truy cập
export async function fetchVisitsStatistics(type: 'today' | 'week' | 'month' | 'year'): Promise<VisitsStatistics[]> {
  const res = await adminAxios.get("/admin/statistics/visits", { params: { type } });
  return res.data as VisitsStatistics[];
}