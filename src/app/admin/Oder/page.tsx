"use client";
import { useState, useEffect } from "react";
import { Order } from "../types/oder";
import { fetchOrders, updateOrder } from "../lib/oder";

import 'bootstrap/dist/css/bootstrap.min.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [form, setForm] = useState({ status: "", tracking_number: "", note: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchOrders(currentPage);
        setOrders(data.orders);
        setLastPage(data.pagination.last_page);
      } catch {
        // lỗi được bỏ qua
      }
    })();
  }, [currentPage]);

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setForm({ status: order.status || "", tracking_number: "", note: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setForm({ status: "", tracking_number: "", note: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setLoading(true);
    try {
      await updateOrder(selectedOrder.id, form);
      // reload orders
      const data = await fetchOrders(currentPage);
      setOrders(data.orders);
      closeModal();
    } catch {
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .order-modern-container {
          background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
          min-height: 100vh;
          padding: 40px 0 0 0;
        }
        .order-modern-table {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 16px #0001;
          overflow: hidden;
          margin-bottom: 32px;
        }
        .order-modern-table th, .order-modern-table td {
          padding: 13px 20px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 1.04rem;
        }
        .order-modern-table th {
          background: #f1f5f9;
          font-weight: 600;
          color: #2563eb;
          border-bottom: 2px solid #e0e7ff;
          font-size: 1.08rem;
        }
        .order-modern-table tr:last-child td {
          border-bottom: none;
        }
        .order-modern-btn {
          border: none;
          border-radius: 6px;
          padding: 6px 16px;
          font-size: 0.97rem;
          font-weight: 500;
          margin-right: 6px;
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
        }
        .order-modern-btn.update { background: #fef9c3; color: #b45309; }
        .order-modern-btn.update:hover { background: #fde68a; color: #a16207; }
        .order-modern-btn.primary { background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%); color: #fff; font-weight: 600; }
        .order-modern-btn.primary:hover { background: #2563eb; }
        .order-modern-btn.secondary { background: #e0e7ff; color: #2563eb; }
        .order-modern-btn.secondary:hover { background: #2563eb; color: #fff; }
        .order-modern-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 18px;
          margin: 18px 0 32px 0;
        }
        .order-modern-modal .modal-content {
          border-radius: 14px;
          box-shadow: 0 4px 32px #6366f133;
          border: none;
        }
        .order-modern-modal .modal-header {
          border-bottom: none;
          padding-bottom: 0;
        }
        .order-modern-modal .modal-title {
          color: #2563eb;
          font-weight: 600;
          font-size: 1.18rem;
        }
        .order-modern-modal .btn-close {
          background: #e0e7ff;
          border-radius: 50%;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          color: #2563eb;
          border: none;
          margin-left: 8px;
        }
        .order-modern-modal label {
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }
        .order-modern-modal input, .order-modern-modal select {
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          font-size: 1rem;
          margin-bottom: 10px;
          width: 100%;
          background: #f8fafc;
          transition: border 0.15s;
        }
        .order-modern-modal input:focus, .order-modern-modal select:focus {
          border: 1.5px solid #6366f1;
          outline: none;
          background: #fff;
        }
        @media (max-width: 900px) {
          .order-modern-table th, .order-modern-table td { padding: 8px 8px; font-size: 0.97rem; }
          .order-modern-btn { padding: 7px 12px; font-size: 0.97rem; }
        }
      `}</style>
      <div className="order-modern-container">
        <h2 style={{ fontWeight: 700, color: '#22223b', fontSize: '2.1rem', marginBottom: 24 }}>Orders</h2>
        <div className="order-modern-table">
          <table className="table" style={{ marginBottom: 0 }}>
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Khách hàng</th>
                <th>Địa chỉ</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.name}</td>
                  <td>{order.address}</td>
                  <td>{order.total}</td>
                  <td>{order.status}</td>
                  <td>
                    <button className="order-modern-btn update" onClick={() => openModal(order)}>
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="order-modern-pagination">
          <button
            className="order-modern-btn primary"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trang trước
          </button>
          <span style={{ fontWeight: 500 }}>Trang {currentPage} / {lastPage}</span>
          <button
            className="order-modern-btn primary"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
            disabled={currentPage === lastPage}
          >
            Trang sau
          </button>
        </div>
        {/* Modal cập nhật trạng thái đơn hàng */}
        {showModal && (
          <div className="modal show d-block order-modern-modal" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Cập nhật đơn hàng #{selectedOrder?.order_number}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-2">
                      <label className="form-label">Trạng thái</label>
                      <select
                        className="form-select"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Chọn trạng thái --</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đã gửi hàng</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Mã vận đơn</label>
                      <input
                        className="form-control"
                        name="tracking_number"
                        value={form.tracking_number}
                        onChange={handleChange}
                        placeholder="Nhập mã vận đơn (nếu có)"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Ghi chú</label>
                      <input
                        className="form-control"
                        name="note"
                        value={form.note}
                        onChange={handleChange}
                        placeholder="Nhập ghi chú (nếu có)"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="order-modern-btn secondary" onClick={closeModal} disabled={loading}>
                      Đóng
                    </button>
                    <button type="submit" className="order-modern-btn primary" disabled={loading}>
                      {loading ? "Đang cập nhật..." : "Lưu"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
