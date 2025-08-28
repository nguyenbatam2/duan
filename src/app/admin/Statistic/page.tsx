"use client";

import React, { useEffect, useState } from "react";
import {
  fetchAdminStatistics,
  fetchRevenueByCategory,
  fetchTopCustomers,
  fetchTopSellingProducts,
  fetchSlowSellingProducts,
  fetchNewUsersStatistic,
  fetchRevenueSummaryByType,
} from "../lib/Statistic";
import { fetchOrders } from "../lib/oder";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

/**
 * Clean, simpler dashboard layout (no Tailwind).
 * Keep API calls same as before. Show KPIs, revenue chart, recent orders, top customers, revenue-by-category, new users.
 */

const StatisticDashboard: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [revenueSummary, setRevenueSummary] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [newUsers, setNewUsers] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        overviewData,
        revCat,
        cus,
        topProd,
        slowProd, // optional - not used visually here but kept if needed
        newUserStat,
        revSum,
      ] = await Promise.all([
        fetchAdminStatistics(),
        fetchRevenueByCategory(),
        fetchTopCustomers(),
        fetchTopSellingProducts(),
        fetchSlowSellingProducts(),
        fetchNewUsersStatistic("week"),
        fetchRevenueSummaryByType("month"),
      ]);

      setOverview(overviewData);
      setCategories(revCat || []);
      setTopCustomers(cus || []);
      setTopProducts(topProd || []);
      setNewUsers(newUserStat.users || []);
      setRevenueSummary(revSum || []);

      // fetch first page recent orders only (lightweight)
      try {
        const ordersPage = await fetchOrders("page=1&per_page=8");
        setRecentOrders(ordersPage.orders || []);
      } catch (e) {
        // non-fatal
        setRecentOrders([]);
        console.warn("Không load được recent orders", e);
      }
    } catch (err: any) {
      console.error(err);
      setError("Lỗi khi tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // prepare chart data
  const revChartData = revenueSummary.map((r) => ({
    date: r.date,
    revenue: r.revenue,
    ordersCount: r.orders?.length ?? 0,
  }));

  const newUsersByDate = newUsers.reduce((acc: Record<string, number>, u: any) => {
    const date = (u.created_at || "").split("T")[0] || "unknown";
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const newUsersChartData = Object.entries(newUsersByDate).map(([date, count]) => ({ date, count }));

  // simple format helpers
  const fmt = (n: number | undefined | null) => {
    if (n == null) return "-";
    try {
      return n.toLocaleString("vi-VN") + "₫";
    } catch {
      return String(n);
    }
  };
  const fmtNumber = (n: number | undefined | null) => (n == null ? "-" : n.toLocaleString("vi-VN"));

  return (
    <div className="sd-root">
      <header className="sd-header">
        <div>
          <h1>Dashboard Thống kê</h1>
          <p className="muted">Tổng quan & báo cáo nhanh</p>
        </div>
        <div className="sd-actions">
          <button className="btn" onClick={loadAll} disabled={loading}>
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="sd-loading">
          <div className="skeleton kpi" />
          <div className="skeleton grid" />
        </div>
      ) : error ? (
        <div className="sd-error">{error}</div>
      ) : (
        <>
          {/* KPI row */}
          <section className="kpi-row">
            <div className="kpi">
              <div className="kpi-title">Tổng doanh thu</div>
              <div className="kpi-value">{fmt(overview?.total_revenue ?? null)}</div>
              <div className="kpi-sub">Doanh thu hệ thống</div>
            </div>

            <div className="kpi">
              <div className="kpi-title">Đơn hôm nay</div>
              <div className="kpi-value">{fmtNumber(overview?.orders_today ?? 0)}</div>
              <div className="kpi-sub">So với hôm qua: {overview?.orders_today_last ?? 0}</div>
            </div>

            <div className="kpi">
              <div className="kpi-title">Người dùng</div>
              <div className="kpi-value">{fmtNumber(overview?.total_users ?? 0)}</div>
              <div className="kpi-sub">Người dùng mới tuần</div>
            </div>

            <div className="kpi">
              <div className="kpi-title">Sản phẩm đã bán</div>
              <div className="kpi-value">{fmtNumber(overview?.products_sold ?? 0)}</div>
              <div className="kpi-sub">Sản phẩm đã bán (tổng)</div>
            </div>
          </section>

          <main className="sd-main">
            {/* left column (wider) */}
            <section className="left-col">
              <div className="card">
                <div className="card-head">
                  <h3>Doanh thu theo tháng</h3>
                </div>
                <div className="card-body chart-wrap">
                  {revChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={revChartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(v) => v.toLocaleString?.() ?? v} />
                        <Tooltip formatter={(v: any) => (typeof v === "number" ? v.toLocaleString("vi-VN") + "₫" : v)} />
                        <Legend />
                        <Bar dataKey="revenue" name="Doanh thu" fill="#2b6cb0" />
                        <Bar dataKey="ordersCount" name="Số đơn" fill="#60a5fa" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div>Không có dữ liệu doanh thu</div>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h3>Đơn hàng gần đây</h3>
                  <div className="small-muted">{recentOrders.length} đơn</div>
                </div>
                <div className="card-body">
                  <table className="simple-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Mã</th>
                        <th>Khách</th>
                        <th>Trạng thái</th>
                        <th>Tổng</th>
                        <th>Ngày</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: "center" }}>
                            Không có đơn hàng
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map((o: any, idx: number) => (
                          <tr key={o.id ?? idx}>
                            <td>{idx + 1}</td>
                            <td>{o.order_number}</td>
                            <td>{o.name}</td>
                            <td>{o.status}</td>
                            <td style={{ fontWeight: 700 }}>{(o.total ?? 0).toLocaleString("vi-VN")}₫</td>
                            <td>{new Date(o.created_at).toLocaleDateString("vi-VN")}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* right column (narrow) */}
            <aside className="right-col">
              <div className="card small">
                <div className="card-head">
                  <h4>Top khách hàng</h4>
                </div>
                <div className="card-body small-list">
                  {topCustomers.length === 0 ? (
                    <div className="empty">Không có dữ liệu</div>
                  ) : (
                    topCustomers.slice(0, 6).map((c: any, i: number) => (
                      <div className="list-item" key={c.user_id ?? i}>
                        <div className="li-index">{i + 1}</div>
                        <div className="li-main">
                          <div className="li-title">{c.user?.name ?? "—"}</div>
                          <div className="li-sub">{c.orders_count} đơn • {Number(c.total_spent).toLocaleString("vi-VN")}₫</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="card small">
                <div className="card-head">
                  <h4>Doanh thu theo danh mục</h4>
                </div>
                <div className="card-body small-chart">
                  {categories.length ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={categories.slice(0, 6)} layout="vertical" margin={{ left: 8, right: 8 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip formatter={(v: any) => (typeof v === "number" ? v.toLocaleString("vi-VN") + "₫" : v)} />
                        <Bar dataKey="revenue" fill="#16a34a" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty">Không có dữ liệu</div>
                  )}
                </div>
              </div>

              <div className="card small">
                <div className="card-head">
                  <h4>Người dùng mới (tuần)</h4>
                </div>
                <div className="card-body small-chart">
                  {newUsersChartData.length ? (
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={newUsersChartData} margin={{ left: 0, right: 8 }}>
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0891b2" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty">Không có dữ liệu</div>
                  )}
                </div>
              </div>
            </aside>
          </main>
        </>
      )}

      {/* styles */}
      <style jsx>{`
        .sd-root {
          padding: 20px;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: #1f2937;
        }
        .sd-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .sd-header h1 { margin: 0; font-size: 20px; }
        .muted { color: #6b7280; margin-top: 4px; }

        .sd-actions .btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
        }
        .sd-actions .btn[disabled] { opacity: 0.6; cursor: not-allowed; }

        .kpi-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }
        .kpi {
          background: white;
          border-radius: 8px;
          padding: 14px;
          box-shadow: 0 1px 3px rgba(15,23,42,0.06);
        }
        .kpi-title { color: #6b7280; font-size: 13px; }
        .kpi-value { font-size: 18px; font-weight: 700; margin-top: 6px; }
        .kpi-sub { color: #9ca3af; font-size: 12px; margin-top: 8px; }

        .sd-main {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 16px;
        }
        .left-col { display: flex; flex-direction: column; gap: 16px; }
        .right-col { display: flex; flex-direction: column; gap: 12px; }

        .card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 6px rgba(15,23,42,0.06);
          overflow: hidden;
        }
        .card.small { padding: 0; }
        .card-head {
          padding: 12px 16px;
          border-bottom: 1px solid #eef2f7;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .card-body { padding: 12px 16px; }

        .chart-wrap { min-height: 320px; }

        .simple-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .simple-table th, .simple-table td {
          padding: 8px 10px;
          border-bottom: 1px dashed #eee;
          text-align: left;
        }
        .simple-table thead th { font-weight: 600; color: #374151; }

        .small-list .list-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 6px;
        }
        .li-index {
          background: #f3f4f6;
          color: #374151;
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          font-weight: 700;
        }
        .li-title { font-weight: 600; font-size: 14px; }
        .li-sub { color: #6b7280; font-size: 12px; margin-top: 4px; }

        .small-muted { color: #6b7280; font-size: 13px; }

        .empty { color: #6b7280; padding: 12px 0; text-align: center; }

        /* loading skeleton */
        .sd-loading .skeleton.kpi { height: 72px; margin-bottom: 12px; border-radius: 8px; background: linear-gradient(90deg,#f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; }
        .sd-loading .skeleton.grid { height: 480px; border-radius: 8px; background: linear-gradient(90deg,#f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; }

        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }

        /* responsive */
        @media (max-width: 980px) {
          .sd-main { grid-template-columns: 1fr; }
          .right-col { order: 2; }
        }
      `}</style>
    </div>
  );
};

export default StatisticDashboard;
