'use client';

import { useEffect, useState } from "react";
import { getPublicEvents } from "@/app/lib/event";
import { Event } from "@/app/admin/types/event";
import { Product } from "@/app/types/product";
import { API_BASE_URL } from "@/app/lib/config";
import AddToCart from "@/app/addToCart/page";
import "@/app/styles/news.css";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getPublicEvents({ 
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
  }, []);

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
    <div>
      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có sự kiện nào</h3>
          <p className="text-gray-500">Hãy quay lại sau để xem các sự kiện mới!</p>
        </div>
      ) : (
        events.map((event) => {
          const eventStatus = getEventStatus(event);
          // Sử dụng event.products thay vì event.eventProducts để giống trang chủ
          const products = (event as any).products || [];
          console.log('Event:', event);
          console.log('Products:', products);
          
          return (
            <section className="section-index section_flash_sale" key={event.id}>
              <div className="container">
                <div className="section-title">
                  <span className="sub-title">
                    Yến sào Sudes Nest
                  </span>
                  <h2>
                    <a href={`/events/${event.id}`} title="Khuyến mãi đặc biệt">
                      {event.name}
                    </a>
                  </h2>
                  <div className="title-separator">
                    <div className="separator-center"></div>
                  </div>
                  <div className="event-info mb-4">
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Bắt đầu:</span> {formatDate(event.start_time)}
                      </div>
                      <div>
                        <span className="font-medium">Kết thúc:</span> {formatDate(event.end_time)}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(eventStatus)}`}>
                        {getStatusText(eventStatus)}
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-center text-gray-600 mt-2 max-w-2xl mx-auto">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="block-product-sale has-deal-time">
                  <div className="swiper_sale swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events">
                    <div className="swiper-wrapper load-after" data-section="section_flash_sale" style={{ transform: "translate3d(0px, 0px, 0px)" }}>
                      {products.length > 0 ? (
                        products.map((product: any) => (
                          <div className="swiper-slide swiper-slide-active" style={{ width: "287.75px", marginRight: "20px" }} key={product.id}>
                            <div className="item_product_main">
                              <div className="variants product-action item-product-main product-flash-sale duration-300" data-cart-form="" data-id="product-actions-34620973">
                                <span className="flash-sale">-
                                  {event.discount_type === 'percentage' ? event.discount_value : Math.round(((product.original_price - product.event_price) / product.original_price) * 100)}%
                                </span>

                                <div className="product-thumbnail">
                                  <a className="image_thumb scale_hover" href={`/product/${product.product_id}`} title="Sản phẩm">
                                    <img 
                                      className="lazyload duration-300 loaded" 
                                      src={`${API_BASE_URL.replace('/api/v1', '')}/storage/products/${product.product?.image || 'default-product.jpg'}`}
                                      alt="Sản phẩm" 
                                    />
                                  </a>
                                </div>
                                
                                <div className="product-info">
                                  <div className="name-price">
                                    <h3 className="product-name line-clamp-2-new">
                                      <a href={`/product/${product.product_id}`} title="Sản phẩm">
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
                                        slug: `product-${product.product_id}`,
                                        description: product.product?.description || "",
                                        status: 1,
                                        product_type: "simple",
                                        stock_quantity: product.quantity_limit || 0,
                                        average_rating: null,
                                        views_count: 0,
                                        quantity: 1
                                      } as Product} 
                                      onAddToCart={() => {}} 
                                    />
                                    <a href="javascript:void(0)" className="setWishlist btn-views btn-circle" title="Thêm vào yêu thích">
                                      <img width="25" height="25" src="/img/heart.webp" alt="Thêm vào yêu thích" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="swiper-slide" style={{ width: "100%", textAlign: "center", padding: "40px" }}>
                          <p>Chưa có sản phẩm nào trong sự kiện này</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Navigation buttons */}
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
                </div>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
