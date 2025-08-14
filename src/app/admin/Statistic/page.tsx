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
import { AdminStatistics, RevenueByCategory, TopCustomer, TopSellingProduct, SlowSellingProduct, NewUser, RevenueSummary } from "../types/Statistic";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { fetchOrders } from "../lib/oder";
import { Order, PaginatedOrders } from "../types/oder";
import { useAuth } from "../lib/useAuth";

const StatisticDashboard: React.FC = () => {
  const [overview, setOverview] = useState<AdminStatistics | null>(null);
  const [categories, setCategories] = useState<RevenueByCategory[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  const [slowProducts, setSlowProducts] = useState<SlowSellingProduct[]>([]);
  const [newUsers, setNewUsers] = useState<NewUser[]>([]);
  const [revenueSummary, setRevenueSummary] = useState<RevenueSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderTotalRevenue, setOrderTotalRevenue] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [overviewData, catData, cusData, topProd, slowProd, newUserStat, revSum] = await Promise.all([
          fetchAdminStatistics(),
          fetchRevenueByCategory(),
          fetchTopCustomers(),
          fetchTopSellingProducts(),
          fetchSlowSellingProducts(),
          fetchNewUsersStatistic("week"),
          fetchRevenueSummaryByType("month"),
        ]);
        setOverview(overviewData);
        setCategories(catData);
        setTopCustomers(cusData);
        setTopProducts(topProd);
        setSlowProducts(slowProd);
        setNewUsers(newUserStat.users);
        setRevenueSummary(revSum);

        // Lấy tổng tiền tất cả đơn hàng giống như trang Oder
        let allOrders: Order[] = [];
        let page = 1;
        let lastPage = 1;
        do {
          const { orders, pagination }: PaginatedOrders = await fetchOrders(`page=${page}`);
          allOrders = allOrders.concat(orders);
          lastPage = pagination.last_page;
          page++;
        } while (page <= lastPage);
        const total = allOrders.reduce((sum, order) => sum + (order.total ? parseFloat(order.total) : 0), 0);
        setOrderTotalRevenue(total);
      } catch (err) {
        alert("Lỗi khi tải dữ liệu thống kê!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Tổng quan cho PieChart
  // Xoá COLORS, PieChart, Pie, Cell, LineChart, Line, overviewPieData

  // Người dùng mới theo ngày (BarChart)
  const newUsersByDate = newUsers.reduce((acc: Record<string, number>, user) => {
    const date = user.created_at.split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const newUsersChartData = Object.entries(newUsersByDate).map(([date, count]) => ({ date, count }));

  // So sánh doanh thu tháng này với tháng trước
  let compareText = '';
  let percent = 0;
  let diff = 0;
  if (revenueSummary.length >= 2) {
    const thisMonth = revenueSummary[revenueSummary.length - 1];
    const lastMonth = revenueSummary[revenueSummary.length - 2];
    diff = thisMonth.revenue - lastMonth.revenue;
    percent = lastMonth.revenue === 0 ? 100 : Math.round((diff / lastMonth.revenue) * 100);
    if (diff > 0) {
      compareText = `Tăng ${diff.toLocaleString()}₫ (${percent}%) so với tháng trước`;
    } else if (diff < 0) {
      compareText = `Giảm ${Math.abs(diff).toLocaleString()}₫ (${Math.abs(percent)}%) so với tháng trước`;
    } else {
      compareText = 'Không thay đổi so với tháng trước';
    }
  }

  // Tính toán so sánh cho từng chỉ số
  let compare = {
    revenue: '', revenueDiff: 0, revenuePercent: 0,
    ordersToday: '', ordersTodayDiff: 0, ordersTodayPercent: 0,
    ordersThisWeek: '', ordersThisWeekDiff: 0, ordersThisWeekPercent: 0,
    ordersThisMonth: '', ordersThisMonthDiff: 0, ordersThisMonthPercent: 0,
    productsSold: '', productsSoldDiff: 0, productsSoldPercent: 0,
    totalUsers: '', totalUsersDiff: 0, totalUsersPercent: 0,
  };
  if (overview && revenueSummary.length >= 2) {
    const thisMonth = revenueSummary[revenueSummary.length - 1];
    const lastMonth = revenueSummary[revenueSummary.length - 2];
    // Tổng doanh thu
    compare.revenueDiff = thisMonth.revenue - lastMonth.revenue;
    compare.revenuePercent = lastMonth.revenue === 0 ? 100 : Math.round((compare.revenueDiff / lastMonth.revenue) * 100);
    compare.revenue = compare.revenueDiff > 0
      ? `▲ +${compare.revenueDiff.toLocaleString()}₫ (${compare.revenuePercent}%)`
      : compare.revenueDiff < 0
        ? `▼ -${Math.abs(compare.revenueDiff).toLocaleString()}₫ (${Math.abs(compare.revenuePercent)}%)`
        : 'Không đổi';
    // Đơn hôm nay
    compare.ordersTodayDiff = overview.orders_today - (overview.orders_today_last ?? 0);
    compare.ordersTodayPercent = (overview.orders_today_last ?? 0) === 0 ? 100 : Math.round((compare.ordersTodayDiff / (overview.orders_today_last ?? 1)) * 100);
    compare.ordersToday = compare.ordersTodayDiff > 0
      ? `▲ +${compare.ordersTodayDiff} (${compare.ordersTodayPercent}%)`
      : compare.ordersTodayDiff < 0
        ? `▼ -${Math.abs(compare.ordersTodayDiff)} (${Math.abs(compare.ordersTodayPercent)}%)`
        : 'Không đổi';
    // Đơn tuần này
    compare.ordersThisWeekDiff = overview.orders_this_week - (overview.orders_this_week_last ?? 0);
    compare.ordersThisWeekPercent = (overview.orders_this_week_last ?? 0) === 0 ? 100 : Math.round((compare.ordersThisWeekDiff / (overview.orders_this_week_last ?? 1)) * 100);
    compare.ordersThisWeek = compare.ordersThisWeekDiff > 0
      ? `▲ +${compare.ordersThisWeekDiff} (${compare.ordersThisWeekPercent}%)`
      : compare.ordersThisWeekDiff < 0
        ? `▼ -${Math.abs(compare.ordersThisWeekDiff)} (${Math.abs(compare.ordersThisWeekPercent)}%)`
        : 'Không đổi';
    // Đơn tháng này
    compare.ordersThisMonthDiff = overview.orders_this_month - (overview.orders_this_month_last ?? 0);
    compare.ordersThisMonthPercent = (overview.orders_this_month_last ?? 0) === 0 ? 100 : Math.round((compare.ordersThisMonthDiff / (overview.orders_this_month_last ?? 1)) * 100);
    compare.ordersThisMonth = compare.ordersThisMonthDiff > 0
      ? `▲ +${compare.ordersThisMonthDiff} (${compare.ordersThisMonthPercent}%)`
      : compare.ordersThisMonthDiff < 0
        ? `▼ -${Math.abs(compare.ordersThisMonthDiff)} (${Math.abs(compare.ordersThisMonthPercent)}%)`
        : 'Không đổi';
    // Sản phẩm đã bán
    compare.productsSoldDiff = overview.products_sold - (overview.products_sold_last ?? 0);
    compare.productsSoldPercent = (overview.products_sold_last ?? 0) === 0 ? 100 : Math.round((compare.productsSoldDiff / (overview.products_sold_last ?? 1)) * 100);
    compare.productsSold = compare.productsSoldDiff > 0
      ? `▲ +${compare.productsSoldDiff} (${compare.productsSoldPercent}%)`
      : compare.productsSoldDiff < 0
        ? `▼ -${Math.abs(compare.productsSoldDiff)} (${Math.abs(compare.productsSoldPercent)}%)`
        : 'Không đổi';
    // Tổng người dùng
    compare.totalUsersDiff = overview.total_users - (overview.total_users_last ?? 0);
    compare.totalUsersPercent = (overview.total_users_last ?? 0) === 0 ? 100 : Math.round((compare.totalUsersDiff / (overview.total_users_last ?? 1)) * 100);
    compare.totalUsers = compare.totalUsersDiff > 0
      ? `▲ +${compare.totalUsersDiff} (${compare.totalUsersPercent}%)`
      : compare.totalUsersDiff < 0
        ? `▼ -${Math.abs(compare.totalUsersDiff)} (${Math.abs(compare.totalUsersPercent)}%)`
        : 'Không đổi';
  }

  if (loading) return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-card-title">Thống kê</h1>
        <p className="text-muted">Đang tải dữ liệu...</p>
      </div>
      
      {/* Skeleton loading */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ 
            height: '24px', 
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            borderRadius: 'var(--radius-md)',
            animation: 'loading 1.5s infinite'
          }}></div>
        </div>
        <div className="admin-card-body">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 'var(--spacing-lg)' 
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ 
                height: '120px', 
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                borderRadius: 'var(--radius-lg)',
                animation: 'loading 1.5s infinite',
                animationDelay: `${i * 0.1}s`
              }}></div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
      `}</style>
    </div>
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-card-title">Thống kê</h1>
        <p className="text-muted">Báo cáo và thống kê hệ thống</p>
      </div>
      
      {/* Tổng quan thống kê */}
      {overview && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Tổng quan hệ thống</h2>
          </div>
          <div className="admin-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
              <div className="admin-card bg-primary">
                <h3 className="font-semibold text-primary">Tổng doanh thu</h3>
                <p className="font-bold text-lg">{orderTotalRevenue !== null ? orderTotalRevenue.toLocaleString() + '₫' : '...'}</p>
                <span className={`admin-badge ${compare.revenueDiff > 0 ? 'badge-success' : compare.revenueDiff < 0 ? 'badge-danger' : 'badge-info'}`}>
                  {compare.revenue}
                </span>
              </div>
              
              <div className="admin-card bg-success">
                <h3 className="font-semibold text-success">Đơn hôm nay</h3>
                <p className="font-bold text-lg">{overview.orders_today}</p>
                <span className={`admin-badge ${compare.ordersTodayDiff > 0 ? 'badge-success' : compare.ordersTodayDiff < 0 ? 'badge-danger' : 'badge-info'}`}>
                  {compare.ordersToday}
                </span>
            </div>
              
              <div className="admin-card bg-warning">
                <h3 className="font-semibold text-warning">Đơn tuần này</h3>
                <p className="font-bold text-lg">{overview.orders_this_week}</p>
                <span className={`admin-badge ${compare.ordersThisWeekDiff > 0 ? 'badge-success' : compare.ordersThisWeekDiff < 0 ? 'badge-danger' : 'badge-info'}`}>
                  {compare.ordersThisWeek}
                </span>
            </div>
              
              <div className="admin-card bg-danger">
                <h3 className="font-semibold text-danger">Đơn tháng này</h3>
                <p className="font-bold text-lg">{overview.orders_this_month}</p>
                <span className={`admin-badge ${compare.ordersThisMonthDiff > 0 ? 'badge-success' : compare.ordersThisMonthDiff < 0 ? 'badge-danger' : 'badge-info'}`}>
                  {compare.ordersThisMonth}
                </span>
            </div>
              
              <div className="admin-card bg-info">
                <h3 className="font-semibold text-info">Sản phẩm đã bán</h3>
                <p className="font-bold text-lg">{overview.products_sold}</p>
                <span className={`admin-badge ${compare.productsSoldDiff > 0 ? 'badge-success' : compare.productsSoldDiff < 0 ? 'badge-danger' : 'badge-info'}`}>
                  {compare.productsSold}
                </span>
            </div>
              
              <div className="admin-card bg-primary">
                <h3 className="font-semibold text-primary">Tổng người dùng</h3>
                <p className="font-bold text-lg">{overview.total_users}</p>
                <span className={`admin-badge ${compare.totalUsersDiff > 0 ? 'badge-success' : compare.totalUsersDiff < 0 ? 'badge-danger' : 'badge-info'}`}>
                  {compare.totalUsers}
                </span>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Biểu đồ cột doanh thu theo tháng */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Doanh thu theo tháng</h2>
        </div>
        <div className="admin-card-body">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={revenueSummary} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip formatter={(value: any) => value.toLocaleString()} />
            <Legend />
            <Bar dataKey="revenue" name="Doanh thu (₫)" fill="#2563eb" radius={[6, 6, 0, 0]} />
            <Bar dataKey={row => row.orders.length} name="Số đơn" fill="#60a5fa" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <table className="admin-table">
          <thead>
            <tr><th>Ngày</th><th>Doanh thu (₫)</th><th>Số đơn</th></tr>
          </thead>
          <tbody>
            {revenueSummary.map((sum) => (
              <tr key={sum.date}><td>{sum.date}</td><td>{sum.revenue.toLocaleString()}</td><td>{sum.orders.length}</td></tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Doanh thu theo danh mục - BarChart ngang */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Doanh thu theo danh mục</h2>
        </div>
        <div className="admin-card-body">
        <ResponsiveContainer width="100%" height={Math.max(220, categories.length * 38)}>
          <BarChart data={categories} layout="vertical" margin={{ left: 32, right: 24, top: 16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 13 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 13 }} width={120} />
            <Tooltip formatter={(value: any) => value.toLocaleString()} />
            <Legend />
            <Bar dataKey="revenue" name="Doanh thu (₫)" fill="#22c55e" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <table className="admin-table">
          <thead>
            <tr><th>STT</th><th>Danh mục</th><th>Doanh thu (₫)</th></tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <tr key={cat.id}><td>{idx + 1}</td><td>{cat.name}</td><td>{cat.revenue.toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Top khách hàng - BarChart dọc */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Top khách hàng</h2>
        </div>
        <div className="admin-card-body">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={topCustomers} margin={{ left: 0, right: 24, top: 16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={row => row.user.name as string} tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip formatter={(value: any) => value.toLocaleString()} />
            <Legend />
            <Bar dataKey="total_spent" name="Tổng chi tiêu (₫)" fill="#f59e42" radius={[6, 6, 0, 0]} />
            <Bar dataKey="orders_count" name="Số đơn" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <table className="admin-table">
          <thead>
            <tr><th>STT</th><th>Tên</th><th>Email</th><th>Đơn hàng</th><th>Tổng chi tiêu (₫)</th></tr>
          </thead>
          <tbody>
            {topCustomers.map((cus, idx) => (
              <tr key={cus.user_id}><td>{idx + 1}</td><td>{cus.user.name}</td><td>{cus.user.email}</td><td>{cus.orders_count}</td><td>{cus.total_spent.toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Sản phẩm bán chạy - BarChart dọc */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Sản phẩm bán chạy</h2>
        </div>
        <div className="admin-card-body">
        <ResponsiveContainer width="100%" height={Math.max(220, topProducts.length * 38)}>
          <BarChart data={topProducts} margin={{ left: 0, right: 24, top: 16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={row => row.product.name as string} tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_sold" name="Đã bán" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <table className="admin-table">
          <thead>
            <tr><th>STT</th><th>Tên sản phẩm</th><th>Đã bán</th></tr>
          </thead>
          <tbody>
            {topProducts.map((prod, idx) => (
              <tr key={prod.product_id}><td>{idx + 1}</td><td>{prod.product.name}</td><td>{prod.total_sold}</td></tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Sản phẩm bán chậm - BarChart dọc */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Sản phẩm bán chậm</h2>
        </div>
        <div className="admin-card-body">
        <ResponsiveContainer width="100%" height={Math.max(220, slowProducts.length * 38)}>
          <BarChart data={slowProducts} margin={{ left: 0, right: 24, top: 16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={row => row.product.name as string} tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_sold" name="Đã bán" fill="#f43f5e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <table className="admin-table">
          <thead>
            <tr><th>STT</th><th>Tên sản phẩm</th><th>Đã bán</th></tr>
          </thead>
          <tbody>
            {slowProducts.map((prod, idx) => (
              <tr key={prod.product_id}><td>{idx + 1}</td><td>{prod.product.name}</td><td>{prod.total_sold}</td></tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Người dùng mới - BarChart theo ngày */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Người dùng mới (tuần này)</h2>
        </div>
        <div className="admin-card-body">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={newUsersChartData} margin={{ left: 0, right: 24, top: 16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Người dùng mới" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <table className="admin-table">
          <thead>
            <tr><th>STT</th><th>Tên</th><th>Email</th><th>Ngày tạo</th></tr>
          </thead>
          <tbody>
            {newUsers.map((user, idx) => (
              <tr key={user.id}><td>{idx + 1}</td><td>{user.name}</td><td>{user.email}</td><td>{user.created_at}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {/* CSS tùy chỉnh cho trang thống kê */}
      <style jsx>{`
        .admin-container {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%);
          min-height: 100vh;
          padding: var(--spacing-xl);
        }
        
        .admin-header {
          margin-bottom: var(--spacing-2xl);
          text-align: center;
        }
        
        .admin-header h1 {
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: var(--spacing-sm);
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .admin-header p {
          color: rgba(255,255,255,0.9);
          font-size: 1.1rem;
          margin: 0;
        }
        
        .admin-card {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          margin-bottom: var(--spacing-xl);
          transition: all var(--transition-normal);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
        }
        
        .admin-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .admin-card-header {
          border-bottom: 2px solid var(--primary-100);
          padding: var(--spacing-lg) var(--spacing-xl);
          margin-bottom: 0;
          background: linear-gradient(135deg, var(--primary-50) 0%, white 100%);
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
        }
        
        .admin-card-title {
          color: var(--primary-800);
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .admin-card-body {
          padding: var(--spacing-xl);
        }
        
        /* Cards tổng quan */
        .admin-card .admin-card {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
          color: #1f2937;
          border: 1px solid rgba(99, 102, 241, 0.1);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.1);
          transition: all var(--transition-normal);
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-xl);
          padding: var(--spacing-xl);
          min-height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .admin-card .admin-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          border-radius: 50%;
          transition: all var(--transition-normal);
        }
        
        .admin-card .admin-card:hover {
          transform: translateY(-5px) scale(1.03);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.4);
        }
        
        .admin-card .admin-card:hover::before {
          transform: scale(1.2);
          opacity: 0.8;
        }
        
        .admin-card .admin-card.bg-success {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
          border: 1px solid rgba(16, 185, 129, 0.2);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.1);
        }
        
        .admin-card .admin-card.bg-success:hover {
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2);
        }
        
        .admin-card .admin-card.bg-success p {
          color: #10b981;
        }
        
        .admin-card .admin-card.bg-warning {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%);
          border: 1px solid rgba(245, 158, 11, 0.2);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.1);
        }
        
        .admin-card .admin-card.bg-warning:hover {
          box-shadow: 0 20px 40px rgba(245, 158, 11, 0.2);
        }
        
        .admin-card .admin-card.bg-warning p {
          color: #f59e0b;
        }
        
        .admin-card .admin-card.bg-danger {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%, #fecaca 100%);
          border: 1px solid rgba(239, 68, 68, 0.2);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.1);
        }
        
        .admin-card .admin-card.bg-danger:hover {
          box-shadow: 0 20px 40px rgba(239, 68, 68, 0.2);
        }
        
        .admin-card .admin-card.bg-danger p {
          color: #ef4444;
        }
        
        .admin-card .admin-card.bg-info {
          background: linear-gradient(135deg, #ecfeff 0%, #cffafe 50%, #a5f3fc 100%);
          border: 1px solid rgba(6, 182, 212, 0.2);
          box-shadow: 0 8px 25px rgba(6, 182, 212, 0.1);
        }
        
        .admin-card .admin-card.bg-info:hover {
          box-shadow: 0 20px 40px rgba(6, 182, 212, 0.2);
        }
        
        .admin-card .admin-card.bg-info p {
          color: #06b6d4;
        }
        
        .admin-card .admin-card h3 {
          color: #1f2937;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 2;
        }
        
        .admin-card .admin-card p {
          color: #6366f1;
          font-size: 2.2rem;
          font-weight: 800;
          margin: var(--spacing-sm) 0;
          text-shadow: none;
          position: relative;
          z-index: 2;
          line-height: 1.2;
        }
        
        /* Icon decoration */
        .admin-card .admin-card::after {
          content: '';
          position: absolute;
          bottom: var(--spacing-sm);
          left: var(--spacing-sm);
          width: 12px;
          height: 12px;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .admin-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-lg);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .badge-success {
          background: rgba(34, 197, 94, 0.2);
          color: #16a34a;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        
        .badge-danger {
          background: rgba(239, 68, 68, 0.2);
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        .badge-info {
          background: rgba(14, 165, 233, 0.2);
          color: #0284c7;
          border: 1px solid rgba(14, 165, 233, 0.3);
        }
        
        /* Tables */
        .admin-table {
          margin-top: var(--spacing-lg);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%);
          backdrop-filter: blur(15px);
        }
        
        .admin-table th {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: var(--spacing-lg) var(--spacing-xl);
          border-bottom: 2px solid rgba(255,255,255,0.2);
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          position: relative;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        
        .admin-table th::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%);
        }
        
        .admin-table td {
          padding: var(--spacing-lg) var(--spacing-xl);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          transition: all var(--transition-normal);
          font-size: 0.95rem;
          color: var(--gray-700);
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%);
          backdrop-filter: blur(10px);
        }
        
        .admin-table tr {
          transition: all var(--transition-normal);
        }
        
        .admin-table tr:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(96, 165, 250, 0.1) 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
        }
        
        .admin-table tr:hover td {
          background: transparent;
          color: var(--primary-700);
          font-weight: 500;
        }
        
        .admin-table tr:last-child td {
          border-bottom: none;
        }
        
        /* Alternating row colors */
        .admin-table tr:nth-child(even) td {
          background: linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%);
          backdrop-filter: blur(10px);
        }
        
        .admin-table tr:nth-child(even):hover td {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(96, 165, 250, 0.15) 100%);
          backdrop-filter: blur(10px);
        }
        
        /* First column styling */
        .admin-table td:first-child {
          font-weight: 600;
          color: var(--primary-600);
          text-align: center;
        }
        
        /* Email column styling */
        .admin-table td:nth-child(3) {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 1.3rem;
          color: var(--gray-800);
          font-weight: 600;
        }
        
        /* Date column styling */
        .admin-table td:last-child {
          font-size: 1rem;
          color: var(--gray-800);
          font-style: normal;
          font-weight: 600;
        }
        
        /* Name column styling */
        .admin-table td:nth-child(2) {
          font-size: 1.4rem;
          color: var(--gray-800);
          font-weight: 600;
        }
        
        /* Table animations */
        .admin-table {
          animation: tableSlideIn 0.8s ease-out;
        }
        
        .admin-table tr {
          animation: rowFadeIn 0.6s ease-out;
        }
        
        .admin-table tr:nth-child(1) { animation-delay: 0.1s; }
        .admin-table tr:nth-child(2) { animation-delay: 0.2s; }
        .admin-table tr:nth-child(3) { animation-delay: 0.3s; }
        .admin-table tr:nth-child(4) { animation-delay: 0.4s; }
        .admin-table tr:nth-child(5) { animation-delay: 0.5s; }
        .admin-table tr:nth-child(6) { animation-delay: 0.6s; }
        .admin-table tr:nth-child(7) { animation-delay: 0.7s; }
        .admin-table tr:nth-child(8) { animation-delay: 0.8s; }
        .admin-table tr:nth-child(9) { animation-delay: 0.9s; }
        .admin-table tr:nth-child(10) { animation-delay: 1.0s; }
        
        @keyframes tableSlideIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes rowFadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Table scrollbar styling */
        .admin-table::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .admin-table::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
        }
        
        .admin-table::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-400) 100%);
          border-radius: 4px;
        }
        
        .admin-table::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-500) 100%);
        }
        
        /* Charts */
        .recharts-wrapper {
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          background: white;
          padding: var(--spacing-lg);
          border: 1px solid var(--border-light);
        }
        
        .recharts-wrapper:hover {
          box-shadow: 0 12px 35px rgba(0,0,0,0.2);
          transform: translateY(-2px);
          transition: all var(--transition-normal);
        }
        
        /* Custom chart colors */
        .recharts-bar-rectangle {
          transition: all var(--transition-fast);
        }
        
        .recharts-bar-rectangle:hover {
          opacity: 0.8;
          transform: scale(1.05);
        }
        
        /* Tooltip styling */
        .recharts-tooltip-wrapper {
          border-radius: var(--radius-md);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          border: none;
        }
        
        /* Loading state */
        .admin-container:has(.loading) {
          opacity: 0.7;
          pointer-events: none;
        }
        
        /* Responsive */
        @media (max-width: 1200px) {
          .admin-container {
            padding: var(--spacing-lg);
          }
          
          .admin-header h1 {
            font-size: 2rem;
          }
        }
        
        @media (max-width: 768px) {
          .admin-container {
            padding: var(--spacing-md);
          }
          
          .admin-header h1 {
            font-size: 1.5rem;
          }
          
          .admin-card {
            margin-bottom: var(--spacing-lg);
          }
          
          .admin-card-body {
            padding: var(--spacing-lg);
          }
          
          /* Cards responsive */
          .admin-card .admin-card {
            min-height: 120px;
            padding: var(--spacing-lg);
          }
          
          .admin-card .admin-card h3 {
            font-size: 0.8rem;
          }
          
          .admin-card .admin-card p {
            font-size: 1.8rem;
          }
          
          .admin-table {
            font-size: 0.75rem;
            border-radius: var(--radius-lg);
          }
          
          .admin-table th {
            padding: var(--spacing-sm) var(--spacing-md);
            font-size: 0.8rem;
          }
          
          .admin-table td {
            padding: var(--spacing-sm) var(--spacing-md);
            font-size: 0.75rem;
          }
          
          .admin-table td:nth-child(2) {
            font-size: 1.1rem;
          }
          
          .admin-table td:nth-child(3) {
            font-size: 1rem;
            word-break: break-all;
          }
          
          .admin-table td:last-child {
            font-size: 0.8rem;
          }
        }
        
        @media (max-width: 480px) {
          .admin-table {
            font-size: 0.65rem;
          }
          
          .admin-table th,
          .admin-table td {
            padding: var(--spacing-xs) var(--spacing-sm);
          }
          
          .admin-table td:nth-child(2) {
            font-size: 0.9rem;
          }
          
          .admin-table td:nth-child(3) {
            font-size: 0.8rem;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .admin-table td:last-child {
            font-size: 0.7rem;
          }
          
          /* Cards mobile */
          .admin-card .admin-card {
            min-height: 100px;
            padding: var(--spacing-md);
          }
          
          .admin-card .admin-card h3 {
            font-size: 0.7rem;
            margin-bottom: var(--spacing-xs);
          }
          
          .admin-card .admin-card p {
            font-size: 1.5rem;
            margin: var(--spacing-xs) 0;
          }
          
          .admin-card .admin-card::after {
            width: 8px;
            height: 8px;
          }
        }
        
        /* Animation cho cards */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .admin-card {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .admin-card:nth-child(1) { animation-delay: 0.1s; }
        .admin-card:nth-child(2) { animation-delay: 0.2s; }
        .admin-card:nth-child(3) { animation-delay: 0.3s; }
        .admin-card:nth-child(4) { animation-delay: 0.4s; }
        .admin-card:nth-child(5) { animation-delay: 0.5s; }
        .admin-card:nth-child(6) { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
};

export default StatisticDashboard;
