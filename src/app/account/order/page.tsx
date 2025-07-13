'use client';
import Navbar from '@/app/navbar/page';
import '@/app/styles/order.css';
import '@/app/styles/modal.css';
import { getOrders, cancelOrder, getOrdersById, } from '@/app/lib/orderApi';
import { createProductReview } from '@/app/lib/product'; // Hoặc đúng đường dẫn của bạn

import useSWR from 'swr';
import { useState } from 'react';

const STATUS_MAP = {
    "Tất cả": null,
    "Đang xử lý": "pending",
    "Đang xác nhận": "confirmed",
    "Đang chuẩn bị": "processing",
    "Đang vận chuyển": "shipped",
    "Đã giao hàng": "delivered",
    "Đã hủy": "cancelled",
    "Trả hàng / Hoàn tiền": "refunded",
};

const STATUS_DISPLAY = {
    pending: { text: 'Chờ xác nhận', color: '#ffa500' },
    confirmed: { text: 'Đã xác nhận', color: '#17a2b8' },
    processing: { text: 'Đang chuẩn bị', color: '#1e90ff' },
    shipped: { text: 'Đã gửi đi', color: '#4169e1' },
    delivered: { text: 'Đã giao hàng', color: '#32cd32' },
    cancelled: { text: 'Đã hủy', color: '#dc143c' },
    refunded: { text: 'Đã hoàn tiền', color: '#ff6347' },
};


// Các trạng thái không thể hủy đơn hàng
const CANNOT_CANCEL_STATUSES = ['delivered', 'completed', 'cancelled', 'refunded'];

// Các trạng thái bình luận 
const Reviews_STATUSES = ["delivered"];

const getOrderStatus = (status: string | number) => STATUS_DISPLAY[status] || { text: status || 'Không xác định', color: '#888' };
const calculateOrderTotal = (items: any[]) => items.reduce((total, item) => total + item.price * item.quantity, 0);

