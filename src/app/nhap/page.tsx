// "use client" required for Next.js app router client component
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  fetchAdminStatistics,
  fetchRevenueByCategory,
  fetchTopCustomers,
  fetchTopSellingProducts,
  fetchSlowSellingProducts,
  fetchNewUsersStatistic,
  fetchRevenueSummaryByType,
  fetchRevenueStatisticsByDate,
  fetchOrderCountByStatus,
  fetchVisitsStatistics,
} from "../lib/Statistic"; // adjust path if needed

// Chart.js + react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// helper
function formatCurrency(n?: number | null) {
  if (!n && n !== 0) return "0 đ";
  return Number(n).toLocaleString("vi-VN") + " đ";
}

export default function StatisticDashboard() {
  // data states
  const [adminStats, setAdminStats] = useState<any>(null);
  const [revenueSeries, setRevenueSeries] = useState<any[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, number> | null>(null);
  const [topSelling, setTopSelling] = useState<any[]>([]);
  const [slowSelling, setSlowSelling] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [revenueByCategory, setRevenueByCategory] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [newUsers, setNewUsers] = useState<any | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // date range for revenue (default last 14 days)
  const [range, setRange] = useState(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 13);
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    return { from: iso(from), to: iso(to) };
  });

  // fetch all
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          stats,
          revenueRangeData,
          ordersStatus,
          topSell,
          slowSell,
          customers,
          byCategory,
          visitsWeek,
          newUsersStat,
        ] = await Promise.all([
          fetchAdminStatistics(),
          fetchRevenueStatisticsByDate(range.from, range.to),
          fetchOrderCountByStatus(),
          fetchTopSellingProducts(),
          fetchSlowSellingProducts(),
          fetchTopCustomers(),
          fetchRevenueByCategory(),
          fetchVisitsStatistics("week"),
          fetchNewUsersStatistic("month"),
        ]);

        if (!mounted) return;
        setAdminStats(stats);
        setRevenueSeries(revenueRangeData || []);
        setOrdersByStatus(ordersStatus || null);
        setTopSelling(topSell || []);
        setSlowSelling(slowSell || []);
        setTopCustomers(customers || []);
        setRevenueByCategory(byCategory || []);
        setVisits(visitsWeek || []);
        setNewUsers(newUsersStat || null);
      } catch (err: any) {
        console.error("Error loading statistics:", err);
        if (mounted) setError(err?.message || "Lỗi khi tải dữ liệu");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [range.from, range.to]);

  // chart datasets
  const revenueLine = useMemo(() => {
    const labels = revenueSeries.map((r) => r.date);
    const data = revenueSeries.map((r) => r.revenue ?? 0);
    return {
      labels,
      datasets: [
        {
          label: "Doanh thu",
          data,
          fill: true,
          tension: 0.3,
        },
      ],
    };
  }, [revenueSeries]);

  const ordersDoughnut = useMemo(() => {
    if (!ordersByStatus) return { labels: [], datasets: [] };
    const labels = Object.keys(ordersByStatus);
    const data = Object.values(ordersByStatus);
    return {
      labels,
      datasets: [{ data }],
    };
  }, [ordersByStatus]);

  const revenueByCategoryBar = useMemo(() => {
    const labels = revenueByCategory.map((c: any) => c.category_name);
    const data = revenueByCategory.map((c: any) => c.revenue ?? 0);
    return {
      labels,
      datasets: [{ label: "Doanh thu", data }],
    };
  }, [revenueByCategory]);

  const visitsLine = useMemo(() => {
    const labels = visits.map((v) => v.date);
    const data = visits.map((v) => v.visits ?? 0);
    return {
      labels,
      datasets: [{ label: "Lượt truy cập", data, fill: true, tension: 0.3 }],
    };
  }, [visits]);

  // refresh handler
  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        stats,
        revenueRangeData,
        ordersStatus,
        topSell,
        slowSell,
        customers,
        byCategory,
        visitsWeek,
        newUsersStat,
      ] = await Promise.all([
        fetchAdminStatistics(),
        fetchRevenueStatisticsByDate(range.from, range.to),
        fetchOrderCountByStatus(),
        fetchTopSellingProducts(),
        fetchSlowSellingProducts(),
        fetchTopCustomers(),
        fetchRevenueByCategory(),
        fetchVisitsStatistics("week"),
        fetchNewUsersStatistic("month"),
      ]);

      setAdminStats(stats);
      setRevenueSeries(revenueRangeData || []);
      setOrdersByStatus(ordersStatus || null);
      setTopSelling(topSell || []);
      setSlowSelling(slowSell || []);
      setTopCustomers(customers || []);
      setRevenueByCategory(byCategory || []);
      setVisits(visitsWeek || []);
      setNewUsers(newUsersStat || null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="home">
      <header className="home-header">
        <div className="text">Xin chào Admin</div>
        <div className="search">
          <input type="text" placeholder="Tìm kiếm khách hàng, công việc" />
          <button className="btn-refresh" onClick={refresh} disabled={loading}>
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
        </div>
      </header>

      <main className="home-main">
        <div className="home__container one">
          <div className="home__content_top">
            <div className="home__content_top--item">
              <div className="box__content--title">
                <h2 className="text">Tổng Sản Phẩm</h2>
              </div>
              <div className="box__content--item">
                <span className="number">{adminStats?.total_products ?? 0}</span>
              </div>
            </div>

            <div className="home__content_top--item">
              <div className="box__content--title">
                <h2 className="text">Tổng Đơn Hàng</h2>
              </div>
              <div className="box__content--item">
                <span className="number">{adminStats?.total_orders ?? 0}</span>
              </div>
            </div>

            <div className="home__content_top--item">
              <div className="box__content--title">
                <h2 className="text">Tổng Khách hàng</h2>
              </div>
              <div className="box__content--item">
                <span className="number">{adminStats?.total_customers ?? 0}</span>
              </div>
            </div>

            <div className="home__content_top--item">
              <div className="box__content--title">
                <h2 className="text">Doanh thu (range)</h2>
              </div>
              <div className="box__content--item">
                <span className="number">
                  {revenueSeries.reduce((s, r) => s + (r.revenue ?? 0), 0) ? formatCurrency(revenueSeries.reduce((s, r) => s + (r.revenue ?? 0), 0)) : "0 đ"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="home__container two">
          <div className="home__container--content">
            <div className="home__container--content_Left">
              {/* Revenue chart block */}
              <div className="panel">
                <div className="panel-head">
                  <h3>Doanh thu theo ngày</h3>
                  <div className="date-range">
                    <input
                      type="date"
                      value={range.from}
                      onChange={(e) => setRange((s) => ({ ...s, from: e.target.value }))}
                    />
                    <span>→</span>
                    <input
                      type="date"
                      value={range.to}
                      onChange={(e) => setRange((s) => ({ ...s, to: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="panel-body chart-area">
                  <Line data={revenueLine} options={{ maintainAspectRatio: false }} />
                </div>
              </div>

              {/* Orders by status */}
              <div className="panel small">
                <div className="panel-head">
                  <h3>Đơn hàng theo trạng thái</h3>
                </div>
                <div className="panel-body chart-area-small">
                  <Doughnut data={ordersDoughnut} options={{ maintainAspectRatio: false }} />
                </div>
              </div>

              {/* Visits */}
              <div className="panel">
                <div className="panel-head">
                  <h3>Lượt truy cập (tuần)</h3>
                </div>
                <div className="panel-body chart-area">
                  <Line data={visitsLine} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            <div className="home__container--content_right">
              {/* Top selling products */}
              <div className="panel">
                <div className="panel-head"><h3>Top sản phẩm bán chạy</h3></div>
                <div className="panel-body small-table">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Sản phẩm</th>
                        <th>Số bán</th>
                        <th>Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSelling.length === 0 && <tr><td colSpan={4} className="empty">Không có dữ liệu</td></tr>}
                      {topSelling.map((p, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{p.product_name}</td>
                          <td>{p.total_sold}</td>
                          <td>{formatCurrency(p.total_revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Slow selling */}
              <div className="panel">
                <div className="panel-head"><h3>Sản phẩm bán chậm</h3></div>
                <div className="panel-body small-table">
                  <table>
                    <thead>
                      <tr><th>#</th><th>Sản phẩm</th><th>Số bán</th></tr>
                    </thead>
                    <tbody>
                      {slowSelling.length === 0 && <tr><td colSpan={3} className="empty">Không có dữ liệu</td></tr>}
                      {slowSelling.map((p, i) => (
                        <tr key={i}><td>{i + 1}</td><td>{p.product_name}</td><td>{p.total_sold}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Revenue by category */}
              <div className="panel">
                <div className="panel-head"><h3>Doanh thu theo danh mục</h3></div>
                <div className="panel-body chart-area">
                  <Bar data={revenueByCategoryBar} options={{ maintainAspectRatio: false }} />
                </div>
              </div>

              {/* Top customers */}
              <div className="panel">
                <div className="panel-head">
                  <h3>Top khách hàng</h3>
                  <div className="meta">Khách mới (tháng): {newUsers?.total_new_users ?? 0}</div>
                </div>
                <div className="panel-body small-table">
                  <table>
                    <thead>
                      <tr><th>#</th><th>Khách</th><th>Số đơn</th><th>Tổng chi</th></tr>
                    </thead>
                    <tbody>
                      {topCustomers.length === 0 && <tr><td colSpan={4} className="empty">Không có dữ liệu</td></tr>}
                      {topCustomers.map((c, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{c.name}</td>
                          <td>{c.orders_count}</td>
                          <td>{formatCurrency(c.total_spent)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>

      {error && <div className="error-box">{error}</div>}
    </section>
  );
}
