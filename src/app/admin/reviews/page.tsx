"use client"; // nếu Next.js 13+ dùng app router
import { useEffect, useState } from "react";
import { Review } from "../types/reviews";
import { getReviews, updateReviewStatus } from "../lib/reviews";


export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await getReviews();
        setReviews(res.data.data); // chú ý: res.data.data
      } catch (err: any) {
        console.error("Lỗi:", err);
        setError(err.message || "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  const openModal = (review: Review, action: "approve" | "reject") => {
    setSelectedReview(review);
    setActionType(action);
    setAdminNote("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReview(null);
    setActionType(null);
    setAdminNote("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview || !actionType) return;
    setSubmitting(true);
    try {
      await updateReviewStatus(selectedReview.id, { action: actionType, admin_note: adminNote });
      // reload reviews
      const res = await getReviews();
      setReviews(res.data.data);
      closeModal();
    } catch {
      alert("Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .reviews-modern-container {
          background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
          min-height: 100vh;
          padding: 40px 0 0 0;
        }
        .reviews-modern-table {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 16px #0001;
          overflow: hidden;
          margin-bottom: 32px;
        }
        .reviews-modern-table th, .reviews-modern-table td {
          padding: 13px 20px;
          border-bottom: 1px solid #e9ebed;
          font-size: 1.04rem;
        }
        .reviews-modern-table th {
          background: #f1f5f9;
          font-weight: 600;
          color: #2563eb;
          border-bottom: 2px solid #e0e7ff;
          font-size: 1.08rem;
        }
        .reviews-modern-table tr:last-child td {
          border-bottom: none;
        }
        .reviews-modern-btn {
          border: none;
          border-radius: 6px;
          padding: 6px 16px;
          font-size: 0.97rem;
          font-weight: 500;
          margin-right: 6px;
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
        }
        .reviews-modern-btn.approve { background: #e0e7ff; color: #2563eb; }
        .reviews-modern-btn.approve:hover { background: #2563eb; color: #fff; }
        .reviews-modern-btn.reject { background: #fee2e2; color: #dc2626; }
        .reviews-modern-btn.reject:hover { background: #dc2626; color: #fff; }
        .reviews-modern-btn.primary { background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%); color: #fff; font-weight: 600; }
        .reviews-modern-btn.primary:hover { background: #2563eb; }
        .reviews-modern-btn.secondary { background: #e0e7ff; color: #2563eb; }
        .reviews-modern-btn.secondary:hover { background: #2563eb; color: #fff; }
        .reviews-modern-modal .modal-content {
          border-radius: 14px;
          box-shadow: 0 4px 32px #6366f133;
          border: none;
        }
        .reviews-modern-modal .modal-header {
          border-bottom: none;
          padding-bottom: 0;
        }
        .reviews-modern-modal .modal-title {
          color: #2563eb;
          font-weight: 600;
          font-size: 1.18rem;
        }
        .reviews-modern-modal .btn-close {
          background: #e0e7ff;
          border-radius: 50%;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          color: #2563eb;
          border: none;
          margin-left: 8px;
        }
        .reviews-modern-modal label {
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }
        .reviews-modern-modal input, .reviews-modern-modal textarea {
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          font-size: 1rem;
          margin-bottom: 10px;
          width: 100%;
          background: #f8fafc;
          transition: border 0.15s;
        }
        .reviews-modern-modal input:focus, .reviews-modern-modal textarea:focus {
          border: 1.5px solid #6366f1;
          outline: none;
          background: #fff;
        }
        .reviews-modern-header {
          font-size: 2.1rem;
          font-weight: 700;
          color: #22223b;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
        }
        @media (max-width: 900px) {
          .reviews-modern-table th, .reviews-modern-table td { padding: 8px 8px; font-size: 0.97rem; }
          .reviews-modern-header { font-size: 1.3rem; }
          .reviews-modern-btn { padding: 7px 8px; font-size: 0.97rem; }
        }
      `}</style>
      <div className="reviews-modern-container">
        <h1 className="text-2xl font-bold mb-4">Danh sách Reviews</h1>

        {loading && <p>Đang tải...</p>}
        {error && <p className="text-red-500">Lỗi: {error}</p>}

        {!loading && !error && (
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold">
                    {review.product?.name || "Tên sản phẩm"}
                  </h2>
                  <p>Người dùng: {review.user?.name}</p>
                  <p>Đánh giá: {review.rating} sao</p>
                  <p>Bình luận: {review.comment}</p>
                  <p>Trạng thái: {review.status}</p>
                  <p>Ngày tạo: {new Date(review.created_at).toLocaleString()}</p>
                  {(review.status === "pending") && (
                    <div className="mt-2 flex gap-2">
                      <button className="btn btn-success btn-sm" onClick={() => openModal(review, "approve")}>Duyệt</button>
                      <button className="btn btn-danger btn-sm" onClick={() => openModal(review, "reject")}>Từ chối</button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>Không có review nào.</p>
            )}
          </div>
        )}

        {/* Modal duyệt/từ chối review */}
        {showModal && (
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {actionType === "approve" ? "Duyệt" : "Từ chối"} đánh giá #{selectedReview?.id}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-2">
                      <label className="form-label">Ghi chú quản trị viên (tuỳ chọn)</label>
                      <input
                        className="form-control"
                        value={adminNote}
                        onChange={e => setAdminNote(e.target.value)}
                        placeholder="Nhập ghi chú nếu cần"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>
                      Đóng
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? "Đang gửi..." : (actionType === "approve" ? "Duyệt" : "Từ chối")}
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
