"use client";

import { useEffect, useState } from "react";
import { fetchAdminEvents, createAdminEvent, toMySQLDatetime, changeEventStatus, addProductToEvent, getEventProducts, removeProductFromEvent, updateEventProduct, updateEvent, deleteEvent } from "../lib/event";
import { getProductsPage } from "../lib/product";
import { Event, PaginatedEvents, EventProduct } from "../types/event";
import { Product, PaginatedProducts } from "../types/product";
import Cookies from "js-cookie";


export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
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
    <>
      <section className="home">
        <header className="home-header">
          <div className="text">Xin chào Admin</div>
          <div className="search">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết"
              style={{ padding: "5px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>
        <main className="home-main">
          <div className="home__container two">
            <div className="home__container--title"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center", // marginBottom: "20px"
              }}
            >
              <a href="#">Sự kiện</a>
              <div
                className="row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >

                <button type="button" className="col"
                  onClick={() => {
                    if (showAddForm) {
                      resetForm();
                    } else {
                      setShowAddForm(true);
                    }
                  }}
                  style={{
                    padding: "8px 8px",
                    cursor: "pointer",
                    margin: "10px 10px 0 0",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  {showAddForm ? "Đóng form" : "+ Thêm sản phẩm"}
                </button>
              </div>
            </div>


            {/* cữ */}

            <div className="home__container--content">
              <table >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Nổi bật</th>
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
                        <td>{event.is_featured ? "O" : "X"}</td>
                        <td>{event.discount_type}</td>
                        <td>{event.discount_value}</td>
                        <td>{event.sort_order}</td>
                        <td className="action-buttons">
                          <button onClick={() => setShowAddProductEventId(event.id)} className="green" style={{ marginRight: "8px" }}>Thêm sản phẩm</button>
                          <button
                            onClick={() => {
                              if (showEventProducts === event.id) {
                                setShowEventProducts(null);
                              } else {
                                setShowEventProducts(event.id);
                                loadEventProducts(event.id);
                              }
                            }}
                            className="view"
                          >
                            View
                          </button>
                          <button onClick={() => openEditEventForm(event)} className="edit">Edit</button>
                          <button onClick={() => handleDeleteEvent(event.id)} className="delete">Delete</button>

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
              {/* Form thêm sản phẩm */}
              {showAddProductEventId && (
                <div className="modal">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h2>Thêm sản phẩm vào sự kiện</h2>
                      <button className="close-btn" onClick={() => setShowAddProductEventId(null)}>&times;</button>
                    </div>
                    <form onSubmit={handleAddProductToEvent}>
                      <div className="form-group">
                        <label>Chọn sản phẩm <span style={{ color: "red" }}>*</span></label>
                        <select
                          value={selectedProductId}
                          onChange={e => setSelectedProductId(e.target.value)}
                          required
                        >
                          <option value="">-- Chọn sản phẩm --</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Giá sự kiện <span style={{ color: "red" }}>*</span></label>
                        <input
                          type="number"
                          value={eventPrice}
                          onChange={e => setEventPrice(e.target.value)}
                          required
                          min={0}
                        />
                      </div>

                      <div className="form-group">
                        <label>Giá giảm (discount_price)</label>
                        <input
                          type="number"
                          value={discountPrice}
                          onChange={e => setDiscountPrice(e.target.value)}
                          min={0}
                          placeholder="Mặc định bằng giá sự kiện nếu bỏ trống"
                        />
                      </div>

                      <div className="form-group">
                        <label>Số lượng giới hạn</label>
                        <input
                          type="number"
                          value={quantityLimit}
                          onChange={e => setQuantityLimit(e.target.value)}
                          min={0}
                        />
                      </div>

                      <div className="action-buttons" style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                        <button type="button" className="delete" onClick={() => setShowAddProductEventId(null)} disabled={addingProduct}>Hủy</button>
                        <button type="submit" className="green" disabled={addingProduct}>
                          {addingProduct ? "Đang thêm..." : "Lưu"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}


              {showAddForm && (
                <div className="modal">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h2>{editingEvent ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}</h2>
                      <button
                        className="close-btn"
                        onClick={() => {
                          resetForm();
                        }}
                      >
                        &times;
                      </button>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setAdding(true);
                        try {
                          if (editingEvent) {
                            await updateEvent(editingEvent.id, {
                              ...newEvent,
                              start_time: toMySQLDatetime(newEvent.start_time),
                              end_time: toMySQLDatetime(newEvent.end_time),
                            });
                            alert("Cập nhật sự kiện thành công!");
                          } else {
                            await createAdminEvent({
                              ...newEvent,
                              start_time: toMySQLDatetime(newEvent.start_time),
                              end_time: toMySQLDatetime(newEvent.end_time),
                            });
                            alert("Tạo sự kiện thành công!");
                          }
                          resetForm();
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
                      <div className="form-group">
                        <label>Tên sự kiện</label>
                        <input
                          className="border rounded px-2 py-1 w-full mb-2"
                          value={newEvent.name}
                          onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Mô tả</label>
                        <textarea
                          className="border rounded px-2 py-1 w-full mb-2"
                          value={newEvent.description}
                          onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                        />
                      </div>

                      <div className="form-row" style={{ display: "flex", gap: "12px" }}>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>Thời gian bắt đầu</label>
                          <input
                            type="datetime-local"
                            value={newEvent.start_time}
                            onChange={e => setNewEvent({ ...newEvent, start_time: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>Thời gian kết thúc</label>
                          <input
                            type="datetime-local"
                            value={newEvent.end_time}
                            onChange={e => setNewEvent({ ...newEvent, end_time: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Trạng thái</label>
                        <select
                          value={newEvent.status}
                          onChange={e => setNewEvent({ ...newEvent, status: e.target.value })}
                        >
                          <option value="draft">Nháp</option>
                          <option value="active">Kích hoạt</option>
                          <option value="paused">Tạm dừng</option>
                          <option value="ended">Kết thúc</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Loại giảm giá</label>
                        <select
                          value={newEvent.discount_type}
                          onChange={e => setNewEvent({ ...newEvent, discount_type: e.target.value })}
                        >
                          <option value="percentage">Phần trăm</option>
                          <option value="fixed">Cố định</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Giá trị giảm giá</label>
                        <input
                          type="number"
                          value={newEvent.discount_value}
                          onChange={e => setNewEvent({ ...newEvent, discount_value: Number(e.target.value) })}
                          min={0}
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={newEvent.is_featured}
                            onChange={e => setNewEvent({ ...newEvent, is_featured: e.target.checked })}
                          />
                          &nbsp;Nổi bật
                        </label>
                      </div>

                      <div className="form-group">
                        <label>Thứ tự hiển thị</label>
                        <input
                          type="number"
                          value={newEvent.sort_order}
                          onChange={e => setNewEvent({ ...newEvent, sort_order: Number(e.target.value) })}
                          min={0}
                        />
                      </div>

                      <div className="action-buttons" style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                        <button
                          type="button"
                          className="delete"
                          onClick={resetForm}
                          disabled={adding}
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="green"
                          disabled={adding}
                        >
                          {adding ? "Đang xử lý..." : (editingEvent ? "Cập nhật" : "Lưu sự kiện")}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}




              {showEventProducts !== null && (
                <div className="modal">
                  <div className="modal-content" style={{ maxWidth: '900px' }}>
                    {/* Header */}
                    <div className="modal-header">
                      <h2>Sản phẩm trong sự kiện #{showEventProducts}</h2>
                      <button className="close-btn" onClick={() => setShowEventProducts(null)}>
                        &times;
                      </button>
                    </div>

                    {/* Body */}
                    <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '12px' }}>
                      {eventProducts.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                          {eventProducts.map(product => (
                            <div
                              key={product.id}
                              style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: 8,
                                padding: '12px',
                                background: '#fff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                  <strong style={{ fontSize: '1rem', color: '#111' }}>
                                    {product.product?.name}
                                  </strong>
                                  <div style={{ fontSize: '0.9em', color: '#444', marginTop: 6 }}>
                                    <p>Giá gốc: <strong>{product.original_price?.toLocaleString()}đ</strong></p>
                                    <p>Giá sự kiện: <strong>{product.event_price?.toLocaleString()}đ</strong></p>
                                    <p>Giá giảm: <strong>{product.discount_price?.toLocaleString()}đ</strong></p>
                                    <p>SL giới hạn: {product.quantity_limit} | Trạng thái: {product.status}</p>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <button
                                    onClick={() => openEditForm(product)}
                                    style={{ background: '#2563eb', color: '#fff', padding: '6px 12px', borderRadius: 4 }}
                                  >
                                    Sửa
                                  </button>
                                  <button
                                    onClick={() => handleRemoveProduct(showEventProducts, product.id)}
                                    style={{ background: '#dc2626', color: '#fff', padding: '6px 12px', borderRadius: 4 }}
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                          <p style={{ color: '#666', textAlign: 'center' }}>
                            Chưa có sản phẩm nào trong sự kiện này
                          </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                      <button type="button" className="delete" onClick={() => setShowEventProducts(null)}>
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              )}



              {/* Form chỉnh sửa sản phẩm */}
              {editingProduct && (
                <div className="modal">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h2>Chỉnh sửa sản phẩm: {editingProduct.product?.name}</h2>
                      <button
                        className="close-btn"
                        onClick={() => setEditingProduct(null)}
                      >
                        &times;
                      </button>
                    </div>
                    <form onSubmit={handleUpdateProduct}>
                      <div className="form-group">
                        <label>Giá sự kiện <span style={{ color: "red" }}>*</span></label>
                        <input
                          type="number"
                          value={editForm.event_price}
                          onChange={e => setEditForm({ ...editForm, event_price: e.target.value })}
                          required
                          min={0}
                        />
                      </div>
                      <div className="form-group">
                        <label>Giá giảm <span style={{ color: "red" }}>*</span></label>
                        <input
                          type="number"
                          value={editForm.discount_price}
                          onChange={e => setEditForm({ ...editForm, discount_price: e.target.value })}
                          required
                          min={0}
                        />
                      </div>
                      <div className="form-group">
                        <label>Số lượng giới hạn <span style={{ color: "red" }}>*</span></label>
                        <input
                          type="number"
                          value={editForm.quantity_limit}
                          onChange={e => setEditForm({ ...editForm, quantity_limit: e.target.value })}
                          required
                          min={0}
                        />
                      </div>
                      <div className="form-group">
                        <label>Trạng thái</label>
                        <select
                          value={editForm.status}
                          onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                        >
                          <option value="active">Hoạt động</option>
                          <option value="inactive">Không hoạt động</option>
                          <option value="sold_out">Hết hàng</option>
                        </select>
                      </div>

                      <div
                        className="action-buttons"
                        style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}
                      >
                        <button
                          type="button"
                          className="delete"
                          onClick={() => setEditingProduct(null)}
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="green"
                        >
                          Cập nhật
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}


              <div style={{ marginTop: "10px", textAlign: "center" }}>
                <button
                  disabled={!pagination?.links.prev}
                  onClick={() => setPage(page - 1)}
                  className={pagination?.links.prev ? "" : "active"}
                >
                  Trang trước
                </button>
                <span>
                  Trang {pagination?.meta.current_page} / {pagination?.meta.last_page}
                </span>
                <button
                  disabled={!pagination?.links.next}
                  onClick={() => setPage(page + 1)}
                  className={pagination?.links.next ? "" : "active"}
                >
                  Trang sau
                </button>
              </div>
            </div>


          </div>
        </main>
      </section>
    </>
  );

}
