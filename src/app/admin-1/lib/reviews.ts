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

// Review Reports API functions
export interface ReviewReport {
  id: number;
  review_id: number;
  reporter_id: number;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at: string;
  review?: Review;
  reporter?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ReviewReportsResponse {
  data: ReviewReport[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// GET - Lấy danh sách review reports
export async function getReviewReports(): Promise<ReviewReportsResponse> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");

  const res = await axios.get(
    `${ADMIN_API.REVIEWS}/review-reports`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  console.log("Danh sách review reports:", res.data);
  return res.data as ReviewReportsResponse;
}

// PUT - Giải quyết report
export async function resolveReviewReport(
  reportId: number,
  data: { action: 'resolve' | 'dismiss'; admin_note?: string }
): Promise<{ message: string; report: ReviewReport }> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");

  const res = await axios.put(
    `${ADMIN_API.REVIEWS}/review-reports/${reportId}/resolve`,
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
