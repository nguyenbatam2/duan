import Cookies from 'js-cookie';
import axios from 'axios';
import { Review } from '../types/reviews';

// GET - lấy danh sách reviews
export async function getReviews(): Promise<Review> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");

  const res = await axios.get(
    "http://127.0.0.1:8000/api/v1/admin/reviews",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  console.log("Danh sách reviews:", res.data);
  return res.data as Review;
}

export interface UpdateReviewStatusResponse {
  message: string;
  review: Record<string, unknown>;
}

export async function updateReviewStatus(
  reviewId: number,
  data: { action: "approve" | "reject"; admin_note?: string }
): Promise<UpdateReviewStatusResponse> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");

  const res = await axios.put(
    `http://127.0.0.1:8000/api/v1/admin/reviews/${reviewId}/status`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}
