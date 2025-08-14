'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublicEventById } from "@/app/lib/event";
import { Event } from "@/app/admin/types/event";
import { Product } from "@/app/types/product";
import { API_BASE_URL } from "@/app/lib/config";
import AddToCart from "@/app/addToCart/page";
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
              src={`${API_BASE_URL.replace('/api/v1', '')}/storage/${event.banner_image}`}
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

      {/* Products Section - Sử dụng CSS giống trang chủ */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm trong sự kiện</h2>
        
        {event.products && event.products.length > 0 ? (
          <div className="swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events">
            <div className="swiper-wrapper load-after" data-section="section_flash_sale" style={{ transform: "translate3d(0px, 0px, 0px)" }}>
              {event.products.map((product: any) => (
                <div className="swiper-slide swiper-slide-active" style={{ width: "287.75px", marginRight: "20px" }} key={product.id}>
                  <div className="item_product_main">
                    <div className="variants product-action item-product-main product-flash-sale duration-300" data-cart-form="" data-id={`product-actions-${product.id}`}>
                      <span className="flash-sale">-
                        {event.discount_type === 'percentage' ? event.discount_value : Math.round(((product.original_price - product.event_price) / product.original_price) * 100)}%
                      </span>

                      <div className="product-thumbnail">
                        <a className="image_thumb scale_hover" href={`/product/${product.product_id}`} title="Sản phẩm">
                          <img 
                            className="lazyload duration-300 loaded" 
                            src={`${API_BASE_URL.replace('/api/v1', '')}/storage/products/${product.product?.image || 'default-product.jpg'}`}
                            alt={product.product?.name || `Sản phẩm #${product.product_id}`}
                            data-was-processed="true" 
                          />
                        </a>
                      </div>
                      
                      <div className="product-info">
                        <div className="name-price">
                          <h3 className="product-name line-clamp-2-new">
                            <a href={`/product/${product.product_id}`} title={product.product?.name || `Sản phẩm #${product.product_id}`}>
                              {product.product?.name || `Sản phẩm #${product.product_id}`}
                            </a>
                          </h3>
                          <div className="product-price-cart">
                            <span className="compare-price">{product.original_price?.toLocaleString()}₫</span>
                            <span className="price">{product.event_price?.toLocaleString()}₫</span>
                            <div className="productcount">
                              <div className="countitem visible">
                                <div className="fire">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16">
                                    <defs>
                                      <linearGradient id="prefix__a" x1="50%" x2="50%" y1="36.31%" y2="88.973%">
                                        <stop offset="0%" stopColor="#FDD835"></stop>
                                        <stop offset="100%" stopColor="#FFB500"></stop>
                                      </linearGradient>
                                    </defs>
                                    <g fill="none" fillRule="evenodd">
                                      <path d="M0 0H16V16H0z"></path>
                                      <path fill="url(#prefix__a)" stroke="#FF424E" strokeWidth="1.1" d="M9.636 6.506S10.34 2.667 7.454 1c-.087 1.334-.786 2.571-1.923 3.401-1.234 1-3.555 3.249-3.53 5.646-.017 2.091 1.253 4.01 3.277 4.953.072-.935.549-1.804 1.324-2.41.656-.466 1.082-1.155 1.182-1.912 1.729.846 2.847 2.469 2.944 4.27v.012c1.909-.807 3.165-2.533 3.251-4.467.205-2.254-1.134-5.316-2.321-6.317-.448.923-1.144 1.725-2.022 2.33z" transform="rotate(4 8 8)"></path>
                                    </g>
                                  </svg>
                                </div>
                                <span className="a-center">Còn lại <b>{product.quantity_limit || '∞'}</b></span>
                                <div className="countdown" style={{ width: "56%" }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="product-button">
                          <AddToCart 
                            product={{
                              id: product.product_id,
                              name: product.product?.name || `Sản phẩm #${product.product_id}`,
                              price: product.event_price.toString(),
                              discount_price: "0.00",
                              image: product.product?.image || "default-product.jpg",
                              slug: product.product?.slug || `product-${product.product_id}`,
                              description: product.product?.description || "",
                              status: 1,
                              product_type: "simple",
                              stock_quantity: product.quantity_limit || 0,
                              average_rating: null,
                              views_count: 0,
                              quantity: 1
                            } as Product} 
                            onAddToCart={(product) => setSelectedProduct(product)} 
                          />
                          <a href="javascript:void(0)" className="setWishlist btn-views btn-circle" title="Thêm vào yêu thích">
                            <img width="25" height="25" src="/img/heart.webp" alt="Thêm vào yêu thích" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="swiper-button-prev swiper-button-disabled">
              <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2.13003" y="29" width="38" height="38" transform="rotate(-45 2.13003 29)" stroke="black" fill="#fff" strokeWidth="2"></rect>
                <rect x="8" y="29.2133" width="30" height="30" transform="rotate(-45 8 29.2133)" fill="black"></rect>
                <path d="M18.5 29H39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M29 18.5L39.5 29L29 39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <div className="swiper-button-next swiper-button-disabled">
              <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2.13003" y="29" width="38" height="38" transform="rotate(-45 2.13003 29)" stroke="black" fill="#fff" strokeWidth="2"></rect>
                <rect x="8" y="29.2133" width="30" height="30" transform="rotate(-45 8 29.2133)" fill="black"></rect>
                <path d="M18.5 29H39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M29 18.5L39.5 29L29 39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
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
