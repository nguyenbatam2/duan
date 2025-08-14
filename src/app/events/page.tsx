'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublicEvents } from "@/app/lib/event";
import { Event } from "@/app/admin/types/event";
import "@/app/styles/news.css";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'running' | 'upcoming' | 'ended'>('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getPublicEvents({ 
          type: filter === 'all' ? undefined : filter,
          per_page: 20 
        });
        setEvents(response.data);
      } catch (err) {
        setError("Không thể tải danh sách sự kiện");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);

    if (now < startTime) return 'upcoming';
    if (now > endTime) return 'ended';
    return 'running';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100';
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'ended': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Đang diễn ra';
      case 'upcoming': return 'Sắp diễn ra';
      case 'ended': return 'Đã kết thúc';
      default: return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải sự kiện...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sự kiện khuyến mãi</h1>
        <p className="text-gray-600 mb-6">Khám phá các sự kiện khuyến mãi hấp dẫn với nhiều ưu đãi đặc biệt</p>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('running')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'running' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Đang diễn ra
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'upcoming' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sắp diễn ra
          </button>
          <button
            onClick={() => setFilter('ended')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'ended' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Đã kết thúc
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có sự kiện nào</h3>
          <p className="text-gray-500">Hãy quay lại sau để xem các sự kiện mới!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const eventStatus = getEventStatus(event);
            return (
              <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Event Banner */}
                <div className="relative h-48 overflow-hidden">
                  {event.banner_image ? (
                    <img 
                      src={event.banner_image} 
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">🎉</span>
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {event.is_featured && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Nổi bật
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(eventStatus)}`}>
                    {getStatusText(eventStatus)}
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.name}
                  </h3>
                  
                  {event.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                  )}

                  {/* Discount Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Giảm giá:</span>
                      <span className="text-lg font-bold text-red-600">
                        {event.discount_type === 'percentage' ? `${event.discount_value}%` : `${event.discount_value?.toLocaleString()}₫`}
                      </span>
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Bắt đầu:</span> {formatDate(event.start_time)}
                    </div>
                    <div>
                      <span className="font-medium">Kết thúc:</span> {formatDate(event.end_time)}
                    </div>
                  </div>

                  {/* Products Count */}
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">
                      {event.event_products?.length || 0} sản phẩm tham gia
                    </span>
                  </div>

                  {/* Action Button */}
                  <Link 
                    href={`/events/${event.id}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