export default function Order() {
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [status, setStatus] = useState("Tất cả");
    const [, setModalLoading] = useState(false);
    const [page, setPage] = useState(1);
    const { data, error, isLoading, mutate } = useSWR(['orders', page], () => getOrders(page));
    const [showReviewForm, setShowReviewForm] = useState<number | null>(null); // chứa ID đơn hàng đang được mở form
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: "",
        images: [],
    });

    const orders = data?.orders || [];
    const pagination = data?.pagination;

    const filteredOrders = orders.filter(order => {
        const mappedStatus = STATUS_MAP[status.trim()];
        return !mappedStatus || order.status === mappedStatus;
    });

    const openDetailModal = async (id: number) => {
        setModalLoading(true);
        try {
            const detail = await getOrdersById(id);
            setSelectedOrder(detail.order ?? detail);
            setShowModal(true);
        } catch {
            alert("Lỗi khi lấy chi tiết đơn hàng.");
        } finally {
            setModalLoading(false);
        }
    };

    const handleCancelOrder = async (id: number) => {
        try {
            await cancelOrder(id);
            mutate();
        } catch {
            console.log(new Error(error));
        }
    };

    const handleSubmitReview = async (productId: number) => {
        try {
            await createProductReview(productId, reviewData); 
            alert("Gửi đánh giá thành công!");
            setShowReviewForm(null);
            setReviewData({ rating: 5, comment: "", images: [] });
        } catch (err) {
            console.error("Lỗi gửi đánh giá:", err);
            alert("Gửi đánh giá thất bại.");
        }
    };

    if (isLoading) return <div>Đang tải đơn hàng...</div>;
    if (error) return <div>Đã xảy ra lỗi khi tải đơn hàng.</div>;

    return (
        <>
            <section className="signup page_customer_account">
                <div className="container">
                    <div className="row">
                        <Navbar />
                        <div className="col-lg-9 col-12 col-right-ac">
                            <div className="content">
                                <div className="content-header">
                                    <h1>Đơn hàng của bạn</h1>
                                    <div className="content-header-links">
                                        {Object.keys(STATUS_MAP).map(item => (
                                            <a
                                                key={item}
                                                href="#"
                                                className={status === item ? "link active" : "link"}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setStatus(item);
                                                }}
                                            >
                                                {item}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <div className="content-body">
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map(order => {
                                            const { text, color } = getOrderStatus(order.status);
                                            return (
                                                <div className="order-container" key={order.id}>
                                                    <div className="order-header">
                                                        <div className="order-info">
                                                            <span style={{ fontWeight: "bold" }}>Đơn hàng</span>
                                                            <strong>#{order.id}</strong>
                                                            <span>{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                                                            <span className="order-status" style={{ backgroundColor: `${color}20`, color }}>{text}</span>
                                                        </div>
                                                        <div className="order-buttons">
                                                            <button className="btn-detail" onClick={() => openDetailModal(order.id)}>Chi tiết</button>
                                                            {!CANNOT_CANCEL_STATUSES.includes(order.status) && (
                                                                <button
                                                                    className="btn-cancel"
                                                                    onClick={() => handleCancelOrder(order.id)}
                                                                >
                                                                    Hủy đơn
                                                                </button>
                                                            )}
                                                            {Reviews_STATUSES.includes(order.status) && (
                                                                <>
                                                                    <button
                                                                        className="btn-reviews"
                                                                        onClick={() => {
                                                                            setShowReviewForm(order.id)
                                                                        }}
                                                                    >
                                                                        Bình luận
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                            
                                                    <div className="order-items">
                                                        {order.items.map(item => (
                                                            <div className="order-item" key={item.id}>
                                                                <div className="item-left">
                                                                    <img
                                                                        src={item.product_image?.startsWith('http') ? item.product_image : `/${item.product_image}`}
                                                                        alt={item.product_name}
                                                                        className="item-image"
                                                                        width="48"
                                                                        height="48"
                                                                    />
                                                                    <div className="item-details">
                                                                        <strong>{item.product_name}</strong>
                                                                        <div className="item-details_price">
                                                                            Giá: {item.price.toLocaleString('vi-VN')} đ
                                                                            <span style={{ marginLeft: "16px" }}>Số lượng: <span style={{ color: "red" }}>x{item.quantity}</span></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="item-price">
                                                                    {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {showReviewForm === order.id && (
                                                        <div className="mt-3 p-3 border rounded bg-light shadow-sm">
                                                            <h4 className="mb-3">Gửi đánh giá cho sản phẩm #{order.product_id}</h4>

                                                            {/* Chọn sao */}
                                                            <div className="mb-3">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <i
                                                                        key={star}
                                                                        className={`fa-star me-1 ${reviewData.rating >= star ? 'fas text-warning' : 'far text-muted'}`}
                                                                        style={{ cursor: "pointer", fontSize: "20px" }}
                                                                        onClick={() => setReviewData((prev) => ({ ...prev, rating: star }))}
                                                                    />
                                                                ))}
                                                                <span className="ms-2"> {reviewData.rating}  / 5</span>
                                                            </div>

                                                            {/* Comment */}
                                                            <div className="mb-3">
                                                                <textarea
                                                                    className="form-control"
                                                                    placeholder="Viết đánh giá của bạn..."
                                                                    rows={3}
                                                                    value={reviewData.comment}
                                                                    onChange={(e) =>
                                                                        setReviewData((prev) => ({ ...prev, comment: e.target.value }))
                                                                    }
                                                                />
                                                            </div>

                                                            {/* Ảnh minh họa */}
                                                            <div className="mb-3">
                                                                <label className="form-label">Ảnh minh họa (tối đa 3 ảnh)</label>
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    accept="image/*"
                                                                    multiple
                                                                    onChange={(e) =>
                                                                        setReviewData((prev) => ({
                                                                            ...prev,
                                                                            images: Array.from(e.target.files || []).slice(0, 3),
                                                                        }))
                                                                    }
                                                                />
                                                                <div className="mt-2 d-flex gap-2 flex-wrap">
                                                                    {reviewData.images?.map((file: File, idx: number) => (
                                                                        <img
                                                                            key={idx}
                                                                            src={URL.createObjectURL(file)}
                                                                            alt="preview"
                                                                            width={100}
                                                                            height={100}
                                                                            style={{ objectFit: "cover", borderRadius: "8px" }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Nút hành động */}
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={() => handleSubmitReview(order.items[0].product_id)
                                                                    }
                                                                >
                                                                    Gửi đánh giá
                                                                </button>
                                                                <button
                                                                    className="btn btn-secondary btn-sm"
                                                                    onClick={() => setShowReviewForm(null)}
                                                                >
                                                                    Hủy
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="order-footer">
                                                        <div>Tổng {order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</div>
                                                        <div className="total-price">Tổng tiền: {calculateOrderTotal(order.items).toLocaleString('vi-VN')}đ</div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="order-container">
                                            <div>Không có đơn hàng nào.</div>
                                        </div>
                                    )}
                                    
                                    {/* 🔽 CHÈN PHÂN TRANG Ở ĐÂY */}
                                    <div className="pagination">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(page - 1)}
                                        >
                                            ← Trang trước
                                        </button>
                                        <span>Trang {pagination.current_page} / {pagination.last_page}</span>
                                        <button
                                            disabled={page === pagination.last_page}
                                            onClick={() => setPage(page + 1)}
                                        >
                                            Trang sau →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showModal && selectedOrder && (
                <div className="custom-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="custom-modal" onClick={e => e.stopPropagation()}>
                        <div className="custom-modal-header">
                            <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <div className="custom-modal-body">
                            <section>
                                <h3>Thông tin khách hàng</h3>
                                <p><strong>Tên:</strong> {selectedOrder.name}</p>
                                <p><strong>SĐT:</strong> {selectedOrder.phone}</p>
                                <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                            </section>

                            <section>
                                <h3>Sản phẩm đã đặt</h3>
                                <div className="order-items">
                                    {selectedOrder.items.map(item => (
                                        <div className="order-item" key={item.id}>
                                            <img src={item.product_image} alt={item.product_name} />
                                            <div>
                                                <strong>{item.product_name}</strong>
                                                <p>{item.price.toLocaleString()}đ x {item.quantity}</p>
                                            </div>
                                            <div className="price">{(item.price * item.quantity).toLocaleString()}đ</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="custom-modal-footer">
                            <span>Tổng tiền:</span>
                            <strong>{calculateOrderTotal(selectedOrder.items).toLocaleString()}đ</strong>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
