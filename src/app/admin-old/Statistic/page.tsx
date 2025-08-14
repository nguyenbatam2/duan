"use client";
import "../style/login.css";
import { useEffect, useState } from "react";

interface StatisticData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalPurchased: number;
  dailyStats: { day: number; income: number; expense: number }[];
}

interface TopProduct {
  name: string;
  sold: number;
  revenue: number;
}

export default function StatisticPage() {
  const [stats, setStats] = useState<StatisticData | null>(null);
  const [loading, setLoading] = useState(true);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [allProducts, setAllProducts] = useState<TopProduct[]>([]);
  const [filterType, setFilterType] = useState<'month' | 'week'>("month");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  // API giả lập
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Dữ liệu mock cho từng tuần/tháng
      let dailyStats;
      let top, all;
      if (filterType === "week") {
        dailyStats = Array.from({ length: 7 }, (_, i) => ({
          day: i + 1,
          income: Math.floor(Math.random() * 5000000) + 1000000,
          expense: Math.floor(Math.random() * 3000000) + 500000,
        }));
        top = [
          { name: "Sữa hạt óc chó", sold: 30, revenue: 600000 },
          { name: "Bánh quy yến mạch", sold: 25, revenue: 500000 },
          { name: "Nước ép cam", sold: 20, revenue: 400000 },
        ];
        all = [
          ...top,
          { name: "Bánh mì nguyên cám", sold: 10, revenue: 200000 },
          { name: "Sữa hạnh nhân", sold: 8, revenue: 160000 },
        ];
      } else {
        dailyStats = Array.from({ length: 30 }, (_, i) => ({
          day: i + 1,
          income: Math.floor(Math.random() * 5000000) + 1000000,
          expense: Math.floor(Math.random() * 3000000) + 500000,
        }));
        top = [
          { name: "Sữa hạt óc chó", sold: 120, revenue: 2400000 },
          { name: "Bánh quy yến mạch", sold: 95, revenue: 1900000 },
          { name: "Nước ép cam", sold: 80, revenue: 1600000 },
          { name: "Trà xanh matcha", sold: 70, revenue: 1400000 },
          { name: "Sữa đậu nành", sold: 65, revenue: 1300000 },
        ];
        all = [
          ...top,
          { name: "Bánh mì nguyên cám", sold: 50, revenue: 1000000 },
          { name: "Sữa hạnh nhân", sold: 40, revenue: 800000 },
          { name: "Nước ép táo", sold: 35, revenue: 700000 },
          { name: "Trà hoa cúc", sold: 30, revenue: 600000 },
          { name: "Sữa gạo lứt", sold: 25, revenue: 500000 },
        ];
      }
      setStats({
        totalProducts: 1234,
        totalOrders: 567,
        totalRevenue: 89000000,
        totalUsers: 321,
        totalPurchased: filterType === "week" ? 80 : 432,
        dailyStats,
      });
      setTopProducts(top);
      setAllProducts(all);
      setLoading(false);
    }, 600);
  }, [filterType, selectedMonth, selectedWeek]);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Thống kê tổng quan (Demo)</h2>
      <style>{`
        .stat-card {
          border-radius: 16px;
          box-shadow: 0 2px 12px #0001;
          background: #fff;
          transition: box-shadow 0.2s;
        }
        .stat-card:hover {
          box-shadow: 0 4px 24px #0002;
        }
        .stat-label {
          color: #555;
          font-weight: 500;
          margin-bottom: 6px;
        }
        .stat-value {
          font-size: 2.2rem;
          font-weight: bold;
        }
        .bar-chart {
          display: flex;
          align-items: flex-end;
          height: 220px;
          min-width: 900px;
          padding-bottom: 12px;
        }
        .bar-col {
          width: 22px;
          margin: 0 3px;
          text-align: center;
          cursor: pointer;
        }
        .bar-income {
          background: linear-gradient(180deg, #6ee7b7 0%, #22d3ee 100%);
          border-radius: 4px 4px 0 0;
          transition: background 0.2s;
        }
        .bar-expense {
          background: linear-gradient(180deg, #fca5a5 0%, #f87171 100%);
          border-radius: 4px 4px 0 0;
          margin-top: 2px;
          transition: background 0.2s;
        }
        .bar-col:hover .bar-income {
          background: #14b8a6;
        }
        .bar-col:hover .bar-expense {
          background: #ef4444;
        }
        @media (max-width: 900px) {
          .bar-chart { min-width: 600px; }
        }
        @media (max-width: 600px) {
          .bar-chart { min-width: 350px; }
          .stat-card { padding: 10px 6px; }
        }
      `}</style>
      {loading ? (
        <div className="text-center">Đang tải dữ liệu...</div>
      ) : stats && (
        <>
          {/* Bộ lọc tuần/tháng */}
          <div className="d-flex flex-wrap align-items-center gap-3 mb-4 justify-content-end">
            <label className="fw-bold mb-0">Lọc theo:</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value as 'month' | 'week')} className="form-select w-auto">
              <option value="month">Tháng</option>
              <option value="week">Tuần</option>
            </select>
            {filterType === 'month' && (
              <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="form-select w-auto">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
            )}
            {filterType === 'week' && (
              <select value={selectedWeek} onChange={e => setSelectedWeek(Number(e.target.value))} className="form-select w-auto">
                {Array.from({ length: 5 }, (_, i) => i + 1).map(w => (
                  <option key={w} value={w}>Tuần {w}</option>
                ))}
              </select>
            )}
          </div>
          <div className="row g-4 justify-content-center mb-4">
            <div className="col-md-3 col-6">
              <div className="stat-card text-center p-3">
                <div className="stat-label">Sản phẩm</div>
                <div className="stat-value text-primary">{stats.totalProducts}</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card text-center p-3">
                <div className="stat-label">Đơn hàng</div>
                <div className="stat-value text-success">{stats.totalOrders}</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card text-center p-3">
                <div className="stat-label">Doanh thu</div>
                <div className="stat-value text-danger">{stats.totalRevenue.toLocaleString()} đ</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card text-center p-3">
                <div className="stat-label">Người dùng</div>
                <div className="stat-value text-info">{stats.totalUsers}</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card text-center p-3">
                <div className="stat-label">Số lượng mua trong tháng</div>
                <div className="stat-value text-warning">{stats.totalPurchased}</div>
              </div>
            </div>
          </div>

          {/* Biểu đồ thanh thu/chi */}
          <div className="card p-4 mb-4">
            <h5 className="mb-3">Thống kê thu/chi từng ngày trong tháng</h5>
            <div style={{ overflowX: "auto" }}>
              <div className="bar-chart">
                {stats.dailyStats.map(({ day, income, expense }) => {
                  const max = Math.max(...stats.dailyStats.map(s => Math.max(s.income, s.expense)), 1);
                  return (
                    <div key={day} className="bar-col" title={`Ngày ${day}\nThu: ${income.toLocaleString()}đ\nChi: ${expense.toLocaleString()}đ`}>
                      <div style={{ height: `${(income / max) * 150}px` }} className="bar-income"></div>
                      <div style={{ height: `${(expense / max) * 150}px` }} className="bar-expense"></div>
                      <div style={{ fontSize: 11, marginTop: 2 }}>{day}</div>
                    </div>
                  );
                })}
              </div>
              <div className="d-flex justify-content-between mt-2" style={{ fontSize: 13 }}>
                <span><span style={{ display: "inline-block", width: 14, height: 10, background: "#6ee7b7", borderRadius: 2, marginRight: 4 }}></span>Thu</span>
                <span><span style={{ display: "inline-block", width: 14, height: 10, background: "#fca5a5", borderRadius: 2, marginRight: 4 }}></span>Chi</span>
              </div>
            </div>
          </div>

          {/* Sau biểu đồ thanh thu/chi, thêm bảng top sản phẩm bán chạy */}
          <div className="card p-4 mb-4">
            <h5 className="mb-3">Top sản phẩm bán chạy nhất tháng</h5>
            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng bán</th>
                    <th>Doanh thu (đ)</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={p.name}>
                      <td>{i + 1}</td>
                      <td>{p.name}</td>
                      <td>{p.sold}</td>
                      <td>{p.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Danh sách tất cả sản phẩm (demo) */}
          <div className="card p-4 mb-4">
            <h5 className="mb-3">Tất cả sản phẩm trong tháng</h5>
            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng bán</th>
                    <th>Doanh thu (đ)</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map((p, i) => (
                    <tr key={p.name}>
                      <td>{i + 1}</td>
                      <td>{p.name}</td>
                      <td>{p.sold}</td>
                      <td>{p.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 