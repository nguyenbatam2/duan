'use client';

// 🧠 React + Hook
import { useState } from "react";
import useSWR from "swr";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// 🌐 Next.js
import Link from "next/link";
import axios from "axios";

// 🧩 Nội bộ - Component
import AddToCart from "@/app/addToCart/page";
import CartModal from "@/app/cartModal/page";
import AddToWishlist from "@/app/addToWishlist/page";
import WishlistModal from "@/app/wishlistModal/page";
import EventCountdown from '@/app/Component/EventCountdown';


// 🔧 Function & Type
import { addHisToRy } from "./lib/addCart";
import { getCoupons, saveCoupon } from "@/app/lib/Coupon";
import { Product } from "@/app/types/product";
import { usePopup } from "@/app/context/PopupContext";
import { getActiveEvents } from "@/app/lib/event";
import { Event } from "@/app/admin/types/event";


// 🔧 Config
import { PUBLIC_API } from "./lib/config";

// 🔁 Fetcher
const fetcher = (url: string) => axios.get(url).then(res => res.data.data);

export default function Page() {
  const { data: products, isLoading, error } = useSWR(
    PUBLIC_API.PRODUCTS,
    fetcher
  );
  const {
    data: coupons,
    isLoading: isLoadingCoupons,
    error: isError,
  } = useSWR("coupons", getCoupons);

  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<string>("tab1-1");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionText, setActionText] = useState<"add" | "remove">("add");
  const [savedCoupons, setSavedCoupons] = useState<number[]>([]);
  const { setIsOpen, setSelectedCoupon } = usePopup();

  // Fetch events data - chỉ lấy sự kiện đang active
  const { data: events, isLoading: isLoadingEvents } = useSWR(
    "active-events",
    async () => {
      try {
        const activeEvents = await getActiveEvents();
        return activeEvents;
      } catch (error) {
        console.error("Failed to fetch events:", error);
        return [];
      }
    }
  );

  // Sử dụng dữ liệu thật - nếu không có sự kiện active thì không hiển thị gì
  const displayEvents = events || [];

  const handleToggleWishlist = (action: "add" | "remove") => {
    setActionText(action);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2500);
  };

  const handleSaveCoupon = async (id: number, code: string) => {
    try {
      const res = await saveCoupon(id);
      setMessage(res.message);
      setSavedCoupons(prev => [...prev, id]); //  thêm id vào danh sách đã lưu
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Có lỗi xảy ra");
    }
    navigator.clipboard.writeText(code);    // copy 
    setTimeout(() => setMessage(""), 3000);
  };


  if (isLoading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>Lỗi khi tải sản phẩm!</p>;
  if (isLoadingCoupons) return <p>Đang tải mã giảm giá...</p>;
  if (isError) return <p>Lỗi khi tải mã giảm giá!</p>;
  if (isLoadingEvents) return <p>Đang tải sự kiện...</p>;

  const groupedByCategory: Record<string, any[]> = {};
  products.forEach((product: any) => {
    const slug = product.category?.slug;
    if (!groupedByCategory[slug]) groupedByCategory[slug] = [];
    groupedByCategory[slug].push(product);
  });

  const categories = Object.entries(groupedByCategory).map(([slug, items], index) => ({
    tab: `tab1-${index + 1}`,
    name: items[0].category?.name || slug,
    slug,
  }));

  const handleAddToHisToRy = (product: Product) => {
    addHisToRy(product);
  };

  return (
    <>
      <div className="section_services">
        <div className="container">
          <div className="bg-container">
            <div className="wire-left"></div>
            <div className="wire-right"></div>
            <div className="services-border">
              <div className="row promo-box">
                <div className="col-lg-3 col-md-3 col-sm-6 col-6 promo-item duration-300">
                  <div className="icon aspect-1">
                    <img width="50" height="50" src="/img/ser_1.png" alt=" Giao hàng siêu tốc" />
                  </div>
                  <div className="info">
                    <h3>
                      Giao hàng siêu tốc
                    </h3>
                    <span>
                      Giao hàng trong 24h
                    </span>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-6 promo-item duration-300">
                  <div className="icon aspect-1">
                    <img width="50" height="50" src="/img/ser_2.png" alt="Tư vấn miễn phí" />
                  </div>
                  <div className="info">
                    <h3>
                      Tư vấn miễn phí
                    </h3>
                    <span>
                      Đội ngũ tư vấn tận tình
                    </span>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-6 promo-item duration-300">
                  <div className="icon aspect-1">
                    <img width="50" height="50" src="/img/ser_3.png" alt="Thanh toán" />
                  </div>
                  <div className="info">
                    <h3>
                      Thanh toán
                    </h3>
                    <span>
                      Thanh toán an toàn
                    </span>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-6 promo-item duration-300">
                  <div className="icon aspect-1">
                    <img width="50" height="50" src="/img/ser_4.png" alt="Giải pháp quà tặng" />
                  </div>
                  <div className="info">
                    <h3>
                      Giải pháp quà tặng
                    </h3>
                    <span>
                      Dành cho doanh nghiệp
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
             {displayEvents.length > 0 && displayEvents.map(event => (
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
               <EventCountdown key={event.id} event={event} />
             </div>
             <div className="block-product-sale has-deal-time">

              <div className="swiper_sale swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events">
                <div className="swiper-wrapper load-after" data-section="section_flash_sale" style={{ transform: "translate3d(0px, 0px, 0px)" }}>
                  {(() => {
                    console.log('Event data:', event);
                    console.log('Event products:', event.products);
                    
                    // Hiển thị tất cả sản phẩm trong sự kiện (không filter theo status)
                    const products = event.products || [];
                    console.log('Products to display:', products);
                    
                    return products.length > 0 ? (
                      products.map((product: any) => (
                        <div className="swiper-slide swiper-slide-active" style={{ width: "287.75px", marginRight: "20px" }} key={product.id}>
                          <div className="item_product_main">

                                                         <div className="variants product-action item-product-main product-flash-sale duration-300" data-cart-form="" data-id="product-actions-34620973">
                               <span className="flash-sale">-
                                 {event.discount_type === 'percentage' ? event.discount_value : Math.round(((product.original_price - product.event_price) / product.original_price) * 100)}%
                               </span>

                                                              <div className="product-thumbnail">
                                  <a className="image_thumb scale_hover" href={`/product/${product.product_id}`} title="Sản phẩm">
                                    <img className="lazyload duration-300 loaded" src="https://via.placeholder.com/300x300" data-src="https://via.placeholder.com/300x300" alt="Sản phẩm" data-was-processed="true" />
                                  </a>
                                </div>
                                <div className="product-info">
                                  <div className="name-price">
                                    <h3 className="product-name line-clamp-2-new">
                                      <a href={`/product/${product.product_id}`} title="Sản phẩm">
                                        Sản phẩm #{product.product_id}
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
                                      id: product.product_id, name: `Sản phẩm #${product.product_id}`, price: product.event_price.toString(), discount_price: "0.00", image: "https://via.placeholder.com/300x300", slug: `product-${product.product_id}`, description: "", status: 1, product_type: "simple", stock_quantity: product.quantity_limit || 0, average_rating: null, views_count: 0, quantity: 1
                                    } as Product}
                                    onAddToCart={(product) => setSelectedProduct(product)}
                                  />

                                  <AddToWishlist product={product} onToggle={handleToggleWishlist} />
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
                  );
                })()}
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


              <div className="view-more clearfix">
                <Link href="/events" title="Xem tất cả" className="btn btn-primary frame">
                  <svg width="14" height="32" viewBox="0 0 14 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="border-svg border-svg-left">
                    <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" fill="none"></path>
                    <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" stroke="white"></path>
                  </svg>
                  Xem tất cả
                  <svg width="14" height="32" viewBox="0 0 14 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="border-svg border-svg-right">
                    <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" fill="none"></path>
                    <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" stroke="white"></path>
                  </svg>
                </Link>
              </div>


            </div>
          </div>
        </section>
      ))}

      <section className="section-index section_4_banner">
        <div className="container">
          {/* <!-- section title starts --> */}
          <div className="section-title">
            <span className="sub-title">
              Yến sào `Bird&#39;s` Nest
            </span>

            <h2>
              Bộ sưu tập quà tặng cao cấp
            </h2>

            <div className="desc">
              Bộ quà tặng Sudes Nest là giải pháp quà Tết, quà Trung Thu, quà tặng doanh nghiệp,.. được
              lựa chọn để
              kết nối các mối quan hệ xã hội, kết nối tình thân, vun đắp các mối quan hệ thêm bền chặt gắn
              kết.
            </div>

            <div className="title-separator">
              <div className="separator-center"></div>
            </div>
          </div>
          {/* <!-- section title end --> */}
          {/* <!-- section products starts --> */}
          <div className="row load-after" data-section="section_4_banner">
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <div className="three_banner">
                <a className="duration-300" href="#" title="Bộ quà 4 mùa">
                  <img width="382" height="574" loading="lazy" className="lazyload duration-300 loaded"
                    src="/img/set1.jpg" alt="Bộ quà 4 mùa" />
                  <div className="banner-info duration-300">
                    <h3>
                      Bộ quà 4 mùa
                    </h3>
                    <span>
                      Giá chỉ từ 499k
                    </span>
                    <div className="btn">
                      Xem ngay »
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <div className="three_banner">
                <a className="duration-300" href="#" title="Bộ quà Lộc Phát">
                  <img width="382" height="574" loading="lazy" className="lazyload duration-300 loaded"
                    src="/img/set2.webp" alt="Bộ quà Lộc Phát" />
                  <div className="banner-info duration-300">
                    <h3>
                      Bộ quà Lộc Phát
                    </h3>
                    <span>
                      Giá chỉ từ 599k
                    </span>
                    <div className="btn">
                      Xem ngay »
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <div className="three_banner">
                <a className="duration-300" href="#" title="Bộ quà Thịnh Vượng">
                  <img width="382" height="574" loading="lazy" className="lazyload duration-300 loaded"
                    src="/img/set3.webp" alt="Bộ quà Thịnh Vượng" />
                  <div className="banner-info duration-300">
                    <h3>
                      Bộ quà Thịnh Vượng
                    </h3>
                    <span>
                      Giá chỉ từ 799k
                    </span>
                    <div className="btn">
                      Xem ngay »
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <div className="three_banner">
                <a className="duration-300" href="#" title="Bộ quà Tài lộc">
                  <img width="382" height="574" loading="lazy" className="lazyload duration-300 loaded"
                    src="/img/set4.webp" alt="Bộ quà Tài lộc" />
                  <div className="banner-info duration-300">
                    <h3>
                      Bộ quà Tài lộc
                    </h3>
                    <span>
                      Giá chỉ từ 999k
                    </span>
                    <div className="btn">
                      Xem ngay »
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          {/* <!-- section products ends --> */}
        </div>
      </section>

      <section className="section-index section_coupons">
        <div className="container">
          <div className="section-title">
            <span className="sub-title">
              Yến sào `Bird&#39;s` Nest
            </span>

            <h2>
              Mã giảm giá dành cho bạn
            </h2>
            <div className="title-separator">
              <div className="separator-center"></div>
            </div>
          </div>
          <Swiper
            modules={[Navigation]}
            initialSlide={0}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              480: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className="swiper_coupons"
          >
            {coupons?.map((coupon: any) => (
              <SwiperSlide
                key={coupon.id}
              >
                <div className="box-coupon">
                  <div className="mask-ticket"></div>
                  <div className="image">
                    <img width="88" height="88" src="/img/img_coupon_1.webp" alt={coupon.code} />
                  </div>
                  <div className="content_wrap">
                    <a
                      title="Chi tiết"
                      className="info-button"
                      onClick={() => {
                        setSelectedCoupon({
                          id: coupon.id,
                          code: coupon.code,
                          end_at: coupon.end_at,
                          description: coupon.description,
                        });
                        setIsOpen(true);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                        <path d="M144 80c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z" />
                      </svg>
                    </a>

                    <div className="content-top">
                      {coupon.code}
                      <span className="line-clamp line-clamp-2">
                        {coupon.description || "Không có mô tả"}
                      </span>
                    </div>
                    <div className="content-bottom">
                      <span>HSD: {coupon.end_at}</span>
                      <button
                        onClick={() => handleSaveCoupon(coupon.id, coupon.code)}
                        className={`coupon-code js-copy ${savedCoupons.includes(coupon.id) ? 'saved' : ''}`}
                        title="Click để lưu/copy lại"
                      >
                        {savedCoupons.includes(coupon.id) ? "Copy mã" : "Lưu mã"}
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>


        </div>
      </section>

      <section className="section-index section_about">
        <div className="bg-banner">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-6 col-md-12 col-left">
                <div className="product-content">
                  <div className="section-title">
                    <span className="sub-title">
                      Yến sào `Bird&#39;s` Nest
                    </span>
                    <h2>
                      Câu chuyện về `Bird&#39;s` Nest
                    </h2>
                    <div className="title-separator">
                      <div className="separator-center"></div>
                    </div>
                  </div>
                  <div className="desc">
                    Như quý vị đã biết: <b>`&quot;`Tài sản lớn nhất của đời người là sức khỏe và trí tuệ`&quot;`</b>, có
                    sức khỏe và trí tuệ thì sẽ có tất cả. Sản phẩm yến sào là thực phẩm bổ dưỡng
                    mang lại cho Quý vị sức khỏe, trí tuệ và sự trẻ trung. Yến sào được thị trường
                    đón nhận với phương châm: <b>&quot;Chất lượng uy tín là thương hiệu&quot;</b>.<br />
                    Sản phẩm yến sào của <b>Bird&#39;s Nest</b> được khai thác và nuôi tổ
                    với chất lượng tuyệt đối...
                  </div>
                  {/* <!-- button --> */}
                  <Link href="sanpham.html" title="Xem chi tiết" className="show-more btn btn-extent frame">
                    <svg width="14" height="32" viewBox="0 0 14 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="border-svg border-svg-left">
                      <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" fill="none"></path>
                      <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" stroke="white"></path>
                    </svg>
                    Xem chi tiết
                    <svg width="14" height="32" viewBox="0 0 14 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="border-svg border-svg-right">
                      <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" fill="none"></path>
                      <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" stroke="white"></path>
                    </svg>
                  </Link>
                  {/* <!-- button --> */}
                </div>
              </div>
              <div className="col-12 col-lg-6 col-md-12 col-right">
                <div className="banner-product">
                  <img width="600" height="371" src="/img/footer nen.webp" alt="Sudes Banner" className="img-responsive center-block " />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`section-index section_product_tab section_product_tab_1`}>
        <div className="container">
          <div className="wrap_tab_index not-dqtab e-tabs ajax-tab-1" data-section-2="ajax-tab-1">
            <div className="section-title">
              <span className="sub-title">
                Yến sào Bird`s Nest
              </span>
              <h2>
                <Link href="/to-yen" title="Tổ yến">Tổ yến</Link>
              </h2>
              <div className="title-separator">
                <div className="separator-center"></div>
              </div>
              <div className="tab_big">
                <div className="tab_ul">
                  <ul className="tabs tabs-title tab-pc tabtitle2 ajax clearfix">
                    {categories.map((cart) => (
                      <li key={cart.tab} className={`tab-link tab_cate has-content current ${activeTab === cart.tab ? 'current' : ''}`} data-tab={cart.tab} data-url="to-yen-tho" onClick={() => setActiveTab(cart.tab)} style={{ cursor: 'pointer' }}>
                        <span>{cart.name}</span>
                      </li>
                    ))}

                  </ul>
                </div>
              </div>
            </div>
            <div className="block-products">
              {categories.map((cat) => (
                <div key={cat.tab} className={`${cat.tab} tab-content ${activeTab === cat.tab ? 'current' : ''}`}>
                  <div className="row load-after" data-section="section_product_tab_1">
                    {groupedByCategory[cat.slug].slice(0, 8).map((product: any) => (
                      <div key={product.id} className="col-lg-3 col-md-3 col-sm-6 col-xs-12" onClick={() => handleAddToHisToRy(product)} >
                        <div className="item_product_main">
                          <form method="post" className="variants product-action item-product-main duration-300" encType="multipart/form-data">
                            <span className="flash-sale">-
                              {product.has_active_event 
                                ? product.event_discount_percentage 
                                : (product.base_discount > 0 
                                  ? Math.round((product.display_price / parseInt(product.base_price)) * 100)
                                    : 0)}%
                            </span>
                            <div className="product-thumbnail">
                              <Link className="image_thumb scale_hover" href={`/product/${product.id}`} title={product.name}>
                                <img
                                  src={`${product.image}`}
                                  alt={product.name}
                                />

                              </Link>
                            </div>

                            <div className="product-info">
                              <div className="name-price">
                                <h3 className="product-name line-clamp-2-new">
                                  <Link href={`/product/${product.slug}`} title={product.name}>{product.name}</Link>
                                </h3>
                                <div className="product-price-cart">
                                  {product.has_active_event ? (
                                    <>
                                      <span className="compare-price">{parseInt(product.original_price).toLocaleString()}₫</span>
                                      <span className="price">{parseInt(product.display_price).toLocaleString()}₫</span>
                                    </>
                                  ) : (
                                    <>
                                      {product.base_discount > 0 && (
                                        <span className="compare-price">{parseInt(product.base_price).toLocaleString()}₫</span>
                                      )}
                                      <span className="price">{parseInt(product.display_price).toLocaleString()}₫</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="product-button">
                                <input type="hidden" name="variantId" value={product.id} />
                                <div style={{ marginBottom: "0px" }}>
                                  <AddToCart 
                                    product={{
                                      ...product,
                                      price: product.display_price
                                    }} 
                                    onAddToCart={(product) => setSelectedProduct(product)} 
                                  />
                                </div>
                                <AddToWishlist product={product} onToggle={handleToggleWishlist} />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              ))}
              {/* <!-- button --> */}
              <div className="view-more clearfix">
                <Link href="/to-ten" title="Xem tất cả" className="btn btn-primary frame">
                  <svg width="14" height="32" viewBox="0 0 14 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="border-svg border-svg-left">
                    <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" fill="none"></path>
                    <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" stroke="white"></path>
                  </svg>
                  Xem tất cả
                  <svg width="14" height="32" viewBox="0 0 14 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="border-svg border-svg-right">
                    <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" fill="none"></path>
                    <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" stroke="white"></path>
                  </svg>
                </Link>
              </div>
              {/* <!-- button --> */}
            </div>
          </div>
        </div>
      </section>

      <section className="section-index section_why_choise">
        <div className="container">
          <div className="section-title">
            <span className="sub-title">
              Yến sào Bird&#39;s Nest
            </span>
            <h2>
              Vì sao chọn chúng tôi
            </h2>
            <div className="title-separator">
              <div className="separator-center"></div>
            </div>
          </div>
          <div className="wrap-choise row">
            <div className="col col-left col-md-4 col-xs-12 col-12">
              <div className="wrap-choise-mb">
                <div className="choise_item">
                  <div className="img_choise">
                    <img className="" alt="Yến sào cao cấp" src="/img/why_choise_1_icon.png" />
                  </div>
                  <div className="text_choise">
                    <h3>Yến sào cao cấp</h3>
                    <div className="content_choise">Hoàn toàn được gia công</div>
                  </div>
                </div>
                <div className="choise_item">
                  <div className="img_choise">
                    <img className="" alt="Chất lượng tuyệt đối" src="/img/why_choise_2_icon.png" />
                  </div>
                  <div className="text_choise">
                    <h3>Chất lượng tuyệt đối</h3>
                    <div className="content_choise">100% tự nhiên</div>
                  </div>
                </div>
                <div className="choise_item">
                  <div className="img_choise">
                    <img className="" alt="Sản phẩm" src="/img/why_choise_3_icon.png" />
                  </div>
                  <div className="text_choise">
                    <h3>Sản phẩm</h3>
                    <div className="content_choise">Đạt chuẩn ATVSTP</div>
                  </div>
                </div>
                <div className="choise_item d-md-none">
                  <div className="img_choise">
                    <img className="" alt="Dịch vụ vận chuyển" src="/img/why_choise_4_icon.png" />
                  </div>
                  <div className="text_choise">
                    <h3>Giá cả hợp lý</h3>
                    <div className="content_choise">Không qua trung gian</div>
                  </div>
                </div>
                <div className="choise_item d-md-none">
                  <div className="img_choise">
                    <img className="" alt="Giao hàng" src="/img/why_choise_5_icon.png" />
                  </div>
                  <div className="text_choise">
                    <h3>Giao hàng</h3>
                    <div className="content_choise">Siêu tốc trong 24h</div>
                  </div>
                </div>
                <div className="choise_item d-md-none">
                  <div className="img_choise">
                    <img className="" alt="Thanh toán" src="/img/why_choise_6_icon.png" />
                  </div>
                  <div className="text_choise">
                    <h3>Thanh toán</h3>
                    <div className="content_choise">Đa dạng và an toàn</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-center col-md-4 col-xs-12 col-12">
              <div className="banner-product">
                <img width="429" height="499" alt="Vì sao chọn chúng tôi" src="/img/banner.png" />
              </div>
            </div>
            <div className="col col-right col-md-4 col-xs-12 col-12">
              <div className="choise_item">
                <div className="img_choise">
                  <img className="" alt="Giá cả hợp lý" src="/img/why_choise_4_icon.png" />
                </div>
                <div className="text_choise">
                  <h3>Giá cả hợp lý</h3>
                  <div className="content_choise">Không qua trung gian</div>
                </div>
              </div>
              <div className="choise_item">
                <div className="img_choise">
                  <img className="" alt="Giao hàng" src="/img/why_choise_5_icon.png" />
                </div>
                <div className="text_choise">
                  <h3>Giao hàng</h3>
                  <div className="content_choise">Siêu tốc trong 24h</div>
                </div>
              </div>
              <div className="choise_item">
                <div className="img_choise">
                  <img className="" alt="Thanh toán" src="/img/why_choise_6_icon.png" />
                </div>
                <div className="text_choise">
                  <h3>Thanh toán</h3>
                  <div className="content_choise">Đa dạng và an toàn</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <CartModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      {showModal && <WishlistModal action={actionText} />}

    </>

  );
}
