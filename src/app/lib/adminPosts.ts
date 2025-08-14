import axios from "axios";
import Cookies from "js-cookie";
import { Post } from "@/app/types/post";
import { ADMIN_API } from "./config";

// Helper function to get auth token
const getAuthToken = () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");
  return token;
};

// 2.1. Lấy danh sách tất cả bài viết (bao gồm draft)
export async function getAllPosts(): Promise<Post[]> {
  const token = getAuthToken();
  const res = await axios.get(ADMIN_API.POSTS, {
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
    ADMIN_API.POSTS,
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
    `${ADMIN_API.POSTS}/${id}`,
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
    `${ADMIN_API.POSTS}/${id}`,
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
    `${ADMIN_API.POSTS}/${id}`,
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
    `${ADMIN_API.POSTS}/${id}/toggle-status`,
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