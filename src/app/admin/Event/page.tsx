"use client";

import { useEffect, useState } from "react";
import { fetchAdminEvents, createAdminEvent, toMySQLDatetime, changeEventStatus, addProductToEvent, getEventProducts, removeProductFromEvent, updateEventProduct, updateEvent, deleteEvent } from "../lib/event";
import { getProductsPage } from "../lib/product";
import { Event, PaginatedEvents, EventProduct } from "../types/event";
import { Product, PaginatedProducts } from "../types/product";
import "../style/login.css";
import Cookies from "js-cookie";


export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginatedEvents | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
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
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [eventPrice, setEventPrice] = useState("");
  const [quantityLimit, setQuantityLimit] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);

  // State cho quản lý sản phẩm trong sự kiện
  const [eventProducts, setEventProducts] = useState<EventProduct[]>([]);
  const [showEventProducts, setShowEventProducts] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<EventProduct | null>(null);
  const [editForm, setEditForm] = useState({
    event_price: "",
    discount_price: "",
    quantity_limit: "",
    status: "active"
  });

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminEvents(page);
        setEvents(data.data);
        setPagination(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
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
        try {
          const data: PaginatedProducts = await getProductsPage(1);
          console.log("Loaded products:", data.data);
          
          // Lọc ra các sản phẩm có giá hợp lệ
          const validProducts = data.data?.filter((product: Product) => {
            // Sử dụng base_price hoặc display_price thay vì price
            const priceValue = product.base_price || product.display_price || product.price;
            if (!priceValue) return false;
            const cleanPrice = String(priceValue).replace(/[^\d.]/g, '');
            const price = parseFloat(cleanPrice);
            return !isNaN(price) && price > 0;
          }) || [];
          
          console.log("Valid products with price:", validProducts.length);
          setProducts(validProducts);
          
          if (validProducts.length === 0) {
            alert("Không có sản phẩm nào có giá hợp lệ để thêm vào sự kiện!");
          }
        } catch (error) {
          console.error("Failed to load products:", error);
          alert("Không thể tải danh sách sản phẩm!");
        }
      })();
    }
  }, [showAddProductEventId]);

  // Load sản phẩm trong sự kiện
  const loadEventProducts = async (eventId: number) => {
    try {
      const data = await getEventProducts(eventId);
      setEventProducts(data.data || []);
    } catch (error) {
      console.error("Failed to load event products", error);
    }
  };

  const handleAddProductToEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddProductEventId || !selectedProductId || !eventPrice) return;
    setAddingProduct(true);
    try {
      // Lấy original_price từ sản phẩm đã chọn
      const selectedProduct = products.find(p => p.id === Number(selectedProductId));
      
      if (!selectedProduct) {
        alert("Không tìm thấy sản phẩm đã chọn!");
        setAddingProduct(false);
        return;
      }
      
             console.log("Selected product:", selectedProduct);
       
       // Sử dụng base_price hoặc display_price thay vì price
       const priceValue = selectedProduct.base_price || selectedProduct.display_price || selectedProduct.price;
       console.log("Product price value:", priceValue, "Type:", typeof priceValue);
       
       // Xử lý giá gốc sản phẩm
       let original_price = 0;
       if (priceValue) {
         // Loại bỏ các ký tự không phải số và dấu chấm
         const cleanPrice = String(priceValue).replace(/[^\d.]/g, '');
         original_price = parseFloat(cleanPrice);
         
         if (isNaN(original_price) || original_price <= 0) {
           console.error("Invalid price format:", priceValue);
           alert(`Giá gốc sản phẩm không hợp lệ: "${priceValue}". Vui lòng kiểm tra lại dữ liệu sản phẩm!`);
           setAddingProduct(false);
           return;
         }
       } else {
         console.error("Product has no valid price:", selectedProduct);
         alert("Sản phẩm không có giá gốc hợp lệ. Vui lòng kiểm tra lại dữ liệu sản phẩm!");
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
    } catch (error: unknown) {
      alert("Thêm sản phẩm thất bại!");
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: unknown; status?: number; headers?: unknown } };
        console.error('API error addProductToEvent:', apiError.response?.data, apiError.response?.status, apiError.response?.headers);
      } else {
        console.error('API error addProductToEvent:', error);
      }
    } finally {
      setAddingProduct(false);
    }
  };

  // Xóa sản phẩm khỏi sự kiện
  const handleRemoveProduct = async (eventId: number, eventProductId: number) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này khỏi sự kiện?")) return;
    
    try {
      await removeProductFromEvent(eventId, eventProductId);
      alert("Xóa sản phẩm thành công!");
      // Reload danh sách sản phẩm
      await loadEventProducts(eventId);
    } catch (error) {
      alert("Xóa sản phẩm thất bại!");
      console.error(error);
    }
  };

  // Cập nhật sản phẩm trong sự kiện
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await updateEventProduct(editingProduct.event_id, editingProduct.id, {
        event_price: Number(editForm.event_price),
        discount_price: Number(editForm.discount_price),
        quantity_limit: Number(editForm.quantity_limit),
        status: editForm.status
      });
      alert("Cập nhật sản phẩm thành công!");
      setEditingProduct(null);
      setEditForm({
        event_price: "",
        discount_price: "",
        quantity_limit: "",
        status: "active"
      });
      // Reload danh sách sản phẩm
      await loadEventProducts(editingProduct.event_id);
    } catch (error) {
      alert("Cập nhật sản phẩm thất bại!");
      console.error(error);
    }
  };

  // Mở form chỉnh sửa sản phẩm
  const openEditForm = (product: EventProduct) => {
    setEditingProduct(product);
    setEditForm({
      event_price: product.event_price.toString(),
      discount_price: product.discount_price.toString(),
      quantity_limit: product.quantity_limit.toString(),
      status: product.status
    });
  };

  // Mở form chỉnh sửa sự kiện
  const openEditEventForm = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      name: event.name,
      description: event.description || "",
      start_time: event.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : "",
      end_time: event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : "",
      status: event.status,
      banner_image: event.banner_image || "",
      discount_type: event.discount_type || "percentage",
      discount_value: event.discount_value || 0,
      is_featured: event.is_featured || false,
      sort_order: event.sort_order || 0,
    });
    setShowAddForm(true);
  };

  // Xóa sự kiện
  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm("Bạn có chắc muốn xóa sự kiện này?")) return;
    
    try {
      await deleteEvent(eventId);
      alert("Xóa sự kiện thành công!");
      // Reload danh sách sự kiện
      const data = await fetchAdminEvents(page);
      setEvents(data.data);
      setPagination(data);
    } catch (error) {
      alert("Xóa sự kiện thất bại!");
      console.error(error);
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
    } catch (error) {
      alert("Cập nhật trạng thái thất bại!");
      console.error(error);
    }
  };

  // Reset form
  const resetForm = () => {
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
    setEditingEvent(null);
    setShowAddForm(false);
  };

  return (
    <div className="event-admin-container">
      <h1 className="event-admin-title">Quản lý sự kiện</h1>

      <button
        className="event-admin-btn"
        onClick={() => {
          if (showAddForm) {
            resetForm();
          } else {
            setShowAddForm(true);
          }
        }}
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
              if (editingEvent) {
                // Cập nhật sự kiện
                await updateEvent(editingEvent.id, {
                  ...newEvent,
                  start_time: toMySQLDatetime(newEvent.start_time),
                  end_time: toMySQLDatetime(newEvent.end_time),
                });
                alert("Cập nhật sự kiện thành công!");
              } else {
                // Tạo sự kiện mới
                await createAdminEvent({
                  ...newEvent,
                  start_time: toMySQLDatetime(newEvent.start_time),
                  end_time: toMySQLDatetime(newEvent.end_time),
                });
                alert("Tạo sự kiện thành công!");
              }
              resetForm();
              // Reload lại danh sách sự kiện
              const data = await fetchAdminEvents(page);
              setEvents(data.data);
              setPagination(data);
            } catch {
              alert(editingEvent ? "Cập nhật sự kiện thất bại!" : "Thêm sự kiện thất bại!");
            } finally {
              setAdding(false);
            }
          }}
        >
          <h3 style={{ marginBottom: 16, color: '#2563eb' }}>
            {editingEvent ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
          </h3>
          
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
              <option value="paused">Tạm dừng</option>
              <option value="ended">Kết thúc</option>
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
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={adding}
            >
              {adding ? "Đang xử lý..." : (editingEvent ? "Cập nhật" : "Lưu sự kiện")}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={resetForm}
            >
              Hủy
            </button>
          </div>
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
            <th>Thao tác</th>
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
                    <option value="paused">Tạm dừng</option>
                    <option value="ended">Kết thúc</option>
                  </select>
                </td>
                <td>{event.is_featured ? "✅" : "❌"}</td>
                <td>{event.banner_image && <img src={event.banner_image} alt="" style={{ width: 50, height: 50, objectFit: 'cover' }} />}</td>
                <td>{event.discount_type}</td>
                <td>{event.discount_value}</td>
                <td>{event.sort_order}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button 
                        className="event-admin-btn event-admin-btn-edit" 
                        onClick={() => openEditEventForm(event)} 
                        type="button"
                      >
                        Sửa
                      </button>
                      <button 
                        className="event-admin-btn event-admin-btn-delete" 
                        onClick={() => handleDeleteEvent(event.id)} 
                        type="button"
                      >
                        Xóa
                      </button>
                    </div>
                    <button 
                      className="event-admin-btn" 
                      onClick={() => setShowAddProductEventId(event.id)} 
                      type="button"
                    >
                      Thêm sản phẩm
                    </button>
                    <button 
                      className="event-admin-btn event-admin-btn-secondary" 
                      onClick={() => {
                        if (showEventProducts === event.id) {
                          setShowEventProducts(null);
                        } else {
                          setShowEventProducts(event.id);
                          loadEventProducts(event.id);
                        }
                      }} 
                      type="button"
                    >
                      {showEventProducts === event.id ? 'Ẩn sản phẩm' : 'Xem sản phẩm'}
                    </button>
                  </div>

                  {/* Form thêm sản phẩm */}
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

                  {/* Danh sách sản phẩm trong sự kiện */}
                  {showEventProducts === event.id && (
                    <div style={{ marginTop: 12, background: '#f8fafc', borderRadius: 8, padding: 12 }}>
                      <h4 style={{ marginBottom: 12, color: '#2563eb' }}>Sản phẩm trong sự kiện:</h4>
                      {eventProducts.length > 0 ? (
                        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                          {eventProducts.map(product => (
                            <div key={product.id} style={{ 
                              border: '1px solid #e5e7eb', 
                              borderRadius: 6, 
                              padding: 8, 
                              marginBottom: 8,
                              background: 'white'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <strong>{product.product?.name}</strong>
                                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                                    Giá gốc: {product.original_price?.toLocaleString()}đ | 
                                    Giá sự kiện: {product.event_price?.toLocaleString()}đ | 
                                    Giá giảm: {product.discount_price?.toLocaleString()}đ
                                  </div>
                                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                                    SL giới hạn: {product.quantity_limit} | 
                                    Trạng thái: {product.status}
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: 4 }}>
                                  <button 
                                    type="button"
                                    onClick={() => openEditForm(product)}
                                    style={{ 
                                      background: '#2563eb', 
                                      color: 'white', 
                                      border: 'none', 
                                      borderRadius: 4, 
                                      padding: '4px 8px',
                                      fontSize: '0.8em'
                                    }}
                                  >
                                    Sửa
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => handleRemoveProduct(event.id, product.id)}
                                    style={{ 
                                      background: '#dc2626', 
                                      color: 'white', 
                                      border: 'none', 
                                      borderRadius: 4, 
                                      padding: '4px 8px',
                                      fontSize: '0.8em'
                                    }}
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>Chưa có sản phẩm nào trong sự kiện này</p>
                      )}
                    </div>
                  )}

                  {/* Form chỉnh sửa sản phẩm */}
                  {editingProduct && (
                    <div style={{ 
                      position: 'fixed', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      background: 'rgba(0,0,0,0.5)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      zIndex: 1000
                    }}>
                      <div style={{ 
                        background: 'white', 
                        padding: 24, 
                        borderRadius: 8, 
                        width: 400,
                        maxWidth: '90vw'
                      }}>
                        <h3 style={{ marginBottom: 16 }}>Chỉnh sửa sản phẩm: {editingProduct.product?.name}</h3>
                        <form onSubmit={handleUpdateProduct}>
                          <div className="form-row">
                            <label>Giá sự kiện</label>
                            <input 
                              type="number" 
                              value={editForm.event_price} 
                              onChange={e => setEditForm({...editForm, event_price: e.target.value})} 
                              required 
                              min={0} 
                            />
                          </div>
                          <div className="form-row">
                            <label>Giá giảm</label>
                            <input 
                              type="number" 
                              value={editForm.discount_price} 
                              onChange={e => setEditForm({...editForm, discount_price: e.target.value})} 
                              required 
                              min={0} 
                            />
                          </div>
                          <div className="form-row">
                            <label>Số lượng giới hạn</label>
                            <input 
                              type="number" 
                              value={editForm.quantity_limit} 
                              onChange={e => setEditForm({...editForm, quantity_limit: e.target.value})} 
                              required 
                              min={0} 
                            />
                          </div>
                          <div className="form-row">
                            <label>Trạng thái</label>
                            <select 
                              value={editForm.status} 
                              onChange={e => setEditForm({...editForm, status: e.target.value})}
                            >
                              <option value="active">Hoạt động</option>
                              <option value="inactive">Không hoạt động</option>
                              <option value="sold_out">Hết hàng</option>
                            </select>
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                            <button type="submit" className="event-admin-btn">
                              Cập nhật
                            </button>
                            <button 
                              type="button" 
                              className="event-admin-btn event-admin-btn-light"
                              onClick={() => setEditingProduct(null)}
                            >
                              Hủy
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9}>Không có dữ liệu</td>
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
        .event-admin-btn-secondary {
          background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
        }
        .event-admin-btn-secondary:hover {
          background: #d97706;
        }
        .event-admin-btn-edit {
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
          padding: 6px 16px;
          font-size: 0.9rem;
          margin-bottom: 0;
        }
        .event-admin-btn-edit:hover {
          background: #059669;
        }
        .event-admin-btn-delete {
          background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
          padding: 6px 16px;
          font-size: 0.9rem;
          margin-bottom: 0;
        }
        .event-admin-btn-delete:hover {
          background: #dc2626;
        }
        .event-admin-btn-light {
          background: #6b7280;
        }
        .event-admin-btn-light:hover {
          background: #4b5563;
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
