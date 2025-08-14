import Cookies from 'js-cookie';
import axios from 'axios';
import { Review } from '../types/reviews';
import { ADMIN_API } from '../../lib/config';

// GET - lấy danh sách reviews
export async function getReviews(): Promise<Review> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");

  const res = await axios.get(
    ADMIN_API.REVIEWS,
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
    `${ADMIN_API.REVIEWS}/${reviewId}/status`,
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
