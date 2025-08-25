import axios from "axios";
import { Event, PaginatedEvents } from "@/app/admin/types/event";
import { PUBLIC_API } from "./config";

// Public Events API - cho trang chủ
export async function getPublicEvents(params?: {
  search?: string;
  is_featured?: boolean;
  type?: 'running' | 'upcoming' | 'ended';
  per_page?: number;
  page?: number;
}): Promise<PaginatedEvents> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.is_featured !== undefined) queryParams.append('is_featured', params.is_featured.toString());
  if (params?.type) queryParams.append('type', params.type);
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.page) queryParams.append('page', params.page.toString());

  const url = `${PUBLIC_API.EVENTS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  try {
    console.log('🌐 Fetching public events from:', url);
    const res = await axios.get(url, { timeout: 30000 });
    console.log('✅ Public events fetched successfully');
    return res.data as PaginatedEvents;
  } catch (error: any) {
    console.error('❌ Failed to fetch public events:', {
      url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code
    });
    throw error;
  }
}

export async function getPublicEventById(id: number): Promise<Event> {
  try {
    console.log('🌐 Fetching public event by ID:', id);
    const res = await axios.get<{data: Event}>(`${PUBLIC_API.EVENTS}/${id}`, { timeout: 30000 });
    console.log('✅ Public event fetched successfully');
    return res.data.data as Event;
  } catch (error: any) {
    console.error('❌ Failed to fetch public event by ID:', {
      id,
      url: `${PUBLIC_API.EVENTS}/${id}`,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code
    });
    throw error;
  }
}

// Lấy sự kiện nổi bật cho trang chủ
export async function getFeaturedEvents(): Promise<Event[]> {
  const res = await getPublicEvents({ is_featured: true, per_page: 5 });
  return res.data;
}

// Lấy sự kiện đang diễn ra
export async function getRunningEvents(): Promise<Event[]> {
  const res = await getPublicEvents({ type: 'running', per_page: 10 });
  return res.data;
}

// Lấy tất cả sự kiện đang active (không phân loại)
export async function getActiveEvents(): Promise<Event[]> {
  const res = await getPublicEvents({ per_page: 10 });
  return res.data;
}
