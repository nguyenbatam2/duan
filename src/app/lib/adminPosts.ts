import axios from "axios";
import Cookies from "js-cookie";
import { Post } from "@/app/types/post";

// Helper function to get auth token
const getAuthToken = () => {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  return parsed.token;
};

// 2.1. Lấy danh sách tất cả bài viết (bao gồm draft)
export async function getAllPosts(): Promise<Post[]> {
  const token = getAuthToken();
  const res = await axios.get("http://127.0.0.1:8000/api/v1/admin/posts", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data.data as Post[];
}

// 2.2. Tạo bài viết mới
export async function createPost(postData: {
  title: string;
  content: string;
  image?: File;
  status: "public" | "draft";
}): Promise<Post> {
  const token = getAuthToken();
  const formData = new FormData();
  
  formData.append("title", postData.title);
  formData.append("content", postData.content);
  formData.append("status", postData.status);
  
  if (postData.image) {
    formData.append("image", postData.image);
  }

  const res = await axios.post(
    "http://127.0.0.1:8000/api/v1/admin/posts",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.data as Post;
}

// 2.3. Xem chi tiết bài viết
export async function getPostById(id: number): Promise<Post> {
  const token = getAuthToken();
  const res = await axios.get(
    `http://127.0.0.1:8000/api/v1/admin/posts/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return res.data.data as Post;
}

// 2.4. Cập nhật bài viết
export async function updatePost(
  id: number,
  postData: {
    title?: string;
    content?: string;
    image?: File;
    status?: "public" | "draft";
  }
): Promise<Post> {
  const token = getAuthToken();
  const formData = new FormData();
  
  if (postData.title) formData.append("title", postData.title);
  if (postData.content) formData.append("content", postData.content);
  if (postData.status) formData.append("status", postData.status);
  if (postData.image) formData.append("image", postData.image);

  const res = await axios.put(
    `http://127.0.0.1:8000/api/v1/admin/posts/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.data as Post;
}

// 2.5. Xóa bài viết
export async function deletePost(id: number): Promise<{ message: string }> {
  const token = getAuthToken();
  const res = await axios.delete(
    `http://127.0.0.1:8000/api/v1/admin/posts/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return res.data as { message: string };
}

// 2.6. Chuyển đổi trạng thái bài viết
export async function togglePostStatus(id: number): Promise<Post> {
  const token = getAuthToken();
  const res = await axios.patch(
    `http://127.0.0.1:8000/api/v1/admin/posts/${id}/toggle-status`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return res.data.data as Post;
} 