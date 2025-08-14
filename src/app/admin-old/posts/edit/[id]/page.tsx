"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPostById, updatePost } from "@/app/lib/adminPosts";
import { Post } from "@/app/types/post";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft" as "public" | "draft",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postId = Number(params.id);
        if (isNaN(postId)) {
          setError("ID bài viết không hợp lệ");
          return;
        }
        const postData = await getPostById(postId);
        setPost(postData);
        setFormData({
          title: postData.title,
          content: postData.content,
          status: postData.status as "public" | "draft",
        });
        setImagePreview(postData.image_url);
      } catch (err) {
        setError("Không thể tải bài viết");
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const postId = Number(params.id);
      await updatePost(postId, {
        title: formData.title,
        content: formData.content,
        status: formData.status,
        image: imageFile || undefined,
      });

      alert("Cập nhật bài viết thành công!");
      router.push("/admin/posts");
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật bài viết");
      console.error("Error updating post:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="product-modern-bg">
        <div className="product-modern-container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="product-modern-bg">
        <div className="product-modern-container">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Không tìm thấy bài viết"}</p>
            <Link
              href="/admin/posts"
              className="product-modern-btn product-modern-btn-light"
            >
              ← Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-modern-bg">
      <div className="product-modern-container">
        {/* Header */}
        <div className="product-modern-header">
          <h2 className="product-modern-title gradient-text">Chỉnh sửa bài viết</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/admin/posts" className="product-modern-btn product-modern-btn-light">← Quay lại</Link>
          </div>
        </div>

        {/* Form */}
        <div className="product-modern-table-wrap">
          <form onSubmit={handleSubmit} className="product-modern-form">
            {error && (
              <div className="product-modern-alert product-modern-alert-danger">
                {error}
              </div>
            )}

            <div className="product-modern-modal-body">
              <label>Tiêu đề bài viết *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="product-modern-input"
                placeholder="Nhập tiêu đề bài viết..."
                required
              />

              <label>Nội dung bài viết *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={15}
                className="product-modern-input"
                placeholder="Nhập nội dung bài viết..."
                required
              />

              <label>Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="product-modern-input"
              >
                <option value="draft">Bản nháp</option>
                <option value="public">Công khai</option>
              </select>

              <label>Hình ảnh (tùy chọn)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="product-modern-input"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="product-modern-img"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              )}

              <div className="product-modern-alert product-modern-alert-info">
                <h6 style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Thông tin bài viết:</h6>
                <div style={{ fontSize: '0.9em' }}>
                  <p>ID: {post.id}</p>
                  <p>Tạo ngày: {new Date(post.created_at).toLocaleDateString("vi-VN")}</p>
                  <p>Cập nhật: {new Date(post.updated_at).toLocaleDateString("vi-VN")}</p>
                </div>
              </div>
            </div>

            <div className="product-modern-modal-footer">
              <Link
                href="/admin/posts"
                className="product-modern-btn product-modern-btn-light"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="product-modern-btn product-modern-btn-primary"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
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
        .product-modern-btn-primary {
          background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
        }
        .product-modern-table-wrap {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px #6366f111;
          padding: 18px 10px 10px 10px;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        .product-modern-form {
          padding: 18px 24px 18px 24px;
        }
        .product-modern-modal-body label {
          font-size: 0.97em;
          color: #2563eb;
          font-weight: 500;
          margin-top: 8px;
        }
        .product-modern-input {
          width: 100%;
          border-radius: 8px;
          border: 1.5px solid #e0e7ef;
          padding: 8px 10px;
          font-size: 0.97em;
          margin-bottom: 8px;
          background: #f8fafc;
          color: #222;
          outline: none;
          transition: border 0.18s;
        }
        .product-modern-input:focus {
          border: 1.5px solid #6366f1;
          background: #fff;
        }
        .product-modern-modal-footer {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
          padding: 0 24px 18px 24px;
        }
        .product-modern-alert {
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 0.97em;
          margin-bottom: 2px;
        }
        .product-modern-alert-danger {
          background: #fef2f2;
          color: #ef4444;
        }
        .product-modern-alert-info {
          background: #eff6ff;
          color: #2563eb;
        }
        .product-modern-img {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 8px;
          border: 1.5px solid #e0e7ef;
        }
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
          .product-modern-header { flex-direction: column; gap: 8px; align-items: flex-start; }
          .product-modern-title { font-size: 1.05rem; }
        }
      `}</style>
    </div>
  );
} 