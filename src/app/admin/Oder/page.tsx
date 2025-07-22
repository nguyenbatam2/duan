'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetchOrders, updateOrderStatus } from '@/app/admin/lib/oder';
import Image from 'next/image';

const OrderManagement = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
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

  const query = `page=${page}&search=${search}&status=${status}&payment_status=${paymentStatus}`;
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

  const openUpdateModal = (order) => {
    setUpdateForm({
      id: order.id,
      status: order.status,
      tracking_number: order.tracking_number || '',
      note: order.note || '',
    });
    setShowUpdateModal(true);
  };

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'badge-warning',
      confirmed: 'badge-info',
      processing: 'badge-primary',
      shipped: 'badge-success',
      delivered: 'badge-success',
      cancelled: 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
  };

  const getPaymentBadge = (paymentStatus) => {
    const paymentMap = {
      pending: 'badge-warning',
      paid: 'badge-success',
      failed: 'badge-danger'
    };
    return paymentMap[paymentStatus] || 'badge-secondary';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount).replace('₫', '₫');
  };

  const formatDate = (dateString) => {
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

      <div className="container-fluid py-4">
        {/* <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header pb-0">
                <h6>Bảng tác giả</h6>
              </div>
              <div className="card-body px-0 pt-0 pb-2">
                <div className="table-responsive p-0">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Tác giả</th>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Chức năng</th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Trạng thái</th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Có việc làm</th>
                        <th className="text-secondary opacity-7"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {authors.map((author, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex px-2 py-1">
                              <div>
                                <Image src={author.imgSrc} className="avatar avatar-sm me-3" alt={author.name} width={40} height={40} />
                              </div>
                              <div className="d-flex flex-column justify-content-center">
                                <h6 className="mb-0 text-sm">{author.name}</h6>
                                <p className="text-xs text-secondary mb-0">{author.email}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p className="text-xs font-weight-bold mb-0">{author.role}</p>
                            <p className="text-xs text-secondary mb-0">{author.organization}</p>
                          </td>
                          <td className="align-middle text-center text-sm">
                            <span className={`badge badge-sm ${author.status === 'Trực tuyến' ? 'bg-gradient-success' : 'bg-gradient-secondary'}`}>
                              {author.status}
                            </span>
                          </td>
                          <td className="align-middle text-center">
                            <span className="text-secondary text-xs font-weight-bold">{author.date}</span>
                          </td>
                          <td className="align-middle">
                            <a href="javascript:;" className="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                              Biên tập
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="row">
          <div className="col-12">/
            <div className="card">
              <div className="card-header">
                <h2 className="mb-0">
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Quản lý đơn hàng
                </h2>
              </div>
              <div className="card-body">
                {/* Filters */}
                <div className="row mb-4">
                  <div className="col-md-3 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tìm kiếm..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2 mb-2">
                    <select
                      className="form-control"
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
                  <div className="col-md-2 mb-2">
                    <select
                      className="form-control"
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

                {/* Orders Table */}
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Mã đơn</th>
                        <th scope="col">Khách hàng</th>
                        <th scope="col">Tổng tiền</th>
                        <th scope="col">Thanh toán</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Ngày tạo</th>
                        <th scope="col">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.orders?.length > 0 ? (
                        data.orders.map((order, index) => (
                          <tr key={order.id}>
                            <td>{index + 1 + (page - 1) * 10}</td>
                            <td>
                              <strong>#{order.order_number}</strong>
                            </td>
                            <td>{order.name}</td>
                            <td>
                              <span className="text-success font-weight-bold">
                                {formatCurrency(order.total)}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${getPaymentBadge(order.payment_status)}`}>
                                {order.payment_status === 'pending' && 'Chờ thanh toán'}
                                {order.payment_status === 'paid' && 'Đã thanh toán'}
                                {order.payment_status === 'failed' && 'Thất bại'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${getStatusBadge(order.status)}`}>
                                {order.status === 'pending' && 'Chờ xác nhận'}
                                {order.status === 'confirmed' && 'Đã xác nhận'}
                                {order.status === 'processing' && 'Đang xử lý'}
                                {order.status === 'shipped' && 'Đã giao'}
                                {order.status === 'delivered' && 'Đã nhận'}
                                {order.status === 'cancelled' && 'Đã hủy'}
                              </span>
                            </td>
                            <td>{formatDate(order.created_at)}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => openUpdateModal(order)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-info ml-1"
                                onClick={() => openViewModal(order)}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">
                            {data ? 'Không có đơn hàng nào' : 'Đang tải...'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {data?.pagination && (
                  <nav aria-label="Phân trang đơn hàng">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                        >
                          Trang trước
                        </button>
                      </li>

                      {[...Array(Math.min(5, data.pagination.last_page))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <li key={pageNum} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          </li>
                        );
                      })}

                      <li className={`page-item ${page === data.pagination.last_page ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(page + 1)}
                          disabled={page === data.pagination.last_page}
                        >
                          Trang sau
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}

                {data?.pagination && (
                  <div className="text-center text-muted">
                    Hiển thị {((page - 1) * 10) + 1}-{Math.min(page * 10, data.pagination.total)}
                    trong tổng số {data.pagination.total} đơn hàng
                  </div>
                )}
              </div>
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
      <div className={`modal fade ${showViewModal ? 'show' : ''}`} style={{ display: showViewModal ? 'block' : 'none' }} id="viewOrderModal" tabIndex="-1" role="dialog" aria-hidden={!showViewModal}>
        <div className="modal-dialog modal-xl" role="document">
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
                    <div className="col-md-6">
                      <h6 className="font-weight-bold">Thông tin khách hàng</h6>
                      <p><strong>Tên:</strong> {selectedOrder.name}</p>
                      <p><strong>Email:</strong> {selectedOrder.email || 'N/A'}</p>
                      <p><strong>SĐT:</strong> {selectedOrder.phone || 'N/A'}</p>
                      <p><strong>Địa chỉ:</strong> {selectedOrder.address || 'N/A'}</p>
                    </div>

                    {/* Thông tin đơn hàng */}
                    <div className="col-md-6">
                      <h6 className="font-weight-bold">Thông tin đơn hàng</h6>
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
                  {selectedOrder.items?.length > 0 && (
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
                                    src={`/${item.product_image}`}
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
                  )}

                  {/* Tổng đơn hàng */}
                  <div className="mt-4 text-right">
                    <h6><strong>Tổng tiền hàng:</strong> {formatCurrency(parseFloat(selectedOrder.subtotal || 0))}</h6>
                    <h6><strong>Phí vận chuyển:</strong> {formatCurrency(parseFloat(selectedOrder.shipping_fee || 0))}</h6>
                    {selectedOrder.discount && (
                      <h6><strong>Giảm giá:</strong> -{formatCurrency(parseFloat(selectedOrder.discount))}</h6>
                    )}
                    <h5 className="text-danger"><strong>Tổng thanh toán:</strong> {formatCurrency(parseFloat(selectedOrder.total || 0))}</h5>
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
