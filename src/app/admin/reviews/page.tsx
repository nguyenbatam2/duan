"use client";
import { useEffect, useState } from "react";
import { Review } from "../types/reviews";
import { getReviews, updateReviewStatus } from "../lib/reviews";
import "../style/rew.css"

interface User {
  _id: string;
  username: string;
  email: string;
  role: "superadmin" | "admin" | "user";
  isBlocked: boolean;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"users" | "reviews">("reviews");

  // --- State Users ---
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<"" | "superadmin" | "admin" | "user">("");
  const [error, setError] = useState<string>("");

  // --- State Reviews ---
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews
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
      alert("Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Dummy User Logic (bạn có thể thay bằng API riêng) ---
  const handleToggleRole = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u
      )
    );
  };
  const handleToggleBlock = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, isBlocked: !u.isBlocked } : u))
    );
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
    

      <div className="admin-layout">
        {/* Sidebar */}

        {/* Main Content */}
        <main className="admin-content">
          {false && (
            <section className="users-section">
              

              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Quyền</th>
                    <th>Trạng Thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((u) => !roleFilter || u.role === roleFilter)
                    .map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.username}</td>
                        <td>{item.email}</td>
                        <td>
                          {item.role === "superadmin"
                            ? "Super Admin"
                            : item.role === "admin"
                            ? "Admin"
                            : "User"}
                        </td>
                        <td>{item.isBlocked ? "Bị khóa" : "Hoạt động"}</td>
                        <td>
                          <button onClick={() => handleToggleRole(item._id)}>
                            {item.role === "admin" ? "Gỡ Admin" : "Cấp Admin"}
                          </button>
                          <button onClick={() => handleToggleBlock(item._id)}>
                            {item.isBlocked ? "Mở" : "Khóa"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {error && <p className="text-red">{error}</p>}
            </section>
          )}

          {activeTab === "reviews" && (
            <section className="reviews-section">
              <h2>Quản lý đánh giá sản phẩm</h2>
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
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <tr key={review.id}>
                          <td>{review.id}</td>
                          <td>{review.product?.name || "-"}</td>
                          <td>{review.user?.name || "-"}</td>
                          <td>{review.rating} ⭐</td>
                          <td style={{ maxWidth: 200 }}>{review.comment}</td>
                          <td>
                            <span className={`badge ${review.status}`}>
                              {review.status}
                            </span>
                          </td>
                          <td>{new Date(review.created_at).toLocaleString()}</td>
                          <td>
                            {review.status === "pending" && (
                              <>
                                <button className="reviews-modern-btn approve" onClick={() => openModal(review, "approve")}>Duyệt</button>
                                <button className="reviews-modern-btn reject" onClick={() => openModal(review, "reject")}>Từ chối</button>
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
            </section>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{actionType === "approve" ? "Duyệt" : "Từ chối"} đánh giá #{selectedReview?.id}</h3>
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
    </div>
  );
}
