import axios from "axios";
import { Post, PostsResponse } from "@/app/types/post";
import { API_BASE_URL } from "./config";

export async function getPublicPosts(page: number = 1, perPage: number = 10): Promise<PostsResponse> {
  const res = await axios.get(`${API_BASE_URL}/posts?page=${page}&per_page=${perPage}`);
  return res.data as PostsResponse;
}

export async function getPublicPostsAll(): Promise<Post[]> {
  const res = await axios.get(`${API_BASE_URL}/posts`);
  return res.data.data as Post[];
}

export async function getPostById(id: number): Promise<Post> {
  const res = await axios.get(`${API_BASE_URL}/posts/${id}`);
  if (!res.data) {
    throw new Error("Post not found");
  }
  return res.data as Post;
} 