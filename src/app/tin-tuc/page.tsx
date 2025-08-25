"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublicPosts } from "@/app/lib/posts";
import { Post } from "@/app/types/post";
import "@/app/styles/blog.css";

export default function TinTucPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getPublicPosts(1, 12);
        setPosts(response.data);
      } catch (err) {
        setError("Không thể tải danh sách tin tức");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <section className="bread-crumb">
        <div className="container">
          <ul className="breadcrumb">
            <li className="home">
              <Link href="/" title="Trang chủ"><span>Trang chủ</span></Link>
              <span className="mr_lr">&nbsp;<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-chevron-right fa-w-10"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" className=""></path></svg>&nbsp;</span>
            </li>
            <li><strong><span>Kiến thức</span></strong></li>

          </ul>
        </div>
      </section>

      <div className="blog_wrapper layout-blog" >
        <div className="container">
          <div className="row">
            <div className="right-content col-lg-12 col-12">
              <div className="title-page">
                <h1>Kiến thức</h1>
                <div className="title-separator">
                  <div className="separator-center"></div>
                </div>
              </div>
              <div className="row list-news">
                {posts.length === 0 ? (
                  <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                    <p>Không có tin tức nào.</p>
                  </div>

                ) : (
                  posts.map((post) => (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" key={post.id}>
                      <div className="item-blog">
                        <div className="wrapper">
                          <Link className="block-thumb thumb" href={`/tin-tuc/${post.id}`} title={post.title}>

                            <img width="400" height="240" className="lazyload duration-300 loaded" src={post.image_url} alt={post.title} data-was-processed="true" />

                          </Link>
                          <div className="block-content">
                            <h3>
                              <Link href={`/tin-tuc/${post.id}`} title={post.title} className="line-clamp-2-new">{post.title}</Link>
                            </h3>
                            <div className="article-content">

                              <p className="justify line-clamp line-clamp-3">
                                {post.content}
                              </p>

                              <div className="article-info">
                                <p className="time-post">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"></path>
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"></path>
                                  </svg>
                                  <span>
                                    {formatDate(post.created_at)}
                                  </span>
                                </p>

                                <Link href={`/tin-tuc/${post.id}`} title="Đọc thêm" className="read-more">Đọc thêm »</Link>

                              </div>

                            </div>

                          </div>
                        </div>

                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
} 