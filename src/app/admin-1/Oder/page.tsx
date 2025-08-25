'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetchOrders, updateOrderStatus } from '../lib/oder';
import Image from 'next/image';

const OrderManagement = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [perPage] = useState(10); // Giới hạn 10 đơn hàng mỗi trang
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    id: 0,
    status: '',
    tracking_number: '',
    note: ''
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
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

      // Reset form
      setUpdateForm({ id: 0, status: '', tracking_number: '', note: '' });
      setShowUpdateModal(false);
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật đơn hàng');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (order: any) => {
    setUpdateForm({
      id: order.id,
      status: order.status,
      tracking_number: order.tracking_number || '',
      note: order.note || '',
    });
    setShowUpdateModal(true);
  };

  const openViewModal = (order: any) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return statusMap[status] || 'status-default';
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const paymentMap: { [key: string]: string } = {
      pending: 'payment-pending',
      paid: 'payment-paid',
      failed: 'payment-failed'
    };
    return paymentMap[paymentStatus] || 'payment-default';
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

  const authors = [
    {
      name: 'John Michael',
      email: 'john@creative-tim.com',
      role: 'Giám đốc',
organization: 'Tổ chức',
      status: 'Trực tuyến',
      date: '23/04/18',
      imgSrc: '/assets/img/team-2.jpg',
    },
    {
      name: 'Alexa Liras',
      email: 'alexa@creative-tim.com',
      role: 'Lập trình viên',
      organization: 'Nhà phát triển',
      status: 'Ngoại tuyến',
      date: '11/01/19',
      imgSrc: '/assets/img/team-3.jpg',
    },
    {
      name: 'Laurent Perrier',
      email: 'laurent@creative-tim.com',
      role: 'Điều hành',
      organization: 'Dự án',
      status: 'Trực tuyến',
      date: '19/09/17',
      imgSrc: '/assets/img/team-4.jpg',
    },
    {
      name: 'Michael Levi',
      email: 'michael@creative-tim.com',
      role: 'Lập trình viên',
      organization: 'Nhà phát triển',
      status: 'Trực tuyến',
      date: '24/12/08',
      imgSrc: '/assets/img/team-3.jpg',
    },
    {
      name: 'Richard Gran',
      email: 'richard@creative-tim.com',
      role: 'Giám đốc',
      organization: 'Điều hành',
      status: 'Ngoại tuyến',
      date: '04/10/21',
      imgSrc: '/assets/img/team-2.jpg',
    },
    {
      name: 'Miriam Eric',
      email: 'miriam@creative-tim.com',
      role: 'Lập trình viên',
      organization: 'Nhà phát triển',
      status: 'Ngoại tuyến',
      date: '14/09/20',
      imgSrc: '/assets/img/team-4.jpg',
    },
  ];
  return (
    <>
      <style>{`
        .order-modern-container {
          background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
          min-height: 100vh;
          padding: 20px;
          margin-left: 0;
          transition: margin-left 0.2s;
        }
        
        @media (min-width: 901px) {
          .order-modern-container {
            margin-left: 0px;
          }
        }
        
        .order-modern-header {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 24px;
          letter-spacing: -0.025em;
        }
        
        .order-modern-card {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          margin-bottom: 24px;
        }
        
        .order-modern-card-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .order-modern-card-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }
        
        .order-modern-card-body {
          padding: 24px;
        }
        
        .order-modern-controls {
          display: flex;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        
        .order-modern-control-group {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }
        
        .order-modern-label {
          color: #374151 !important;
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .order-modern-input,
        .order-modern-select {
          border-radius: 8px;
          border: 1px solid #d1d5db;
          padding: 10px 14px;
          font-size: 0.9rem;
          background: #fff;
          color: #374151;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }
        
        .order-modern-input:focus,
        .order-modern-select:focus {
          border-color: #3b82f6;
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .order-modern-table {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        
        .order-modern-table th {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: #1e293b;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 16px 12px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .order-modern-table td {
          padding: 16px 12px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
          font-size: 0.9rem;
        }
        
        .order-modern-table tr:hover {
          background-color: #f8fafc;
        }
        
        .order-modern-table tr:last-child td {
          border-bottom: none;
        }
        
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }
        
        .status-confirmed {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .status-processing {
          background: #e0e7ff;
          color: #3730a3;
        }
        
        .status-shipped {
          background: #dcfce7;
          color: #166534;
        }
        
        .status-delivered {
          background: #dcfce7;
          color: #166534;
        }
        
        .status-cancelled {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .payment-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .payment-pending {
          background: #fef3c7;
          color: #92400e;
        }
        
        .payment-paid {
          background: #dcfce7;
          color: #166534;
        }
        
        .payment-failed {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .order-amount {
          font-weight: 600;
          color: #059669;
          font-size: 0.95rem;
        }
        
        .order-number {
          font-weight: 600;
          color: #1e293b;
        }
        
        .action-button {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
          margin-right: 6px;
        }
        
        .action-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .action-button.info {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
        }
        
        .action-button.info:hover {
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        }
        
        .pagination-modern {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
        }
        
        .pagination-button {
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          min-width: 40px;
          text-align: center;
        }
        
        .pagination-button:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #3b82f6;
        }
        
        .pagination-button.active {
          background: #3b82f6;
          color: #fff;
          border-color: #3b82f6;
        }
        
        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination-info {
          text-align: center;
          color: #6b7280;
          font-size: 0.9rem;
          margin-top: 12px;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #6b7280;
          font-size: 1.1rem;
        }
        
        @media (max-width: 1200px) {
          .order-modern-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }
          
          .order-modern-control-group {
            min-width: 0;
            flex: none;
          }
        }
        
        @media (max-width: 768px) {
          .order-modern-container {
            padding: 15px;
            margin-left: 0;
          }
          
          .order-modern-header {
            font-size: 1.5rem;
          }
          
          .order-modern-card-body {
            padding: 16px;
          }
          
          .order-modern-table th,
          .order-modern-table td {
            padding: 12px 8px;
            font-size: 0.85rem;
          }
          
          .status-badge,
          .payment-badge {
            padding: 4px 8px;
            font-size: 0.75rem;
          }
          
          .action-button {
            padding: 6px 10px;
            font-size: 0.8rem;
            margin-right: 4px;
          }
        }
        
        @media (max-width: 480px) {
          .order-modern-table {
            font-size: 0.8rem;
          }
          
          .order-modern-table th,
          .order-modern-table td {
            padding: 8px 4px;
          }
          
          .order-modern-header {
            font-size: 1.3rem;
          }
        }
      `}</style>
      
      <div className="order-modern-container">
        <div className="container-fluid">
          <h2 className="order-modern-header">Quản lý đơn hàng</h2>
          
          <div className="order-modern-card">
            <div className="order-modern-card-header">
              <h3 className="order-modern-card-title">Bộ lọc và tìm kiếm</h3>
            </div>
            <div className="order-modern-card-body">
              <div className="order-modern-controls">
                <div className="order-modern-control-group">
                  <label className="order-modern-label">TÌM KIẾM</label>
                  <input
                    className="order-modern-input"
                    type="text"
                    placeholder="Nhập mã đơn hoặc tên khách hàng..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="order-modern-control-group">
                  <label className="order-modern-label">TRẠNG THÁI</label>
                  <select
                    className="order-modern-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đã giao</option>
                    <option value="delivered">Đã nhận</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
                <div className="order-modern-control-group">
                  <label className="order-modern-label">THANH TOÁN</label>
                  <select
                    className="order-modern-select"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    <option value="">Tất cả thanh toán</option>
                    <option value="pending">Chờ thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="failed">Thất bại</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="order-modern-card">
            <div className="order-modern-card-header">
              <h3 className="order-modern-card-title">Danh sách đơn hàng</h3>
            </div>
            <div className="order-modern-card-body">
              <div className="order-modern-table">
                <table className="table" style={{ marginBottom: 0 }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Tổng tiền</th>
                      <th>Thanh toán</th>
                      <th>Trạng thái</th>
                      <th>Ngày tạo</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.orders && data.orders.length > 0 ? (
                      data.orders.slice(0, perPage).map((order: any, index: number) => (
                        <tr key={order.id}>
                          <td>{index + 1 + (page - 1) * perPage}</td>
                          <td>
                            <span className="order-number">#{order.order_number}</span>
                          </td>
                          <td>{order.name}</td>
                          <td>
                            <span className="order-amount">
                              {formatCurrency(Number(order.total))}
                            </span>
                          </td>
                          <td>
                            <span className={`payment-badge ${getPaymentBadge(order.payment_status)}`}>
                              {getPaymentText(order.payment_status)}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${getStatusBadge(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td>{formatDate(order.created_at)}</td>
                          <td>
                            <button
                              className="action-button"
                              onClick={() => openUpdateModal(order)}
                              title="Cập nhật đơn hàng"
                            >
                              sửa
                            </button>
                            <button
                              className="action-button info"
                              onClick={() => openViewModal(order)}
                              title="Xem chi tiết"
                            >
                              hiển thị 
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="empty-state">
                          {data ? 'Không có đơn hàng nào' : 'Đang tải...'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data?.pagination && (
                <>
                  <div className="pagination-modern">
                    <button
                      className="pagination-button"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      ← Trước
                    </button>

                    {[...Array(Math.min(5, data.pagination.last_page))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          className={`pagination-button ${page === pageNum ? 'active' : ''}`}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      className="pagination-button"
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.pagination.last_page}
                    >
                      Sau →
                    </button>
                  </div>

                  <div className="pagination-info">
                    Hiển thị {((page - 1) * perPage) + 1}-{Math.min(page * perPage, (data.pagination as any).total)}
                    trong tổng số {(data.pagination as any).total} đơn hàng ({perPage} đơn hàng/trang)
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Update Order Modal */}
      <div className={`modal fade ${showUpdateModal ? 'show' : ''}`} style={{ display: showUpdateModal ? 'block' : 'none' }} id="updateOrderModal" tabIndex="-1" role="dialog" aria-hidden={!showUpdateModal}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-edit mr-2"></i>
                Cập nhật đơn hàng #{updateForm.id}
              </h5>
              <button type="button" className="close" onClick={() => setShowUpdateModal(false)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="orderStatus">Trạng thái đơn hàng</label>
                      <select
                        className="form-control"
                        id="orderStatus"
                        value={updateForm.status}
                        onChange={(e) => setUpdateForm(f => ({ ...f, status: e.target.value }))}
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đã giao</option>
                        <option value="delivered">Đã nhận</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="orderNote">Ghi chú</label>
                  <textarea
                    className="form-control"
                    id="orderNote"
                    rows="4"
                    placeholder="Thêm ghi chú cho đơn hàng..."
                    value={updateForm.note}
                    onChange={(e) => setUpdateForm(f => ({ ...f, note: e.target.value }))}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                <i className="fas fa-times mr-1"></i>Hủy
              </button>
              <button type="button" className="btn btn-success" onClick={handleUpdate} disabled={loading}>
                {loading ? <i className="fas fa-spinner fa-spin mr-1"></i> : <i className="fas fa-save mr-1"></i>}Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Order Modal */}
      <style>{`
        .order-view-modal .modal-content {
          border-radius: 14px;
          box-shadow: 0 4px 32px #6366f133;
          border: none;
        }
        .order-view-modal .modal-header {
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
        }
        .order-view-modal .modal-title {
          color: #222;
          font-weight: 700;
          font-size: 1.25rem;
        }
        .order-view-modal .modal-body {
          background: #f9fafb;
          padding: 24px 18px 18px 18px;
          color: #222;
          max-height: 70vh;
          overflow-y: auto;
        }
        .order-view-modal .info-block {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 1px 8px #0001;
          padding: 18px 16px 10px 16px;
          margin-bottom: 18px;
          color: #222;
        }
        .order-view-modal .info-block h6,
        .order-view-modal .info-block p,
        .order-view-modal .info-block strong,
        .order-view-modal .info-block label {
          color: #222;
        }
        .order-view-modal .table {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          color: #222;
        }
        .order-view-modal .table th {
          background: #e0e7ff;
          color: #222;
          font-weight: 600;
        }
        .order-view-modal .table td, .order-view-modal .table th {
          vertical-align: middle;
          padding: 10px 8px;
          color: #222;
        }
        .order-view-modal .order-total {
          text-align: right;
          font-size: 1.2rem;
          color: #d97706;
          font-weight: 700;
          margin-top: 10px;
        }
        .order-view-modal .order-summary h6 {
          text-align: right;
          margin-bottom: 6px;
          color: #222;
        }
        /* --- Modal cập nhật đơn hàng --- */
        .modal#updateOrderModal .modal-content {
          border-radius: 14px;
          box-shadow: 0 4px 32px #6366f133;
          border: none;
        }
        .modal#updateOrderModal .modal-header {
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
        }
        .modal#updateOrderModal .modal-title {
          color: #222;
          font-weight: 700;
          font-size: 1.15rem;
        }
        .modal#updateOrderModal .modal-body,
        .modal#updateOrderModal label,
        .modal#updateOrderModal input,
        .modal#updateOrderModal textarea,
        .modal#updateOrderModal select,
        .modal#updateOrderModal strong,
        .modal#updateOrderModal p,
        .modal#updateOrderModal h5 {
          color: #222;
        }
        .modal#updateOrderModal .form-control {
          color: #222;
        }
        .modal#updateOrderModal .form-group label {
          font-weight: 600;
        }
        .modal#updateOrderModal .modal-footer {
          border-top: 1px solid #e5e7eb;
        }
        /* --- Modal xem chi tiết đơn hàng --- */
        .order-view-modal .modal-content {
          border-radius: 14px;
          box-shadow: 0 4px 32px #6366f133;
          border: none;
        }
        .order-view-modal .modal-header {
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
        }
        .order-view-modal .modal-title {
          color: #222;
          font-weight: 700;
          font-size: 1.25rem;
        }
        .order-view-modal .modal-body {
          background: #f9fafb;
          padding: 24px 18px 18px 18px;
          color: #222;
          max-height: 70vh;
          overflow-y: auto;
        }
        .order-view-modal .info-block {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 1px 8px #0001;
          padding: 18px 16px 10px 16px;
          margin-bottom: 18px;
          color: #222;
        }
        .order-view-modal .info-block h6,
        .order-view-modal .info-block p,
        .order-view-modal .info-block strong,
        .order-view-modal .info-block label {
          color: #222;
        }
        .order-view-modal .table {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          color: #222;
        }
        .order-view-modal .table th {
          background: #e0e7ff;
          color: #222;
          font-weight: 600;
        }
        .order-view-modal .table td, .order-view-modal .table th {
          vertical-align: middle;
          padding: 10px 8px;
          color: #222;
        }
        .order-view-modal .order-total {
          text-align: right;
          font-size: 1.2rem;
          color: #d97706;
          font-weight: 700;
          margin-top: 10px;
        }
        .order-view-modal .order-summary h6 {
          text-align: right;
          margin-bottom: 6px;
          color: #222;
        }
        @media (max-width: 768px) {
          .order-view-modal .row {
            flex-direction: column;
          }
          .order-view-modal .col-md-6 {
            width: 100%;
            margin-bottom: 16px;
          }
        }
      `}</style>
      <div className={`modal fade order-view-modal ${showViewModal ? 'show' : ''}`} style={{ display: showViewModal ? 'block' : 'none' }} id="viewOrderModal" tabIndex="-1" role="dialog" aria-hidden={!showViewModal}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-receipt mr-2"></i>
                Chi tiết đơn hàng #{selectedOrder?.order_number}
              </h5>
              <button type="button" className="close" onClick={() => setShowViewModal(false)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {selectedOrder && (
                <>
                  <div className="row">
                    {/* Thông tin khách hàng */}
                    <div className="col-md-6 info-block">
                      <h6>Thông tin khách hàng</h6>
                      <p><strong>Tên:</strong> {selectedOrder.name}</p>
                      <p><strong>Email:</strong> {selectedOrder.email || 'N/A'}</p>
                      <p><strong>SĐT:</strong> {selectedOrder.phone || 'N/A'}</p>
                      <p><strong>Địa chỉ:</strong> {selectedOrder.address || 'N/A'}</p>
                    </div>
                    {/* Thông tin đơn hàng */}
                    <div className="col-md-6 info-block">
                      <h6>Thông tin đơn hàng</h6>
                      <p><strong>Mã đơn:</strong> #{selectedOrder.order_number}</p>
                      <p><strong>Ngày tạo:</strong> {formatDate(selectedOrder.created_at)}</p>
                      <p>
                        <strong>Trạng thái:</strong>{' '}
                        <span className={`badge ${getStatusBadge(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </p>
                      <p>
                        <strong>Thanh toán:</strong>{' '}
                        <span className={`badge ${getPaymentBadge(selectedOrder.payment_status)}`}>
                          {selectedOrder.payment_status}
                        </span>
                      </p>
                      <p><strong>Phương thức thanh toán:</strong> {selectedOrder.payment_method || 'N/A'}</p>
                      <p><strong>Ghi chú:</strong> {selectedOrder.note || 'Không có'}</p>
                    </div>
                  </div>
                  {/* Danh sách sản phẩm */}
                  <div className="mt-4">
                    <h6 className="font-weight-bold">Sản phẩm trong đơn hàng</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead className="thead-light">
                          <tr>
                            <th>#</th>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, index) => (
                            <tr key={item.id || index}>
                              <td>{index + 1}</td>
                              <td>
                                  <img
                                    src={
                                      item.product_image?.startsWith('http')
                                        ? item.product_image
                                        : `/img/${item.product_image}`
                                    }
                                    alt={item.product_name}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                  />
                                </td>
                              <td>{item.product_name}</td>
                              <td>{formatCurrency(parseFloat(item.final_price))}</td>
                              <td>{item.quantity}</td>
                              <td>{formatCurrency(parseFloat(item.total))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Tổng đơn hàng */}
                  <div className="order-summary mt-3">
                    <h6><strong>Tổng tiền hàng:</strong> {formatCurrency(parseFloat(selectedOrder.subtotal || 0))}</h6>
                    <h6><strong>Phí vận chuyển:</strong> {formatCurrency(parseFloat(selectedOrder.shipping_fee || 0))}</h6>
                    {selectedOrder.discount && (
                      <h6><strong>Giảm giá:</strong> -{formatCurrency(parseFloat(selectedOrder.discount))}</h6>
                    )}
                    <div className="order-total">
                      <span><strong>Tổng thanh toán:</strong> {formatCurrency(parseFloat(selectedOrder.total || 0))}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                <i className="fas fa-times mr-1"></i>Đóng
              </button>
              <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                <i className="fas fa-print mr-1"></i>In đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderManagement;