"use client";

import { useEffect, useState } from "react";
import { fetchAdminEvents, createAdminEvent, toMySQLDatetime, changeEventStatus, addProductToEvent } from "../lib/event";
import { getProductsPage } from "../lib/product";
import { Event, PaginatedEvents } from "../types/event";
import "../style/login.css";
import Cookies from "js-cookie";


export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginatedEvents | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    start_time: "",
    end_time: "",
    status: "draft",
    banner_image: "",
    discount_type: "percentage",
    discount_value: 0,
    is_featured: false,
    sort_order: 0,
  });
  const [adding, setAdding] = useState(false);

  // State cho thêm sản phẩm vào sự kiện
  const [showAddProductEventId, setShowAddProductEventId] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [eventPrice, setEventPrice] = useState("");
  const [quantityLimit, setQuantityLimit] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminEvents(page);
        setEvents(data.data);
        setPagination(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, [page]);

  // Load sản phẩm khi mở form thêm sản phẩm
  useEffect(() => {
    if (showAddProductEventId) {
      (async () => {
        const data = await getProductsPage(1);
        setProducts(data.data || []);
      })();
    }
  }, [showAddProductEventId]);

  const handleAddProductToEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddProductEventId || !selectedProductId || !eventPrice) return;
    setAddingProduct(true);
    try {
      // Lấy original_price từ sản phẩm đã chọn
      const selectedProduct = products.find(p => p.id === Number(selectedProductId));
      const original_price = selectedProduct ? Number(selectedProduct.price) : 0;
      if (!original_price || isNaN(original_price) || original_price <= 0) {
        alert("Không lấy được giá gốc sản phẩm. Vui lòng kiểm tra lại dữ liệu sản phẩm!");
        setAddingProduct(false);
        return;
      }
      const token = Cookies.get("token") || "";
      await addProductToEvent(
        showAddProductEventId,
        {
          product_id: Number(selectedProductId),
          event_price: Number(eventPrice),
          original_price,
          discount_price: discountPrice ? Number(discountPrice) : Number(eventPrice),
          quantity_limit: Number(quantityLimit) || 0,
          status: "active",
          sort_order: 0
        },
        token
      );
      alert("Thêm sản phẩm vào sự kiện thành công!");
      setShowAddProductEventId(null);
      setSelectedProductId("");
      setEventPrice("");
      setQuantityLimit("");
      // Reload lại danh sách sự kiện
      const data = await fetchAdminEvents(page);
      setEvents(data.data);
      setPagination(data);
    } catch (err: any) {
      alert("Thêm sản phẩm thất bại!");
      if (err.response) {
        console.error('API error addProductToEvent:', err.response.data, err.response.status, err.response.headers);
      } else {
        console.error('API error addProductToEvent:', err);
      }
    } finally {
      setAddingProduct(false);
    }
  };

  // Đổi trạng thái sự kiện
  const handleChangeStatus = async (eventId: number, newStatus: string) => {
    try {
      await changeEventStatus(eventId, newStatus);
      // Reload lại danh sách sự kiện
      const data = await fetchAdminEvents(page);
      setEvents(data.data);
      setPagination(data);
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
      console.error(err);
    }
  };

  return (
    <div className="event-admin-container">
      <h1 className="event-admin-title">Quản lý sự kiện</h1>

      <button
        className="event-admin-btn"
        onClick={() => setShowAddForm((v) => !v)}
      >
        {showAddForm ? "Đóng" : "Thêm sự kiện"}
      </button>

      {showAddForm && (
        <form
          className="event-admin-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setAdding(true);
            try {
              await createAdminEvent({
                ...newEvent,
                start_time: toMySQLDatetime(newEvent.start_time),
                end_time: toMySQLDatetime(newEvent.end_time),
              });
              setShowAddForm(false);
              setNewEvent({
                name: "",
                description: "",
                start_time: "",
                end_time: "",
                status: "draft",
                banner_image: "",
                discount_type: "percentage",
                discount_value: 0,
                is_featured: false,
                sort_order: 0,
              });
              // Reload lại danh sách sự kiện
              const data = await fetchAdminEvents(page);
              setEvents(data.data);
              setPagination(data);
            } catch (err) {
              alert("Thêm sự kiện thất bại!");
            } finally {
              setAdding(false);
            }
          }}
        >
          <div>
            <label>Tên sự kiện</label>
            <input
              className="border rounded px-2 py-1 w-full mb-2"
              value={newEvent.name}
              onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Mô tả</label>
            <textarea
              className="border rounded px-2 py-1 w-full mb-2"
              value={newEvent.description}
              onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </div>
          <div>
            <label>Thời gian bắt đầu</label>
            <input
              type="datetime-local"
              className="border rounded px-2 py-1 w-full mb-2"
              value={newEvent.start_time}
              onChange={e => setNewEvent({ ...newEvent, start_time: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Thời gian kết thúc</label>
            <input
              type="datetime-local"
              className="border rounded px-2 py-1 w-full mb-2"
              value={newEvent.end_time}
              onChange={e => setNewEvent({ ...newEvent, end_time: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Trạng thái</label>
            <select
              className="border rounded px-2 py-1 w-full mb-2"
              value={newEvent.status}
              onChange={e => setNewEvent({ ...newEvent, status: e.target.value })}
            >
              <option value="draft">Nháp</option>
              <option value="active">Kích hoạt</option>
            </select>
          </div>
          <div>
            <label>Ảnh banner (URL)</label>
            <input
              className="border rounded px-2 py-1 w-full mb-2"
              value={newEvent.banner_image}
              onChange={e => setNewEvent({ ...newEvent, banner_image: e.target.value })}
            />
          </div>
          <div>
            <label>Loại giảm giá</label>
            <select
              className="border rounded px-2 py-1 w-full mb-2"
              value={newEvent.discount_type}
              onChange={e => setNewEvent({ ...newEvent, discount_type: e.target.value })}
            >
              <option value="percentage">Phần trăm</option>
              <option value="fixed">Cố định</option>
            </select>
          </div>
          <div>
            <label>Giá trị giảm giá</label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-full mb-2"
              value={newEvent.discount_value}
              onChange={e => setNewEvent({ ...newEvent, discount_value: Number(e.target.value) })}
              min={0}
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={newEvent.is_featured}
                onChange={e => setNewEvent({ ...newEvent, is_featured: e.target.checked })}
              />
              &nbsp;Nổi bật
            </label>
          </div>
          <div>
            <label>Thứ tự hiển thị</label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-full mb-2"
              value={newEvent.sort_order}
              onChange={e => setNewEvent({ ...newEvent, sort_order: Number(e.target.value) })}
              min={0}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={adding}
          >
            {adding ? "Đang thêm..." : "Lưu sự kiện"}
          </button>
        </form>
      )}

      {loading && <p>Đang tải dữ liệu...</p>}

      <table className="event-admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Trạng thái</th>
            <th>Nổi bật</th>
            <th>Banner</th>
            <th>Loại giảm giá</th>
            <th>Giá trị giảm giá</th>
            <th>Thứ tự</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map(event => (
              <tr key={event.id}>
                <td>{event.id}</td>
                <td>{event.name}</td>
                <td>
                  <select
                    value={event.status}
                    onChange={e => handleChangeStatus(event.id, e.target.value)}
                    style={{ minWidth: 100 }}
                  >
                    <option value="draft">Nháp</option>
                    <option value="active">Kích hoạt</option>
                  </select>
                </td>
                <td>{event.is_featured ? "✅" : "❌"}</td>
                <td><img src={event.banner_image} alt=""  /></td>
                <td>{event.discount_type}</td>
                <td>{event.discount_value}</td>
                <td>{event.sort_order}</td>
                <td>
                  <button className="event-admin-btn" onClick={() => setShowAddProductEventId(event.id)} type="button">
                    Thêm sản phẩm
                  </button>
                  {showAddProductEventId === event.id && (
                    <form onSubmit={handleAddProductToEvent} style={{ marginTop: 12, background: '#f8fafc', borderRadius: 8, padding: 12 }}>
                      <div className="form-row">
                        <label>Chọn sản phẩm</label>
                        <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} required>
                          <option value="">-- Chọn sản phẩm --</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-row">
                        <label>Giá sự kiện</label>
                        <input type="number" value={eventPrice} onChange={e => setEventPrice(e.target.value)} required min={0} />
                      </div>
                      <div className="form-row">
                        <label>Giá giảm (discount_price)</label>
                        <input type="number" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} min={0} placeholder="Mặc định bằng giá sự kiện nếu bỏ trống" />
                      </div>
                      <div className="form-row">
                        <label>Số lượng giới hạn</label>
                        <input type="number" value={quantityLimit} onChange={e => setQuantityLimit(e.target.value)} min={0} />
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button type="submit" className="event-admin-btn" disabled={addingProduct}>
                          {addingProduct ? 'Đang thêm...' : 'Lưu'}
                        </button>
                        <button type="button" className="event-admin-btn event-admin-btn-light" onClick={() => setShowAddProductEventId(null)}>
                          Hủy
                        </button>
                      </div>
                    </form>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="event-admin-pagination">
        <button
          disabled={!pagination?.links.prev}
          onClick={() => setPage(page - 1)}
          className={pagination?.links.prev ? "" : "active"}
        >
          Previous
        </button>
        <span>
          Trang {pagination?.meta.current_page} / {pagination?.meta.last_page}
        </span>
        <button
          disabled={!pagination?.links.next}
          onClick={() => setPage(page + 1)}
          className={pagination?.links.next ? "" : "active"}
        >
          Next
        </button>
      </div>
      <style>{`
        .event-admin-container {
          max-width: 1255px;
          margin: 0 auto;
          padding: 32px 12px 32px 12px;
          background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
          min-height: 100vh;
        }
        .event-admin-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
        }
        .event-admin-btn {
          background: linear-gradient(90deg, #22d3ee 0%, #2563eb 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 22px;
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 18px;
          box-shadow: 0 2px 8px #2563eb22;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s;
        }
        .event-admin-btn:hover {
          background: #2563eb;
          color: #fff;
          box-shadow: 0 4px 16px #2563eb33;
        }
        .event-admin-form {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 16px #2563eb11;
          padding: 24px 18px;
          margin-bottom: 32px;
        }
        .event-admin-form label {
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 4px;
          display: block;
        }
        .event-admin-form input,
        .event-admin-form textarea,
        .event-admin-form select {
          border-radius: 7px;
          border: 1.5px solid #e5e7eb;
          padding: 9px 16px;
          font-size: 1.04rem;
          margin-bottom: 14px;
          width: 100%;
          background: #f8fafc;
          transition: border 0.15s, background 0.15s;
        }
        .event-admin-form input:focus,
        .event-admin-form textarea:focus,
        .event-admin-form select:focus {
          border: 1.5px solid #2563eb;
          outline: none;
          background: #fff;
        }
        .event-admin-table {
          width: 100%;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 16px #2563eb11;
          margin-bottom: 24px;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 1.04rem;
        }
        .event-admin-table th, .event-admin-table td {
          padding: 13px 20px;
          border-bottom: 1px solid #f1f5f9;
        }
        .event-admin-table th {
          background: #f1f5f9;
          font-weight: 600;
          color: #2563eb;
          border-bottom: 2px solid #e0e7ff;
        }
        .event-admin-table tr:last-child td {
          border-bottom: none;
        }
        .event-admin-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 18px;
        }
        .event-admin-pagination button {
          background: #f1f5f9;
          color: #2563eb;
          border: none;
          border-radius: 6px;
          padding: 7px 16px;
          font-size: 1.05rem;
          font-weight: 500;
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
        }
        .event-admin-pagination button.active,
        .event-admin-pagination button:disabled {
          background: #2563eb;
          color: #fff;
          cursor: default;
        }
        .form-row {
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
        }
        .form-row label {
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 4px;
        }
        .form-row input,
        .form-row select {
          border-radius: 7px;
          border: 1.5px solid #e5e7eb;
          padding: 9px 12px;
          font-size: 1.04rem;
          background: #fff;
          transition: border 0.15s;
        }
        .form-row input:focus,
        .form-row select:focus {
          border: 1.5px solid #2563eb;
          outline: none;
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
}
