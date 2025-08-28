"use client";

import { useEffect, useState } from "react";
import { getAllPosts, deletePost, createPost, updatePost } from "@/app/lib/adminPosts";
import { Post } from "@/app/types/post";
import "../style/post.css";
import toast from "react-hot-toast";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft" as "public" | "draft",
    image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Search
  const [search, setSearch] = useState("");

  // Lấy danh sách bài viết
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      setError("Không thể tải danh sách bài viết");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Xem chi tiết
  const handleViews = (post: Post) => {
    setSelectedPost(post);
    setShowViewModal(true);
  };

  // Mở modal sửa
  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      status: post.status,
      image_url: post.image_url || "",
    });
    setImageFile(null); // ✅ reset tránh nhầm ảnh cũ
    setImagePreview(post.image_url || "");
    setShowEditModal(true);
  };

  // Mở modal thêm
  const handleAdd = () => {
    setFormData({
      title: "",
      content: "",
      status: "draft",
      image_url: "",
    });
    setImagePreview(null);
    setShowAddModal(true);
  };

  // Xóa bài viết
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
      toast.success("Xóa bài viết thành công!");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi xóa bài viết");
      console.error("Error deleting post:", err);
    }
  };

  // Sửa bài viết
  // Submit sửa bài viết
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await updatePost(selectedPost!.id, {
        title: formData.title,
        content: formData.content,
        status: formData.status,
        image: imageFile || undefined, // ✅ chỉ gửi nếu chọn ảnh mới
      });

      toast.success("Cập nhật bài viết thành công!");
      setShowEditModal(false);

      // reset state
      setSelectedPost(null);
      setImageFile(null);
      setImagePreview(null);

      fetchPosts();
    } catch (err: any) {
      toast.error("Có lỗi xảy ra khi cập nhật bài viết");

      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data); // 👈 log lỗi cụ thể từ backend
      } else {
        console.error("Error updating post:", err);
      }
    }

  };

  // Thêm bài viết
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      await createPost({
        ...formData,
        image: imageFile || undefined,
      });
      setShowAddModal(false);
      fetchPosts();
      toast.success("Tạo bài viết thành công!");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi tạo bài viết");
      console.error("Error creating post:", err);
    }
  };

  // Xử lý ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Lọc bài viết theo search
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
          <div
            className="home__container--title"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <a href="#">Danh sách bài viết</a>
            <button
              type="button"
              onClick={handleAdd}
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
              + Thêm bài viết
            </button>
          </div>

          <div className="home__container--content">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ảnh</th>
                  <th>Tiêu đề</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, index) => (
                  <tr key={post.id}>
                    <td>{index + 1}</td>
                    <td>
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt="Ảnh bài viết"
                          style={{
                            width: 80,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      )}
                    </td>
                    <td>{post.title}</td>
                    <td>
                      {post.content.length > 100
                        ? post.content.slice(0, 100) + "..."
                        : post.content}
                    </td>
                    <td>
                      <span
                        style={{
                          color: post.status === "public" ? "green" : "orange",
                          fontWeight: 600,
                        }}
                      >
                        {post.status === "public" ? "Công khai" : "Bản nháp"}
                      </span>
                    </td>
                    <td>{formatDate(post.created_at)}</td>
                    <td className="action-buttons">
                      <button className="view" onClick={() => handleViews(post)}>
                        Xem
                      </button>
                      <button className="edit" onClick={() => handleEdit(post)}>
                        Sửa
                      </button>
                      <button className="delete" onClick={() => handleDelete(post.id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Xem */}
      {showViewModal && selectedPost && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedPost.title}</h3>
            {selectedPost.image_url && (
              <img
                src={selectedPost.image_url}
                alt="Ảnh bài viết"
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "cover",
                }}
              />
            )}
            <p>{selectedPost.content}</p>
            <p>
              Trạng thái: {selectedPost.status === "public" ? "Công khai" : "Bản nháp"}
            </p>
            <p>Ngày tạo: {formatDate(selectedPost.created_at)}</p>
            <button onClick={() => setShowViewModal(false)}>Đóng</button>
          </div>
        </div>
      )}

      {/* Modal Sửa */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Sửa bài viết</h3>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Tiêu đề"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <textarea
                name="content"
                placeholder="Nội dung"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
              <select
                name="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "public" | "draft",
                  })
                }
              >
                <option value="public">Công khai</option>
                <option value="draft">Bản nháp</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: 120, marginTop: 8 }}
                />
              )}
              <button type="submit">Lưu</button>
              <button type="button" onClick={() => setShowEditModal(false)}>
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thêm */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Thêm bài viết</h3>
            <form onSubmit={handleAddSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Tiêu đề"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <textarea
                name="content"
                placeholder="Nội dung"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
              <select
                name="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "public" | "draft",
                  })
                }
              >
                <option value="public">Công khai</option>
                <option value="draft">Bản nháp</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: 120, marginTop: 8 }}
                />
              )}
              <button type="submit">Thêm</button>
              <button type="button" onClick={() => setShowAddModal(false)}>
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
