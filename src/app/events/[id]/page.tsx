'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublicEventById } from "@/app/lib/event";
import { Event } from "@/app/admin/types/event";
import "@/app/styles/news.css";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EventDetailPage({ params }: PageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await getPublicEventById(Number(params.id));
        setEvent(eventData);
      } catch (err) {
        setError("Không thể tải thông tin sự kiện");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

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
          <p className="mt-4 text-gray-600">Đang tải thông tin sự kiện...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">{error || "Không tìm thấy sự kiện"}</p>
          <Link href="/events" className="text-blue-600 hover:underline mt-4 inline-block">
            Quay lại danh sách sự kiện
          </Link>
        </div>
      </div>
    );
  }

  const eventStatus = getEventStatus(event);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/events" className="hover:text-blue-600">Sự kiện</Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{event.name}</li>
        </ol>
      </nav>

      {/* Event Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        {/* Banner */}
        <div className="relative h-64 md:h-96 overflow-hidden">
          {event.banner_image ? (
            <img 
              src={event.banner_image} 
              alt={event.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <span className="text-white text-6xl font-bold">🎉</span>
            </div>
          )}
          
          {/* Status Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(eventStatus)}`}>
            {getStatusText(eventStatus)}
          </div>
          
          {/* Featured Badge */}
          {event.is_featured && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Nổi bật
            </div>
          )}
        </div>

        {/* Event Info */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>
          
          {event.description && (
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Thời gian bắt đầu</h3>
              <p className="text-gray-600">{formatDate(event.start_time)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Thời gian kết thúc</h3>
              <p className="text-gray-600">{formatDate(event.end_time)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Loại giảm giá</h3>
              <p className="text-gray-600 capitalize">
                {event.discount_type === 'percentage' ? 'Phần trăm' : 'Cố định'}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Giá trị giảm giá</h3>
              <p className="text-red-600 font-bold text-lg">
                {event.discount_type === 'percentage' ? `${event.discount_value}%` : `${event.discount_value?.toLocaleString()}₫`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm trong sự kiện</h2>
        
        {event.event_products && event.event_products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {event.event_products
              .filter(product => product.status === "active")
              .map(product => (
                <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Product Image */}
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={product.product?.image || "https://via.placeholder.com/300x300"} 
                      alt={product.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.product?.name}
                    </h3>
                    
                    {/* Prices */}
                    <div className="space-y-1 mb-3">
                      <p className="text-gray-500 line-through text-sm">
                        {product.original_price?.toLocaleString()}₫
                      </p>
                      <p className="text-red-600 font-bold text-lg">
                        {product.event_price?.toLocaleString()}₫
                      </p>
                      {product.discount_price && product.discount_price !== product.event_price && (
                        <p className="text-green-600 font-semibold">
                          Giá khuyến mãi: {product.discount_price.toLocaleString()}₫
                        </p>
                      )}
                    </div>
                    
                    {/* Quantity Limit */}
                    {product.quantity_limit && product.quantity_limit > 0 && (
                      <p className="text-sm text-gray-600 mb-3">
                        Còn lại: <span className="font-semibold">{product.quantity_limit}</span>
                      </p>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link 
                        href={`/product/${product.product?.id}`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                      <button className="bg-red-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-700 transition-colors">
                        Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có sản phẩm nào</h3>
            <p className="text-gray-500">Sự kiện này chưa có sản phẩm tham gia</p>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <Link 
          href="/events"
          className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          ← Quay lại danh sách sự kiện
        </Link>
      </div>
    </div>
  );
}
