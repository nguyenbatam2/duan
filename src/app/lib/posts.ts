import axios from "axios";
import { Post, PostsResponse } from "@/app/types/post";

export async function getPublicPosts(page: number = 1, perPage: number = 10): Promise<PostsResponse> {
  const res = await axios.get(`http://127.0.0.1:8000/api/v1/posts?page=${page}&per_page=${perPage}`);
  return res.data as PostsResponse;
}

export async function getPublicPostsAll(): Promise<Post[]> {
  const res = await axios.get("http://127.0.0.1:8000/api/v1/posts");
  return res.data.data as Post[];
}

export async function getPostById(id: number): Promise<Post> {
  const res = await axios.get(`http://127.0.0.1:8000/api/v1/posts/${id}`);
  if (!res.data) {
    throw new Error("Post not found");
  }
  return res.data as Post;
} 