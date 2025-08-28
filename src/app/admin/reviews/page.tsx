"use client";
import { useEffect, useState } from "react";
import { Review } from "../types/reviews";
import { getReviews, updateReviewStatus } from "../lib/reviews";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState(""); // Thêm state search

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await getReviews();
        setReviews(res.data.data);
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải đánh giá");
      } finally {
        setLoadingReviews(false);
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview || !actionType) return;
    setSubmitting(true);
    try {
      await updateReviewStatus(selectedReview.id, { action: actionType, admin_note: adminNote });
      const res = await getReviews();
      setReviews(res.data.data);
      closeModal();
    } catch {
      setError("Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  // Lọc reviews theo từ khóa search
  const filteredReviews = reviews.filter((review) => {
    const keyword = search.toLowerCase();
    return (
      review.product?.name?.toLowerCase().includes(keyword) ||
      review.user?.name?.toLowerCase().includes(keyword) ||
      review.comment?.toLowerCase().includes(keyword)
    );
  });

  return (
    <section className="home">
      <header className="home-header">
        <div className="text">Quản lý đánh giá sản phẩm</div>
        <div className="search">
          <input
            type="text"
            placeholder="Tìm kiếm đánh giá, sản phẩm, người dùng..."
            style={{ padding: "5px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>
      <main className="home-main">
        <div className="home__container two">
          <div
            className="home__container--title"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <a href="#">Danh sách đánh giá sản phẩm</a>
          </div>
          <div className="home__container--content">
            {loadingReviews ? (
              <p>Đang tải...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sản phẩm</th>
                    <th>Người dùng</th>
                    <th>Đánh giá</th>
                    <th>Bình luận</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                    {filteredReviews.length > 0 ? (
                      filteredReviews.map((review) => (
                        <tr key={review.id}>
                          <td>{review.id}</td>
                          <td>{review.product?.name || "-"}</td>
                          <td>{review.user?.name || "-"}</td>
                          <td>{review.rating} ⭐</td>
                          <td style={{ maxWidth: 200 }}>{review.comment}</td>
                          <td>
                            <span
                              className={
                                review.status === "approved"
                                  ? "status-badge status-active"
                                  : review.status === "pending"
                                    ? "status-badge status-unverified"
                                    : review.status === "rejected"
                                      ? "status-badge status-locked"
                                      : "status-badge"
                              }
                            >
                              {review.status === "pending"
                                ? "Chờ duyệt"
                                : review.status === "approved"
                                  ? "Đã duyệt"
                                  : review.status === "rejected"
                                    ? "Đã từ chối"
                                    : review.status}
                            </span>
                          </td>
                          <td>{new Date(review.created_at).toLocaleString()}</td>
                          <td>
                            {review.status === "pending" && (
                              <>
                                <div className="action-buttons">
                                  <button className="green" style={{ marginRight: "10px" }} onClick={() => openModal(review, "approve")}>Duyệt</button>
                                  <button className="delete" onClick={() => openModal(review, "reject")}>Từ chối</button>
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={8}>Không có review nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            {error && <p className="text-red">{error}</p>}
          </div>
        </div>
      </main>
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              {actionType === "approve" ? "Duyệt" : "Từ chối"} đánh giá #{selectedReview?.id}
            </h3>
            <form onSubmit={handleReviewSubmit}>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Ghi chú quản trị viên..."
              />
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>Đóng</button>
                <button type="submit" disabled={submitting}>
                  {submitting ? "Đang xử lý..." : actionType === "approve" ? "Duyệt" : "Từ chối"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
