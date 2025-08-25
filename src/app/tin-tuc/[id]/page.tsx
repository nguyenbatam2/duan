"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { getPostById, getPublicPosts } from "@/app/lib/posts";
import { Post } from "@/app/types/post";

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
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

        // Lấy bài viết liên quan
        const response = await getPublicPosts(1, 4);
        const filtered = response.data.filter(p => p.id !== postId);
        setRelatedPosts(filtered);
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
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-10 bg-gray-300 w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-300 w-1/4 mb-6"></div>
        <div className="h-96 bg-gray-300 rounded mb-8"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600 mb-4">{error || "Không tìm thấy bài viết"}</p>
        <Link href="/tin-tuc" className="text-blue-600 hover:text-blue-800">
          ← Quay lại trang tin tức
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.content.substring(0, 150)} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm">
          <Link href="/" className="text-blue-600">Trang chủ</Link> /
          <Link href="/tin-tuc" className="text-blue-600 ml-1">Tin tức</Link> /
          <span className="ml-1 text-gray-700">{post.title}</span>
        </nav>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="text-gray-600 text-sm">
              <span>Đăng ngày: {formatDate(post.created_at)}</span>
              {post.updated_at !== post.created_at && (
                <span className="ml-4">Cập nhật: {formatDate(post.updated_at)}</span>
              )}
            </div>
          </header>

          <div className="mb-8">
            <img
              src={post.image_url || "/img/default-news.jpg"}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/img/default-news.jpg";
              }}
            />
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Bài viết liên quan */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Bài viết liên quan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} href={`/tin-tuc/${rp.id}`} className="block border rounded-lg overflow-hidden shadow hover:shadow-lg">
                    <img
                      src={rp.image_url || "/img/default-news.jpg"}
                      alt={rp.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium line-clamp-2">{rp.title}</h3>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-3">{rp.content}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
}
