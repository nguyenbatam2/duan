"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPosts, deletePost, togglePostStatus } from "@/app/lib/adminPosts";
import { Post } from "@/app/types/post";
import "../style/post.css";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Xóa bài viết
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
      alert("Xóa bài viết thành công!");
    } catch (err) {
      alert("Có lỗi xảy ra khi xóa bài viết");
      console.error("Error deleting post:", err);
    }
  };

  // Chuyển trạng thái bài viết (công khai <-> nháp)
  const handleToggleStatus = async (id: number) => {
    try {
      const updatedPost = await togglePostStatus(id);
      setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));
      alert("Cập nhật trạng thái thành công!");
    } catch (err) {
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
      console.error("Error toggling status:", err);
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

  return (
    <section className="admin-layout">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Xin chào Admin</h1>
          <p>Quản lý bài viết</p>
        </div>
        <div className="admin-header-right">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            className="search-input"
          />
          <Link href="/admin/posts/create" className="btn btn-primary">
            + Thêm bài viết
          </Link>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="admin-main">
        <div className="card">
          <div className="card-header">
            <h2>Danh sách bài viết</h2>
            <Link href="/admin" className="btn btn-light">
              ← Quay lại Dashboard
            </Link>
          </div>

          <div className="card-body">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ảnh</th>
                  <th>Tiêu đề</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      Đang tải...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="text-center text-danger">
                      {error}
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      Chưa có bài viết nào
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>
                        <img
                          src={
                            post.image_url || "https://via.placeholder.com/50"
                          }
                          className="admin-img"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/img/default-news.jpg";
                          }}
                        />
                      </td>
                      <td>{post.title}</td>
                      <td>{post.content.substring(0, 50)}...</td>
                      <td>
                        <span
                          className={`status ${
                            post.status === "public"
                              ? "status-success"
                              : "status-warning"
                          }`}
                        >
                          {post.status === "public" ? "Công khai" : "Bản nháp"}
                        </span>
                      </td>
                      <td>{formatDate(post.created_at)}</td>
                      <td>
                        <div className="actions">
                          <Link
                            href={`/admin/posts/edit/${post.id}`}
                            className="btn btn-warning btn-sm"
                          >
                            Sửa
                          </Link>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleToggleStatus(post.id)}
                          >
                            {post.status === "public" ? "Ẩn" : "Hiện"}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(post.id)}
                          >
                            Xóa
                          </button>
                          <Link
                            href={`/tin-tuc/${post.id}`}
                            className="btn btn-success btn-sm"
                            target="_blank"
                          >
                            Xem
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </section>
  );
}
