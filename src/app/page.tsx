'use client';
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import AddToCart from "@/app/addToCart/page";
import { Product } from "@/app/types/product";
import CartModal from "../app/cartModal/page"; // Import the CartModal component
const fetcher = (url: string) => axios.get(url).then(res => res.data.data);

export default function Page() {
  const { data: products, error, isLoading } = useSWR("http://127.0.0.1:8000/api/v1/products", fetcher);
  const [activeTab, setActiveTab] = useState<string>('tab1-1');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (isLoading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>Lỗi khi tải sản phẩm!</p>;

  const groupedByCategory: Record<string, any[]> = {};
  products.forEach((product: any) => {
    const slug = product.category?.slug;
    if (!groupedByCategory[slug]) {
      groupedByCategory[slug] = [];
    }
    groupedByCategory[slug].push(product);
  });

  const categories = Object.entries(groupedByCategory).map(([slug, items], index) => ({
    tab: `tab1-${index + 1}`,
    name: items[0].category?.name || slug,
    slug
  }));

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
          <div className="swiper_coupons swiper-container">
            <div className="swiper-wrapper">
              {/* <!-- swiper-slide 1 --> */}
              <div className="swiper-slide swiper-slide-active" style={{ width: '302.75px', marginRight: '16px' }}>
                <div className="box-coupon">
                  <div className="mask-ticket"></div>
                  <div className="image">
                    <img width="88" height="88" className="" src="/img/img_coupon_1.webp" alt="NEST200" />
                  </div>
                  <div className="content_wrap">
                    <a title="Chi tiết" href="javascript:void(0)" className="info-button" data-coupon="NEST200" data-time="12/12/2024">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                        <path d="M144 80c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z">
                        </path>
                      </svg>
                    </a>
                    <div className="content-top"> NEST200
                      <span className="line-clamp line-clamp-2">Giảm 200k giá trị đơn hàng</span>
                    </div>
                    <div className="content-bottom">
                      <span>HSD: 12/12/2024</span>
                      <div className="coupon-code js-copy" data-copy="NEST200" title="Sao chép">Copy
                        mã</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- swiper-slide 2 --> */}
              <div className="swiper-slide " style={{ width: '302.75px', marginRight: '16px' }}>
                <div className="box-coupon">
                  <div className="mask-ticket"></div>
                  <div className="image">
                    <img width="88" height="88" className="" src="/img/img_coupon_1.webp" alt="NEST100" />
                  </div>
                  <div className="content_wrap">
                    <a title="Chi tiết" href="javascript:void(0)" className="info-button" data-coupon="NEST100" data-time="24/12/2024">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                        <path d="M144 80c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z">
                        </path>
                      </svg>
                    </a>
                    <div className="content-top"> NEST100
                      <span className="line-clamp line-clamp-2">Giảm 100k giá trị đơn hàng</span>
                    </div>
                    <div className="content-bottom">
                      <span>HSD: 24/12/2024</span>
                      <div className="coupon-code js-copy" data-copy="NEST100" title="Sao chép">Copy
                        mã</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- swiper-slide 3 --> */}
              <div className="swiper-slide " style={{ width: '302.75px', marginRight: '16px' }}>
                <div className="box-coupon">
                  <div className="mask-ticket"></div>
                  <div className="image">
                    <img width="88" height="88" className="" src="/img/img_coupon_1.webp" alt="NEST50" />
                  </div>
                  <div className="content_wrap">
                    <a title="Chi tiết" href="javascript:void(0)" className="info-button" data-coupon="NEST50" data-time="25/12/2024">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                        <path d="M144 80c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z">
                        </path>
                      </svg>
                    </a>
                    <div className="content-top"> NEST50
                      <span className="line-clamp line-clamp-2">Giảm 50k giá trị đơn hàng</span>
                    </div>
                    <div className="content-bottom">
                      <span>HSD: 25/12/2024</span>
                      <div className="coupon-code js-copy" data-copy="NEST50" title="Sao chép">Copy mã
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- swiper-slide 4 --> */}
              <div className="swiper-slide " style={{ width: '302.75px', marginRight: '16px' }}>
                <div className="box-coupon">
                  <div className="mask-ticket"></div>
                  <div className="image">
                    <img width="88" height="88" className="" src="/img/img_coupon_1.webp" alt="NESTFREESHIP" />
                  </div>
                  <div className="content_wrap">
                    <a title="Chi tiết" href="javascript:void(0)" className="info-button" data-coupon="NESTFREESHIP" data-time="25/12/2024">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                        <path d="M144 80c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z">
                        </path>
                      </svg>
                    </a>
                    <div className="content-top"> NESTFREESHIP
                      <span className="line-clamp line-clamp-2">Miễn phí giao hàng</span>
                    </div>
                    <div className="content-bottom">
                      <span>HSD: 25/12/2024</span>
                      <div className="coupon-code js-copy" data-copy="NESTFREESHIP" title="Sao chép">
                        Copy mã</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

      <section className="section-index section_product_tab section_product_tab_1">
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
                      <div key={product.id} className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                        <div className="item_product_main">
                          <form method="post" className="variants product-action item-product-main duration-300" encType="multipart/form-data">
                            <span className="flash-sale">-
                              {product.discount_price !== "0.00"
                                ? ((parseInt(product.price) - parseInt(product.discount_price)) / parseInt(product.price) * 100).toFixed(0)
                                : "0"}%
                            </span>
                            <div className="product-thumbnail">
                              <Link className="image_thumb scale_hover" href={`/product/${product.id}`} title={product.name}>
                                <img
                                  className="lazyload duration-300 loaded"
                                  src={
                                    product.image
                                      ? product.image.startsWith('http')
                                        ? product.image
                                        : `http://localhost:8000/storage/products/${product.image}`
                                      : '/img/default.webp'
                                  }
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
                                  {product.discount_price !== "0.00" && (
                                    <span className="compare-price">{parseInt(product.price).toLocaleString()}₫</span>
                                  )}
                                  <span className="price">
                                    {parseInt(
                                      product.discount_price === "0.00" ? product.price : product.discount_price
                                    ).toLocaleString()}₫
                                  </span>
                                </div>
                              </div>
                              <div className="product-button">
                                <input type="hidden" name="variantId" value={product.id} />
                                <div style={{ marginBottom: "0px" }}>
                                  <AddToCart product={product} onAddToCart={(product) => setSelectedProduct(product)} />
                                </div>
                                <a href="javascript:void(0)" className="setWishlist btn-views btn-circle" data-wish={product.slug} title="Thêm vào yêu thích">
                                  <img width="25" height="25" src="/img/heart.webp" alt="Thêm vào yêu thích" />
                                </a>
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
    </>

  );
}
