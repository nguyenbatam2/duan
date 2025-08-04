"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPostById } from "@/app/lib/posts";
import { Post } from "@/app/types/post";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postId = Number(params.id);
        if (isNaN(postId)) {
          setError("ID bài viết không hợp lệ");
          return;
        }
        const postData = await getPostById(postId);
        setPost(postData);
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
          <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Không tìm thấy bài viết"}</p>
          <Link
            href="/tin-tuc"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Quay lại trang tin tức
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/tin-tuc"
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          ← Quay lại trang tin tức
        </Link>
      </div>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 text-sm">
            <span>Đăng ngày: {formatDate(post.created_at)}</span>
            {post.updated_at !== post.created_at && (
              <span className="ml-4">Cập nhật: {formatDate(post.updated_at)}</span>
            )}
          </div>
        </header>

        <div className="mb-8">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/img/default-news.jpg";
            }}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/tin-tuc"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Xem tất cả tin tức
          </Link>
        </div>
      </article>
    </div>
  );
} 