"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPosts, deletePost, togglePostStatus } from "@/app/lib/adminPosts";
import { Post } from "@/app/types/post";


export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      return;
    }

    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
      alert("Xóa bài viết thành công!");
    } catch (err) {
      alert("Có lỗi xảy ra khi xóa bài viết");
      console.error("Error deleting post:", err);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const updatedPost = await togglePostStatus(id);
      setPosts(posts.map(post => 
        post.id === id ? updatedPost : post
      ));
      alert("Cập nhật trạng thái thành công!");
    } catch (err) {
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
      console.error("Error toggling status:", err);
    }
  };

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách bài viết...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-modern-bg">
      <div className="product-modern-container">
        {/* Header */}
        <div className="product-modern-header">
          <h2 className="product-modern-title gradient-text">Quản lý bài viết</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/admin" className="product-modern-btn product-modern-btn-light">Dashboard</Link>
            <Link href="/admin/posts/create" className="product-modern-btn">
              <span style={{fontWeight:600, fontSize:'1.1em'}}>+</span> Thêm bài viết
            </Link>
          </div>
        </div>
        {/* Table */}
        <div className="product-modern-table-wrap">
          <table className="product-modern-table product-modern-table-compact">
            <thead>
              <tr>
                <th className="center">ID</th>
                <th className="center">Ảnh</th>
                <th>Tiêu đề</th>
                <th>Nội dung</th>
                <th className="center">Trạng thái</th>
                <th>Ngày tạo</th>
                <th className="center"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center">Loading...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={7} className="text-center">Chưa có bài viết nào</td></tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id}>
                    <td className="center">{post.id}</td>
                    <td className="center">
                      <img 
                        src={post.image_url || "https://via.placeholder.com/50"} 
                        className="product-modern-img product-modern-img-round"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/img/default-news.jpg";
                        }}
                      />
                    </td>
                    <td>{post.title}</td>
                    <td>{post.content.substring(0, 50)}...</td>
                    <td className="center">
                      <span className={`product-modern-status ${
                        post.status === "public" ? "product-modern-status-success" : "product-modern-status-warning"
                      }`}>
                        {post.status === "public" ? "Công khai" : "Bản nháp"}
                      </span>
                    </td>
                    <td>{formatDate(post.created_at)}</td>
                    <td className="center">
                      <Link 
                        href={`/admin/posts/edit/${post.id}`}
                        className="product-modern-btn product-modern-btn-warning product-modern-btn-icon" 
                        title="Sửa"
                      >
                        <span>Sửa</span>
                      </Link>
                      <button 
                        className="product-modern-btn product-modern-btn-info product-modern-btn-icon" 
                        onClick={() => handleToggleStatus(post.id)}
                        title={post.status === "public" ? "Chuyển thành bản nháp" : "Công khai"}
                      >
                        <span>{post.status === "public" ? "Ẩn" : "Hiện"}</span>
                      </button>
                      <button 
                        className="product-modern-btn product-modern-btn-danger product-modern-btn-icon" 
                        onClick={() => handleDelete(post.id)}
                        title="Xóa"
                      >
                        <span>Xóa</span>
                      </button>
                      <Link 
                        href={`/tin-tuc/${post.id}`}
                        className="product-modern-btn product-modern-btn-success product-modern-btn-icon" 
                        target="_blank"
                        title="Xem"
                      >
                        <span>Xem</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .product-modern-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
          padding: 0 0 0 0px;
        }
        .product-modern-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 12px 32px 12px;
        }
        .product-modern-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .product-modern-title {
          font-size: 1.18rem;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.5px;
        }
        .product-modern-btn {
          background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 7px 18px;
          font-size: 0.97rem;
          font-weight: 500;
          margin-left: 8px;
          margin-bottom: 2px;
          box-shadow: 0 2px 8px #6366f122;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .product-modern-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, #2563eb 0%, #6366f1 100%);
          box-shadow: 0 4px 16px #6366f133;
        }
        .product-modern-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .product-modern-btn-light {
          background: #f1f5f9;
          color: #2563eb;
          border: 1.5px solid #e0e7ef;
        }
        .product-modern-table-wrap {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px #6366f111;
          padding: 18px 10px 10px 10px;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        .product-modern-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 0.97rem;
        }
        .product-modern-table th {
          background: linear-gradient(90deg, #e0e7ff 0%, #f1f5f9 100%);
          color: #2563eb;
          font-weight: 600;
          padding: 10px 8px;
          border-top: none;
          border-bottom: 2px solid #6366f1;
        }
        .product-modern-table td {
          background: #fff;
          padding: 8px 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        .product-modern-table tr {
          transition: background 0.13s;
        }
        .product-modern-table tr:hover {
          background: #f0f4ff;
        }
        .product-modern-img {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 8px;
          border: 1.5px solid #e0e7ef;
        }
        .product-modern-status {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.9em;
          font-weight: 500;
        }
        .product-modern-status-success {
          background: #e0fce6;
          color: #22c55e;
        }
        .product-modern-status-warning {
          background: #fef3c7;
          color: #f59e0b;
        }
        .product-modern-btn-warning {
          background: linear-gradient(90deg, #f59e0b 0%, #f97316 100%);
        }
        .product-modern-btn-info {
          background: linear-gradient(90deg, #06b6d4 0%, #0891b2 100%);
        }
        .product-modern-btn-danger {
          background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
        }
        .product-modern-btn-success {
          background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
        }
        .product-modern-table-compact th, .product-modern-table-compact td {
          font-size: 0.95em;
          padding: 8px 6px;
        }
        .product-modern-table-compact th {
          font-weight: 700;
          background: linear-gradient(90deg, #e0e7ff 0%, #f1f5f9 100%);
          color: #2563eb;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
        }
        .product-modern-table-compact td {
          font-size: 0.97em;
          color: #222;
          background: #fff;
          opacity: 1 !important;
          filter: none !important;
        }
        .product-modern-table-compact tr {
          opacity: 1 !important;
          filter: none !important;
        }
        .product-modern-table-compact tbody {
          opacity: 1 !important;
          filter: none !important;
        }
        .product-modern-table-compact .center {
          text-align: center;
          vertical-align: middle;
        }
        .product-modern-img-round {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border: 1.5px solid #e0e7ef;
          background: #f8fafc;
        }
        .product-modern-btn-icon {
          padding: 6px 10px;
          min-width: 0;
          font-size: 1.08em;
          margin-left: 4px;
          margin-right: 0;
        }
        .product-modern-btn-icon:first-child { margin-left: 0; }
        .gradient-text {
          background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @media (max-width: 900px) {
          .product-modern-bg { padding-left: 54px; }
          .product-modern-container { padding: 8px 2vw; }
        }
        @media (max-width: 600px) {
          .product-modern-table-compact th, .product-modern-table-compact td { font-size: 0.91em; padding: 6px 2px; }
          .product-modern-header { flex-direction: column; gap: 8px; align-items: flex-start; }
          .product-modern-title { font-size: 1.05rem; }
        }
      `}</style>
    </div>
  );
} 