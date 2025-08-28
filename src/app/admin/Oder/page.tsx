'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetchOrders, updateOrderStatus, fetchOrderById } from '../lib/oder'; // ✅ thêm fetchOrderById
import "../style/moder.css"
 

// Types for orders used in this view
type OrderItem = {
  product_image: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
};

type CouponInfo = { code: string } | null;

type AdminOrder = {
  id: number;
  order_number: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  payment_status: string;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  discount: number;
  total: number;
  created_at: string;
  notes?: string;
  coupon?: CouponInfo;
  items?: OrderItem[];
  tracking_number?: string;
  note?: string;
};

const OrderManagement = () => {
  const [page] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus] = useState('');
  const [perPage] = useState(10);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    id: 0,
    status: '',
    tracking_number: '',
    note: ''
  });
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(false);

  const query = `page=${page}&per_page=${perPage}&search=${search}&status=${status}&payment_status=${paymentStatus}`;
  const { data, error, mutate } = useSWR([query], fetchOrders);

  useEffect(() => {
    if (error) {
      alert('Có lỗi xảy ra khi tải đơn hàng');
    }
  }, [error]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateOrderStatus(updateForm.id, {
        status: updateForm.status,
        tracking_number: updateForm.tracking_number,
        note: updateForm.note,
      });

      alert('Cập nhật thành công');
      mutate();

      setUpdateForm({ id: 0, status: '', tracking_number: '', note: '' });
      setShowUpdateModal(false);
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật đơn hàng');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (order: AdminOrder) => {
    setUpdateForm({
      id: order.id,
      status: order.status,
      tracking_number: order.tracking_number || '',
      note: order.note || '',
    });
    setShowUpdateModal(true);
  };

  // ✅ Sửa lại: lấy chi tiết đơn hàng khi mở modal
  const openViewModal = async (order: AdminOrder) => {
    try {
      setLoading(true);
      const detail = await fetchOrderById(order.id); // gọi API chi tiết
      setSelectedOrder(detail as AdminOrder);
      setShowViewModal(true);
    } catch (err) {
      console.error("Lỗi load chi tiết đơn:", err);
      alert("Không tải được chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };
  

  const getStatusText = (status: string) => {
    const statusTextMap: { [key: string]: string } = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      processing: 'Đang xử lý',
      shipped: 'Đã giao',
      delivered: 'Đã nhận',
      cancelled: 'Đã hủy'
    };
    return statusTextMap[status] || status;
  };

  const getPaymentText = (paymentStatus: string) => {
    const paymentTextMap: { [key: string]: string } = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thất bại'
    };
    return paymentTextMap[paymentStatus] || paymentStatus;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount).replace('₫', '₫');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <section className="home">
      <header className="home-header">
        <div className="text">Xin chào Admin</div>
        <div className="search">
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng, công việc"
            style={{ padding: "5px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main className="home-main">
        <div className="home__container two" style={{ width: "100%", marginTop: "20px" }}>
          <div className="home__container--title" style={{ display: "flex", justifyContent: "space-between" }}>
            <a href="#">Quản Lý Đơn Hàng</a>
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="processing">Chưa hoàn thành</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Hủy</option>
            </select>
          </div>

          <div className="home__container--content">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Người Đặt</th>
                  <th>Trạng Thái</th>
                  <th>Thanh Toán</th>
                  <th>Tổng tiền</th>
                  <th>Ngày tạo</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {(data?.orders as AdminOrder[] | undefined)?.map((order) => {
                  console.log(order);
                  return (
                    <tr key={order.id}>
                      <td>{order.order_number}</td>
                      <td>{order.name}</td>
                      <td>{getStatusText(order.status)}</td>
                      <td>{getPaymentText(order.payment_status)}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>{formatDate(order.created_at)}</td>
                      <td className="action-buttons">
                        <button className="view" style={{ marginRight: "10px" }} onClick={() => openViewModal(order)}>Xem Chi tiết</button>
                        <button className="green" onClick={() => openUpdateModal(order)}>Cập nhật</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          </div>
        </div>
      </main>

      {/* ✅ Modal xem chi tiết */}
      {showViewModal && selectedOrder && (
  <div className="customModalOverlay"> {/* ✅ đổi từ inline modal wrapper sang class */}
    <div className="customModal">
      
      {/* Header */}
      <div className="modalHeader">
        <h2>Đơn hàng #{selectedOrder.order_number}</h2>
        <button className="closeBtn" onClick={() => setShowViewModal(false)}>
          &times;
        </button>
      </div>

      {/* Body */}
      <div className="modalBody">
        <div className="contentWrapper">

          {/* Left section */}
          <div className="leftSection">
            <div className="orderInfo">
              <div className="orderDate">
                <span><strong>Ngày đặt:</strong> {formatDate(selectedOrder.created_at)}</span>
              </div>
              <div className="orderStatusWrapper">
                <span className={`orderStatus ${selectedOrder.status}`}>
                  {getStatusText(selectedOrder.status)}
                </span>
              </div>

            </div>

            {/* Thông tin khách hàng */}
            <div className="infoSection">
              <h4 className="sectionTitle">Thông tin khách hàng</h4>
              <div className="infoCard">
                <div className="infoRow"><span className="infoLabel">Tên:</span> {selectedOrder.name}</div>
                <div className="infoRow"><span className="infoLabel">Email:</span> {selectedOrder.email}</div>
                <div className="infoRow"><span className="infoLabel">Số điện thoại:</span> {selectedOrder.phone}</div>
                <div className="infoRow"><span className="infoLabel">Địa chỉ:</span> {selectedOrder.address}</div>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="infoSection">
              <h4 className="sectionTitle">Ghi chú khách hàng</h4>
              <div className="infoCard">
                {selectedOrder.notes || "Không có"}
              </div>
            </div>

            {/* Sản phẩm */}
            <div className="productsSection">
              <h4 className="sectionTitle">Sản phẩm</h4>
              <div className="orderItems">
                {selectedOrder.items?.map((item: OrderItem, idx: number) => 
               (console.log(item),
                  <div className="orderItem" key={idx}> 
                    <img src={item.product_image} alt={item.product_name} />
                    <div>
                     
                      
                      <strong>{item.product_name}</strong>
                      <p>Số lượng: {item.quantity} x {formatCurrency(item.price)}</p>
                    </div>
                    <div>{formatCurrency(item.total)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="rightSection">
            <h4 className="paymentTitle">Tổng kết đơn hàng</h4>

            <div className="paymentRow">
              <span className="paymentLabel">Tạm tính</span>
              <span className="paymentValue">{formatCurrency(selectedOrder.subtotal)}</span>
            </div>

            <div className="paymentRow">
              <span className="paymentLabel">Phí vận chuyển</span>
              <span className="paymentValue">{formatCurrency(selectedOrder.shipping_fee)}</span>
            </div>

            <div className="paymentRow">
              <span className="paymentLabel">Thuế</span>
              <span className="paymentValue">{formatCurrency(selectedOrder.tax)}</span>
            </div>

            {selectedOrder.discount > 0 && (
              <div className="paymentRow">
                <span className="paymentLabel">
                  Giảm giá {selectedOrder.coupon && `(Mã: ${selectedOrder.coupon.code})`}
                </span>
                <span className="paymentValue">-{formatCurrency(selectedOrder.discount)}</span>
              </div>
            )}

            <div className="paymentRow">
              <span className="paymentLabel">Tổng tiền</span>
              <span className="totalAmount">{formatCurrency(selectedOrder.total)}</span>
            </div>

            <button className="btn btnBlock" onClick={() => setShowViewModal(false)}>
             <span className='close'> Đóng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* ✅ Modal cập nhật trạng thái đơn hàng */}
      {showUpdateModal && (
        <div className="customModalOverlay">
          <div className="customModal">
            <div className="modalHeader">
              <h2>Cập nhật đơn hàng #{updateForm.id}</h2>
              <button className="closeBtn" onClick={() => setShowUpdateModal(false)}>
                &times;
              </button>
            </div>
            <div className="modalBody">
              <div className="contentWrapper">
                <div className="leftSection" style={{ width: "100%" }}>
                  <div className="infoSection">
                    <h4 className="sectionTitle">Chỉnh sửa trạng thái</h4>
                    <div className="infoCard" style={{ display: 'grid', gap: 12 }}>
                      <label>
                        Trạng thái
                        <select
                          className="select"
                          value={updateForm.status}
                          onChange={(e) => setUpdateForm((f) => ({ ...f, status: e.target.value }))}
                        >
                          <option value="">-- Chọn trạng thái --</option>
                          <option value="pending">Chờ xác nhận</option>
                          <option value="confirmed">Đã xác nhận</option>
                          <option value="processing">Đang xử lý</option>
                          <option value="shipped">Đã giao</option>
                          <option value="delivered">Đã nhận</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </label>
                      <label>
                        Mã vận đơn (nếu có)
                        <input
                          className="input"
                          type="text"
                          value={updateForm.tracking_number}
                          onChange={(e) => setUpdateForm((f) => ({ ...f, tracking_number: e.target.value }))}
                          placeholder="VD: VN123456789"
                        />
                      </label>
                      <label>
                        Ghi chú
                        <textarea
                          className="input"
                          value={updateForm.note}
                          onChange={(e) => setUpdateForm((f) => ({ ...f, note: e.target.value }))}
                          placeholder="Ghi chú bổ sung cho đơn hàng"
                          rows={3}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="actions">
                <button className="btn btnBlock cancel" onClick={() => setShowUpdateModal(false)} disabled={loading}>
                  Hủy
                </button>
                <button className="btn" onClick={handleUpdate} disabled={loading || !updateForm.status}>
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </section>
  );
};

export default OrderManagement;
