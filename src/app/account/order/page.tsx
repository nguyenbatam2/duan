'use client';
import Navbar from '@/app/navbar/page';
import '@/app/styles/order.css';
import styles from '@/app/styles/modal.module.css';
import { getOrders, cancelOrder, getOrdersById, } from '@/app/lib/orderApi';
import { createProductReview } from '@/app/lib/product'; // Hoặc đúng đường dẫn của bạn
import useSWR from 'swr';
import { useState } from 'react';
import toast from "react-hot-toast";

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
const STATUS_DISPLAY: Record<string, { text: string, color: string }> = {
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
// const calculateOrderTotal = (items: any[]) => items.reduce((total, item) => total + item.price * item.quantity, 0);

export default function Order() {
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [status, setStatus] = useState("Tất cả");
    const [, setModalLoading] = useState(false);
    const [page, setPage] = useState(1);
    const { data, error, isLoading, mutate } = useSWR(['orders', page], () => getOrders(page));

    const [showReviewForm, setShowReviewForm] = useState<number | null>(null);
    const [reviewData, setReviewData] = useState<{
        rating: number;
        comment: string;
        images: File[];
    }>({
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

    const logReviewDebug = (productId: number) => {
        try {
            const imagesMeta = reviewData.images?.map((f: File) => ({ name: f.name, size: f.size, type: f.type })) || [];
            console.log("[Review] Preparing to submit:", {
                productId,
                rating: reviewData.rating,
                comment: reviewData.comment,
                images: imagesMeta,
            });

            // Simulate how FormData would look like (keys only) for debugging purposes
            const fd = new FormData();
            fd.append("rating", String(reviewData.rating));
            fd.append("comment", reviewData.comment ?? "");
            (reviewData.images || []).forEach((file, idx) => fd.append(`images[${idx}]`, file));
            const formDataPreview: Array<{ key: string; value: string }> = [];
            // @ts-expect-error - TS doesn't know entries() on FormData in some DOM lib versions
            for (const [key, value] of fd.entries()) {
                formDataPreview.push({ key, value: value instanceof File ? `File(${value.name}, ${value.type}, ${value.size} bytes)` : String(value) });
            }
            console.log("[Review] FormData preview:", formDataPreview);
        } catch (e) {
            console.log("[Review] Failed to build debug preview:", e);
        }
    };

    const handleSubmitReview = async (productId: number | undefined) => {
        if (!productId) {
            console.warn("[Review] Missing productId when submitting review.");
            toast.error("Không xác định được sản phẩm để đánh giá");
            return;
        }
        if (!reviewData.comment.trim()) {
            toast.error("Vui lòng nhập nội dung bình luận");
            return;
        }

        try {
            logReviewDebug(productId);
            console.log("[Review] Sending request to API...");
            const response = await createProductReview(productId, reviewData);
            console.log("[Review] API response:", response);
            toast.success("Gửi đánh giá thành công!");
            setShowReviewForm(null);
            setReviewData({ rating: 5, comment: "", images: [] });
        } catch (error) {
            // Attempt to extract more details
            // @ts-expect-error - runtime defensive logging
            const errData = (error && (error.response?.data || error.data)) ?? undefined;
            console.error("[Review] API error:", error);
            if (errData) console.error("[Review] API error data:", errData);
            // @ts-expect-error - safe optional chaining for UX message
            toast.error(error?.response?.data?.message || "Lỗi khi gửi đánh giá");
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
                                                            <span style={{ fontWeight: "bold" }}>Đơn hàng :</span>
                                                            <span>{order.order_number}</span>
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
                                                        </div>
                                                    </div>

                                                    {/* Chỉ hiển thị tổng số sản phẩm và tiền nếu chưa có items */}
                                                    <div className="oder-footers">
                                                        <span>Ngày tạo: {new Date(order.created_at).toLocaleDateString('vi-VN')} - Dự kiến ngày nhận đơn hàng: {new Date(new Date(order.created_at).getTime() + (3 + Math.floor(Math.random() * 2)) * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}</span>
                                                        <div className="order-footer">
                                                            <div style={{ fontWeight: "bold", color: "#140f0fcb" }}>Thanh toán: <strong style={{ color: "red" }}>{(order.total).toLocaleString('vi-VN')}đ</strong> </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="order-container">
                                            <div>Không có đơn hàng nào.</div>
                                        </div>
                                    )}

                                    {/* PHÂN TRANG */}
                                    <div className="pagination">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(page - 1)}
                                        >
                                            ← Trang trước
                                        </button>
                                        <span>Trang {pagination?.current_page} / {pagination?.last_page}</span>
                                        <button
                                            disabled={page === pagination?.last_page}
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
                <div className={styles.customModalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.customModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div></div>
                            <h2>Chi tiết đơn hàng #{selectedOrder.order_number}</h2>
                            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.contentWrapper}>
                                {/* LEFT SECTION */}
                                <div className={styles.leftSection}>
                                    <div className={styles.orderInfo}>

                                        <h3 className={styles.sectionTitle}>Đơn hàng: </h3>
                                        {new Date(selectedOrder.created_at).toLocaleDateString('vi-VN')} | Thanh toán: {selectedOrder.payment_method} | Trạng thái:
                                        {selectedOrder.status && (
                                            <>
                                                <div className={styles.orderStatus} style={{ backgroundColor: getOrderStatus(selectedOrder.status).color + '30', color: getOrderStatus(selectedOrder.status).color }}>
                                                    {getOrderStatus(selectedOrder.status).text}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Customer Info */}
                                    <div className={styles.infoSection}>
                                        <h3 className={styles.sectionTitle}>Khách hàng</h3>
                                        <div className={styles.infoCard}>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Tên: {selectedOrder.name}</span>
                                            </div>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Số điện thoại: {selectedOrder.phone}</span>
                                            </div>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Email: {selectedOrder.email}</span>
                                            </div>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Địa chỉ: {selectedOrder.address}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product List */}
                                    <div className={styles.productsSection}>
                                        <div className={styles.orderItems}>
                                            {selectedOrder.items.map((item) => (
                                                <div key={item.id}>
                                                    <div
                                                        className={styles.orderItem}
                                                        style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}
                                                    >
                                                        <img
                                                            src={`/${item.product_image}`}
                                                            alt={item.product_name}
                                                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                                                        />
                                                        <div>
                                                            <strong>{item.product_name}</strong>
                                                            <p>{Number(item.price).toLocaleString('vi-VN')}đ x {item.quantity}</p>
                                                        </div>
                                                        <div style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
                                                            {(Number(item.price) * item.quantity).toLocaleString('vi-VN')}đ
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={styles.orderFooter}
                                                        style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}
                                                    >
                                                        {Reviews_STATUSES.includes(selectedOrder.status) && (
                                                            <button
                                                                className="btn-reviews"
                                                                onClick={() => { console.log("[Review] Open form for item:", { itemId: item.id, productId: item.product?.id, productName: item.product_name }); setShowReviewForm(item.id); }}
                                                            >
                                                                Bình luận
                                                            </button>
                                                        )}
                                                    </div>

                                                    {showReviewForm === item.id && (
                                                        <div className="mt-3 p-3 border rounded bg-light shadow-sm">
                                                            <h4 className="mb-3">Gửi đánh giá cho sản phẩm #{item.product?.id}</h4>
                                                            <div className="mb-3">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <i key={star} className={`fa-star me-1 ${reviewData.rating >= star ? 'fas text-warning' : 'far text-muted'}`}
                                                                        style={{ cursor: "pointer", fontSize: "20px" }}
                                                                        onClick={() => setReviewData((prev) => ({ ...prev, rating: star }))}
                                                                    />
                                                                ))}
                                                                <span className="ms-2"> {reviewData.rating} / 5</span>
                                                            </div>

                                                            <div className="mb-3">
                                                                <textarea className="form-control" placeholder="Viết đánh giá của bạn..." rows={3} value={reviewData.comment}
                                                                    onChange={(e) =>
                                                                        setReviewData((prev) => ({ ...prev, comment: e.target.value }))
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="mb-3">
                                                                <label className="form-label">Ảnh minh họa (tối đa 3 ảnh)</label>
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    accept="image/*"
                                                                    multiple
                                                                    onChange={(e) => {
                                                                        const files = Array.from(e.target.files || []).slice(0, 3);
                                                                        console.log("[Review] File input changed:", files.map(f => ({ name: f.name, size: f.size, type: f.type })));
                                                                        setReviewData((prev) => ({
                                                                            ...prev,
                                                                            images: files,
                                                                        }));
                                                                    }}
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

                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={() => handleSubmitReview(item.product?.id)}
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
                                                </div>
                                            ))}


                                </div>
                                    </div>
                                </div>

                                {/* RIGHT SECTION */}
                                <div className={styles.rightSection}>
                                    <h3 className={styles.paymentTitle}>Thanh toán</h3>

                                    <div className={styles.paymentRow}>
                                        <span className={styles.paymentLabel}>Tạm tính</span>
                                        <span className={styles.paymentValue}>{Number(selectedOrder.subtotal).toLocaleString('vi-VN')}đ</span>
                                    </div>

                                    <div className={styles.paymentRow}>
                                        <span className={styles.paymentLabel}>Thuế</span>
                                        <span className={styles.paymentValue}>0đ</span>
                                    </div>

                                    <div className={styles.paymentRow}>
                                        <span className={styles.paymentLabel}>Phí vận chuyển</span>
                                        <span className={styles.paymentValue}>0đ</span>
                                    </div>

                                    <div className={styles.paymentRow}>
                                        <span className={styles.paymentLabel}>Giảm giá</span>
                                        <span className={styles.paymentValue}>
                                            -{Number(selectedOrder.discount).toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>

                                    <div className={styles.paymentRow}>
                                        <span className={styles.paymentLabel} style={{ fontSize: 16 }}>Tổng tiền</span>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className={styles.totalAmount} style={{ color: 'red' }}>
                                                {Number(selectedOrder.total).toLocaleString('vi-VN')}đ
                                            </div>
                                        </div>
                                    </div>
                                    <button className={`${styles.btn} ${styles.btnBlock}`} onClick={() => setShowModal(false)}>Đóng</button>
                                    {/* <button className="btn btn btn-primary" type="button"><span className="txt-main">Đóng</span></button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
