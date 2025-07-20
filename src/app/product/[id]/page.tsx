'use client';
import useSWR from "swr";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { getProductById, getProductReviews, reportProductReview } from '@/app/lib/product';
import { getHisToRy } from '@/app/lib/addCart';
import { getCoupons, saveCoupon } from "@/app/lib/Coupon";


import CartModal from '@/app/cartModal/page';
import AddToCart from '@/app/addToCart/page';

import { Product } from '@/app/types/product';
import '@/app/styles/product-detail.css';

export default function ProductDetail() {
    const {
        data: coupons,
        isLoading: isLoadingCoupons,
        error: isError,
    } = useSWR("coupons", getCoupons);

    const { id } = useParams();
    const [history, setHistory] = useState<Product[]>([]);

    const [message, setMessage] = useState("");
    const [showReportAlert, setShowReportAlert] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [savedCoupons, setSavedCoupons] = useState<number[]>([]);


    const [activeTab, setActiveTab] = useState('#tab-1');

    const fetchProductAndReviews = async (id: number) => {
        const productData = await getProductById(id);
        const product = productData.data;
        const reviews = await getProductReviews(product.id);
        console.log(reviews)
        return { product, reviews };
    };

    const { data, error, isLoading } = useSWR(
        id ? `product-detail-${id}` : null,
        () => fetchProductAndReviews(Number(id))
    );

    const product = data?.product;
    const reviews = data?.reviews || [];
    const relatedProducts = product?.related_products || [];

    useEffect(() => {
        const data = getHisToRy();
        setHistory(data.reverse().slice(0, 5));
    }, []);




    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    const fullStars = Math.floor(Number(averageRating));
    const hasHalfStar = Number(averageRating) % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);



    if (history.length === 0) return null;
    if (isLoading) return <div>Đang tải chi tiết sản phẩm...</div>;
    if (error) return <div>Lỗi khi tải sản phẩm</div>;
    if (isLoadingCoupons) return <p>Đang tải mã giảm giá...</p>;
    if (isError) return <p>Lỗi khi tải mã giảm giá!</p>;

    const tabs = [
        { id: '#tab-1', title: 'Mô tả sản phẩm' },
        { id: '#tab-2', title: 'Hướng dẫn mua hàng' },
        { id: '#tab-3', title: 'Đánh giá' },
    ];
    const handleReport = async (reviewId: number) => {
        try {
            await reportProductReview(reviewId, { reason: 'Nội dung không phù hợp' });
            setShowReportAlert(true);
            setTimeout(() => setShowReportAlert(false), 4000);
        } catch (err: any) {
            if (err.response?.status === 409) {
                alert('Bạn đã báo cáo đánh giá này trước đó.');
            } else {
                console.error('Lỗi báo cáo:', err);
            }
        }
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


    return (
        <>
            <section className="bread-crumb">
                <div className="container">
                    <ul className="breadcrumb">
                        <li className="home">
                            <Link href="/" title="Trang chủ"><span>Trang chủ</span></Link>
                            <span className="mr_lr">&nbsp;<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-chevron-right fa-w-10">
                                <path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" ></path>
                            </svg>&nbsp;</span>
                        </li>
                        <li>
                            <Link className="changeurl" href="/my-pham-saffron" title="Mỹ phẩm Saffron"><span>Mỹ phẩm
                                Saffron</span></Link>
                            <span className="mr_lr">&nbsp;<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-chevron-right fa-w-10">
                                <path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" ></path>
                            </svg>&nbsp;</span>
                        </li>
                        <li><strong><span>{product.name}</span></strong></li>
                        <li>
                        </li>
                    </ul>
                </div>
            </section>

            <div className="container">
                <div className="details-product">
                    <div className="bg-shadow margin-bottom-20">
                        <div className="row">
                            {/* <!-- thumbnail starts --> */}
                            <div className="col-lg-6 col-md-12 col-12 product-detail-left product-images">
                                <div className="sticky">
                                    <div className="product-image-block relative">
                                        {/* <!-- Main Image Slider --> */}
                                        <div className="swiper-container gallery-top swiper-initialized swiper-horizontal swiper-backface-hidden">
                                            <div className="swiper-wrapper" id="lightgallery" aria-live="polite">
                                                {product.images && product.images.length > 0 ? (
                                                    product.images.map((img: any, idx: number) => (
                                                        <Link
                                                            key={img.id || idx}
                                                            className={`swiper-slide${idx === 0 ? " swiper-slide-active" : ""}`}
                                                            data-hash={idx}
                                                            href="#"
                                                            title="Click để xem"
                                                            role="group"
                                                            aria-label={`${idx + 1} / ${product.images.length}`}
                                                            style={{ width: "476px", marginRight: "10px" }}
                                                        >
                                                            <img src={`/${img.image_path}`} alt={img.alt_text || product.name} />
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <Link
                                                        className="swiper-slide swiper-slide-active"
                                                        data-hash="0"
                                                        href="#"
                                                        title="Click để xem"
                                                        role="group"
                                                        aria-label="1 / 1"
                                                        style={{ width: "476px", marginRight: "10px" }}
                                                    >
                                                        <img src={`/${product.image || "img/sp1.webp"}`} alt={product.name} />
                                                    </Link>
                                                )}
                                                {/* <Link className="swiper-slide swiper-slide-next" data-hash="1" href="#" title="Click để xem" role="group" aria-label="2 / 4" style={{ width: "476px", marginRight: "10px" }}>
                                                    <img src="/img/1.1.webp" alt="Set quà 2010 – Maneli #1 bồi bổ sức khỏe, dưỡng nhan" />
                                                </Link>
                                                <Link className="swiper-slide" data-hash="2" href="#" title="Click để xem" role="group" aria-label="3 / 4" style={{ width: "476px", marginRight: "10px" }}>
                                                    <img src="/img/1.2.webp" alt="Set quà 2010 – Maneli #1 bồi bổ sức khỏe, dưỡng nhan" />
                                                </Link>
                                                <Link className="swiper-slide" data-hash="3" href="#" title="Click để xem" role="group" aria-label="4 / 4" style={{ width: "476px", marginRight: "10px" }}>
                                                    <img src="/img/1.3.webp" alt="Set quà 2010 – Maneli #1 bồi bổ sức khỏe, dưỡng nhan" />
                                                </Link> */}
                                            </div>
                                            <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
                                        {/* <!-- Thumbnail Slider --> */}
                                        <div className="swiper-container gallery-thumbs swiper-initialized swiper-vertical swiper-free-mode swiper-watch-progress swiper-backface-hidden swiper-thumbs">
                                            <div className="swiper-wrapper" id="swiper-wrapper-db10af86476757f58" aria-live="polite" style={{ transform: "translate3d(0px, 0px, 0px)", flexDirection: "column" }}>
                                                {product.images && product.images.length > 0 ? (
                                                    product.images.map((img: any, idx: number) => (
                                                        <div
                                                            key={img.id || idx}
                                                            className={`swiper-slide swiper-slide-visible${idx === 0 ? " swiper-slide-active swiper-slide-thumb-active" : ""}`}
                                                            data-hash={idx}
                                                            role="group"
                                                            aria-label={`${idx + 1} / ${product.images.length}`}
                                                            style={{ height: "111.5px", marginBottom: "10px" }}
                                                        >
                                                            <img src={`/${img.image_path}`} alt={img.alt_text || product.name} />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="swiper-slide swiper-slide-visible swiper-slide-active swiper-slide-thumb-active" data-hash="0" role="group" aria-label="1 / 1" style={{ height: "111.5px", marginBottom: "10px" }}>
                                                        <img src={`/${product.image || "img/sp1.webp"}`} alt={product.name} />
                                                    </div>
                                                )}
                                                {/* <div className="swiper-slide swiper-slide-visible swiper-slide-next" data-hash="1" role="group" aria-label="2 / 4" style={{ height: "111.5px", marginBottom: "10px" }}>
                                                    <img src="/img/1.1.webp" alt="Set quà 2010 – Maneli #1 bồi bổ sức khỏe, dưỡng nhan" />
                                                </div>
                                                <div className="swiper-slide swiper-slide-visible" data-hash="2" role="group" aria-label="3 / 4" style={{ height: "111.5px", marginBottom: "10px" }}>
                                                    <img src="/img/1.2.webp" alt="Set quà 2010 – Maneli #1 bồi bổ sức khỏe, dưỡng nhan" />
                                                </div>
                                                <div className="swiper-slide swiper-slide-visible" data-hash="3" role="group" aria-label="4 / 4" style={{ height: "111.5px", marginBottom: "10px" }}>
                                                    <img src="/img/1.3.webp" alt="Set quà 2010 – Maneli #1 bồi bổ sức khỏe, dưỡng nhan" />
                                                </div> */}
                                            </div>
                                            {/* <!-- Navigation --> */}
                                            <div className="swiper-button-next swiper-button-disabled swiper-button-lock" tabIndex={-1} role="button" aria-label="Next slide" aria-controls="swiper-wrapper-db10af86476757f58" aria-disabled="true"></div>
                                            <div className="swiper-button-prev swiper-button-disabled swiper-button-lock" tabIndex={-1} role="button" aria-label="Previous slide" aria-controls="swiper-wrapper-db10af86476757f58" aria-disabled="true"></div>
                                            <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- thumbnail starts --> */}
                            <div className="col-lg-6 col-md-12 col-12 details-pro">
                                <h1 className="title-product">{product.name}</h1>
                                <span className="variant-sku">Mã: <span className="a-sku">{product.id}</span></span>
                                <div className="inventory_quantity">
                                    <span className="mb-break">
                                        <span className="stock-brand-title">Thương hiệu:</span>
                                        <span className="a-vendor">
                                            {product.category.name}
                                        </span>
                                    </span>
                                    <span className="line">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                                    <span className="mb-break">
                                        <span className="stock-brand-title">Tình trạng:</span>
                                        <span className="a-stock">
                                            {product.stock_quantity > 0 ? "Còn hàng" : "Hết hàng"}
                                        </span>
                                    </span>
                                </div>
                                {/* <!-- form start --> */}
                                <form encType="multipart/form-data" data-cart-form="" id="add-to-cart-form" action="" method="post" className="form-inline">
                                    <div className="product-summary">
                                        <div className="rte">
                                            <ul>
                                                <li>Cực kỳ ý nghĩa và giá trị giúp chăm sóc sức khỏe, sắc đẹp người nhận
                                                    mỗi ngày
                                                </li>
                                                <li>&nbsp;Không lãng phí, không đại trà</li>
                                                <li>&nbsp;Món quà thể hiện sự quan tâm chân thành</li>
                                                <li>&nbsp;Túi hộp thiết kế vô cùng sang trọng, thể hiện sự chỉn chu tinh
                                                    tế khi tặng
                                                    quà</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <span className="sale" style={{ display: "none" }}>
                                        <Link className="block-flashsale sale" href="sanpham.html" title="Xem ngay">
                                            <div className="heading-flash">
                                                {/* <!-- icon lửa --> */}
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
                                                {/* <!-- icon lửa --> */}
                                                Hot sale năm mới
                                            </div>
                                            {/* <!-- times --> */}

                                            <div className="count-down">
                                                <p className="title-count">
                                                    Kết thúc sau:
                                                </p>
                                                <div className="timer-view" id="countdown">
                                                    <div className="block-timer">
                                                        <p id="days" style={{ fontWeight: "bold" }}>-183</p><span>Ngày</span>
                                                    </div>
                                                    <div className="block-timer">
                                                        <p id="hours" style={{ fontWeight: "bold" }}>-14</p><span>Giờ</span>
                                                    </div>
                                                    <div className="block-timer">
                                                        <p id="minutes" style={{ fontWeight: "bold" }}>-4</p><span>Phút</span>
                                                    </div>
                                                    <div className="block-timer">
                                                        <p id="seconds" style={{ fontWeight: "bold" }}>-4</p><span>Giây</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </Link>
                                    </span>

                                    <div className="price-box clearfix">
                                        <span className="special-price">
                                            <span className="price product-price">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                                            <meta itemProp="price" content="{product.price}" />
                                            <meta itemProp="priceCurrency" content="VND" />
                                        </span>
                                        {/* <!-- Giá Khuyến mại --> */}
                                        <span className="old-price" itemProp="priceSpecification" itemType="http://schema.org/priceSpecification">
                                            <del className="price product-price-old">
                                                {Number(product.discount_price).toLocaleString('vi-VN')}đ
                                            </del>
                                            <meta itemProp="price" content="799000" />
                                            <meta itemProp="priceCurrency" content="VND" />
                                        </span>
                                        {/* <!-- Giás gốc --> */}
                                        <span className="sale-off">-
                                            37%
                                        </span>
                                    </div>
                                    <div className="form-product">
                                        {/* <div className="box-variant clearfix  d-none ">
                                            <input type="hidden" id="one_variant" name="variantId" defaultValue="Giá trị ban đầu" />
                                        </div> */}
                                        <div className="boz-form ">
                                            <div className="flex-quantity">
                                                <div className="custom custom-btn-number show">
                                                    <span>Số lượng: </span>
                                                    <div className="input_number_product">
                                                        <button
                                                            className="btn_num num_1 button button_qty"
                                                            onClick={() => {
                                                                const result = document.getElementById('qtym') as HTMLInputElement | null;
                                                                if (result) {
                                                                    const qtypro = parseInt(result.value, 10);
                                                                    if (!isNaN(qtypro) && qtypro > 1) {
                                                                        result.value = String(qtypro - 1);
                                                                    }
                                                                }
                                                            }}
                                                            type="button"
                                                        >
                                                            -
                                                        </button>
                                                        <input type="text" id="qtym" name="quantity" defaultValue="1" readOnly min="1" maxLength={3} className="form-control prd_quantity" />
                                                        <button
                                                            className="btn_num num_2 button button_qty"
                                                            onClick={() => {
                                                                const result = document.getElementById('qtym') as HTMLInputElement | null;
                                                                if (result) {
                                                                    const qtypro = parseInt(result.value, 10);
                                                                    if (!isNaN(qtypro)) {
                                                                        result.value = String(qtypro + 1);
                                                                    }
                                                                }
                                                            }}
                                                            type="button"
                                                        >
                                                            <span>+</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="btn-mua button_actions clearfix">
                                                    <button className="btn-buyNow btn btn-primary" type="button" >
                                                        <span className="txt-main">Mua ngay</span>
                                                    </button>
                                                    <AddToCart product={product} onAddToCart={(product) => setSelectedProduct(product)} />

                                                    {/* <button type="submit" name="themgh" className="btn btn_base normal_button btn_add_cart add_to_cart btn-cart btn-extent is-added">
                                                        <span className="txt-main">Thêm vào giỏ</span>
                                                    </button> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                {/* <!-- form start --> */}
                                <div className="bottom-product">
                                    <ul className="social-media" role="list">
                                        <li className="title">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-share" viewBox="0 0 16 16">
                                                <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3">
                                                </path>
                                            </svg>
                                            Chia sẻ
                                        </li>
                                        <li className="social-media__item social-media__item--facebook">
                                            <Link title="Chia sẻ lên Facebook" href="#" target="_blank" rel="noopener" aria-label="Chia sẻ lên Facebook">
                                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 155.139 155.139" xmlSpace="preserve">
                                                    <g>
                                                        <path id="f_1_" style={{ fill: "#010002" }} d="M89.584,155.139V84.378h23.742l3.562-27.585H89.584V39.184 c0-7.984,2.208-13.425,13.67-13.425l14.595-0.006V1.08C115.325,0.752,106.661,0,96.577,0C75.52,0,61.104,12.853,61.104,36.452 v20.341H37.29v27.585h23.814v70.761H89.584z">
                                                        </path>
                                                    </g>
                                                </svg>
                                            </Link>
                                        </li>
                                        <li className="social-media__item social-media__item--pinterest">
                                            <Link title="Chia sẻ lên Pinterest" href="#&amp;" target="_blank" rel="noopener" aria-label="Pinterest">
                                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 511.977 511.977" xmlSpace="preserve">
                                                    <g>
                                                        <g>
                                                            <path d="M262.948,0C122.628,0,48.004,89.92,48.004,187.968c0,45.472,25.408,102.176,66.08,120.16 c6.176,2.784,9.536,1.6,10.912-4.128c1.216-4.352,6.56-25.312,9.152-35.2c0.8-3.168,0.384-5.92-2.176-8.896 c-13.504-15.616-24.224-44.064-24.224-70.752c0-68.384,54.368-134.784,146.88-134.784c80,0,135.968,51.968,135.968,126.304 c0,84-44.448,142.112-102.208,142.112c-31.968,0-55.776-25.088-48.224-56.128c9.12-36.96,27.008-76.704,27.008-103.36 c0-23.904-13.504-43.68-41.088-43.68c-32.544,0-58.944,32.224-58.944,75.488c0,27.488,9.728,46.048,9.728,46.048 S144.676,371.2,138.692,395.488c-10.112,41.12,1.376,107.712,2.368,113.44c0.608,3.168,4.16,4.16,6.144,1.568 c3.168-4.16,42.08-59.68,52.992-99.808c3.968-14.624,20.256-73.92,20.256-73.92c10.72,19.36,41.664,35.584,74.624,35.584 c98.048,0,168.896-86.176,168.896-193.12C463.62,76.704,375.876,0,262.948,0z">
                                                            </path>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </Link>
                                        </li>
                                        <li className="social-media__item social-media__item--twitter">
                                            <Link title="Chia sẻ lên Twitter" href="#" target="_blank" rel="noopener" aria-label="Tweet on Twitter">
                                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve">
                                                    <g>
                                                        <g>
                                                            <path d="M512,97.248c-19.04,8.352-39.328,13.888-60.48,16.576c21.76-12.992,38.368-33.408,46.176-58.016 c-20.288,12.096-42.688,20.64-66.56,25.408C411.872,60.704,384.416,48,354.464,48c-58.112,0-104.896,47.168-104.896,104.992 c0,8.32,0.704,16.32,2.432,23.936c-87.264-4.256-164.48-46.08-216.352-109.792c-9.056,15.712-14.368,33.696-14.368,53.056 c0,36.352,18.72,68.576,46.624,87.232c-16.864-0.32-33.408-5.216-47.424-12.928c0,0.32,0,0.736,0,1.152 c0,51.008,36.384,93.376,84.096,103.136c-8.544,2.336-17.856,3.456-27.52,3.456c-6.72,0-13.504-0.384-19.872-1.792 c13.6,41.568,52.192,72.128,98.08,73.12c-35.712,27.936-81.056,44.768-130.144,44.768c-8.608,0-16.864-0.384-25.12-1.44 C46.496,446.88,101.6,464,161.024,464c193.152,0,298.752-160,298.752-298.688c0-4.64-0.16-9.12-0.384-13.568 C480.224,136.96,497.728,118.496,512,97.248z">
                                                            </path>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </Link>
                                        </li>
                                    </ul>
                                    <div className="line"></div>
                                    <div className="product-wish">
                                        <Link href="javascript:void(0)" className="setWishlist btn-views" data-wish="set-qua-2010-maneli-1-boi-bo-suc-khoe-duong-nhan" tabIndex={0} title="Thêm vào yêu thích">
                                            <img width="25" height="25" src="/img/heart.webp" alt="Thêm vào yêu thích" />
                                            Thêm vào yêu thích
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 product-coupons margin-bottom-20">
                            <div className="bg-shadow">
                                <div className="title">Khuyến mãi dành cho bạn</div>
                                <div className="swiper_coupons swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events">
                                    <div className="swiper-wrapper">
                                        {coupons?.map((coupon: any) => (
                                            <div className="swiper-slide" key={coupon.id} style={{ width: '295.75px', marginRight: '16px' }}>
                                                <div className="box-coupon">
                                                    <div className="mask-ticket">

                                                    </div>
                                                    <div className="image">
                                                        <img width="88" height="88" src="/img/img_coupon_1.webp" alt={coupon.code} />
                                                    </div>
                                                    <div className="content_wrap">
                                                        <a title="Chi tiết" href="javascript:void(0)" className="info-button" data-coupon="NEST200" data-time="12/12/2024">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                                                                <path d="M144 80c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z">
                                                                </path>
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
                                                                key={coupon.id}
                                                                onClick={() => handleSaveCoupon(coupon.id, coupon.code)}
                                                                className={`coupon-code js-copy ${savedCoupons.includes(coupon.id) ? 'saved' : ''}`}
                                                                title="Click để lưu/copy lại"
                                                            >
                                                                {savedCoupons.includes(coupon.id) ? "Copy mã" : "Lưu mã"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                    <div className="swiper-button-prev swiper-button-disabled swiper-button-lock">
                                        <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="2.13003" y="29" width="38" height="38" transform="rotate(-45 2.13003 29)" stroke="black" fill="#fff" strokeWidth="2"></rect>
                                            <rect x="8" y="29.2133" width="30" height="30" transform="rotate(-45 8 29.2133)" fill="black"></rect>
                                            <path d="M18.5 29H39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M29 18.5L39.5 29L29 39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                    <div className="swiper-button-next swiper-button-disabled swiper-button-lock">
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
                            {/* <div className="popup-coupon active">
                                <div className="content">
                                    <div className="title">
                                        Thông tin voucher
                                    </div>
                                    <div className="close-popup-coupon" title="Đóng">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512.001 512.001" xmlSpace="preserve">
                                            <g>
                                                <g>
                                                    <path d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717    L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859    c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287    l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285    L284.286,256.002z">
                                                    </path>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                    <ul>
                                        <li>
                                            <span>Mã giảm giá:</span>
                                        <span className="code">
                                            {coupons.code}
                                            </span>
                                        </li>
                                        <li>
                                            <span>Ngày hết hạn:</span>
                                            <span className="time">
                                            {coupons.end_at}

                                            </span>
                                        </li>
                                        <li>
                                            <span>Điều kiện:</span>
                                        <span className="dieukien">
                                            {coupons.description || "Không có mô tả"}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div> */}

                        <div className="col-12 margin-bottom-20">
                            <div className="bg-shadow">
                                <div className="row">
                                    <div className="col-12 product-review-details  col-lg-8">
                                        <div className="product-tab e-tabs not-dqtab">
                                            <ul className="tabs tabs-title clearfix">

                                                {tabs.map(tab => (
                                                    <li key={tab.id} className={`tab-link ${activeTab === tab.id ? 'active' : ''}`} data-tab={tab.id} onClick={() => setActiveTab(tab.id)} >
                                                        <h3>{tab.title}</h3>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="tab-float">
                                                <div id="tab-1" className={`tab-content  content_extab ${activeTab === '#tab-1' ? 'active' : ''}`}>
                                                    <div className="rte product_getcontent product-review-content">
                                                        <div className="ba-text-fpt has-height">
                                                            <p></p><p>Chọn quà tặng đã khó, chọn một món quà cho mẹ còn khó hơn. Với mẹ, một món quà chẳng cần đắt đỏ, xa xỉ, mà phải thật sự thành tâm và ý nghĩa. Đó cũng là lý do những set quà tặng sức khỏe như Maneli #1 từ Saffron VIETNAM luôn được lòng rất nhiều anh chị khách hàng, bởi lúc nào cũng “đong đầy” sức khỏe, thứ mà ai cũng cần, ai cũng quý.</p><h2>I. THÀNH PHẦN SET</h2>
                                                            <ul>
                                                                <li>Saffron Shyam1gr: Thảo dược “”vàng đỏ”” quý giá từ Trung Đông, có thể sử dụng pha trà uống hằng ngày giúp ngủ ngon, thư giãn, thanh nhiệt thải độc cơ thể, tốt cho tim mạch, huyết áp.</li>
                                                                <li>Trà Healthy Tea 7 gói: &nbsp; &nbsp;Mix 6 nguyên liệu thảo mộc bồi bổ sức khỏe: kỷ tử, táo đỏ, long nhãn, hoa cúc, hoa hồng, cỏ ngọt. Hương vị thơm ngọt tự nhiên nhẹ nhàng.</li>
                                                                <li>Mật ong hoa rừng 100ml:Mật ong nguyên chất đặc sánh giàu dưỡng chất kháng viêm, bồi bổ sức khỏe.</li>
                                                                <li>Túi quà kèm nơ: Hộp và túi qua cao cấp kèm nơ tinh tế, trang trọng.</li>
                                                                <li>Thiệp 20/10: Thiệp chúc 20/10 được thiết kế riêng.</li>
                                                            </ul><p><img loading="lazy" className="img-responsive" src="https://via.placeholder.com/600x400" alt="Product Image" />
                                                            </p></div>
                                                    </div>
                                                </div>
                                                <div id="tab-2" className={`tab-content  content_extab ${activeTab === '#tab-2' ? 'active' : ''}`}>
                                                    <div className="rte">

                                                        <p><strong>Bước 1</strong>: Truy cập website và lựa chọn sản
                                                            phẩm cần mua để
                                                            mua hàng</p>
                                                        <p><strong>Bước 2</strong>: Click và sản phẩm muốn mua, màn hình
                                                            hiển thị ra
                                                            pop up với các lựa chọn sau</p>
                                                        <p>Nếu bạn muốn tiếp tục mua hàng: Bấm vào phần tiếp tục mua
                                                            hàng để lựa
                                                            chọn thêm sản phẩm vào giỏ hàng</p>
                                                        <p>Nếu bạn muốn xem giỏ hàng để cập nhật sản phẩm: Bấm vào xem
                                                            giỏ hàng</p>
                                                        <p>Nếu bạn muốn đặt hàng và thanh toán cho sản phẩm này vui lòng
                                                            bấm vào:
                                                            Đặt hàng và thanh toán</p>
                                                        <p><strong>Bước 3</strong>: Lựa chọn thông tin tài khoản thanh
                                                            toán</p>
                                                        <p>Nếu bạn đã có tài khoản vui lòng nhập thông tin tên đăng nhập
                                                            là email và
                                                            mật khẩu vào mục đã có tài khoản trên hệ thống</p>
                                                        <p>Nếu bạn chưa có tài khoản và muốn đăng ký tài khoản vui lòng
                                                            điền các
                                                            thông tin cá nhân để tiếp tục đăng ký tài khoản. Khi có tài
                                                            khoản bạn sẽ
                                                            dễ dàng theo dõi được đơn hàng của mình</p>
                                                        <p>Nếu bạn muốn mua hàng mà không cần tài khoản vui lòng nhấp
                                                            chuột vào mục
                                                            đặt hàng không cần tài khoản</p>
                                                        <p><strong>Bước 4</strong>: Điền các thông tin của bạn để nhận
                                                            đơn hàng, lựa
                                                            chọn hình thức thanh toán và vận chuyển cho đơn hàng của
                                                            mình</p>
                                                        <p><strong>Bước 5</strong>: Xem lại thông tin đặt hàng, điền chú
                                                            thích và
                                                            gửi đơn hàng</p>
                                                        <p>Sau khi nhận được đơn hàng bạn gửi chúng tôi sẽ liên hệ bằng
                                                            cách gọi
                                                            điện lại để xác nhận lại đơn hàng và địa chỉ của bạn.</p>
                                                        <p>Trân trọng cảm ơn.</p>
                                                    </div>
                                                </div>
                                                <div id="tab-3" className={`tab-content  content_extab ${activeTab === '#tab-3' ? 'active' : ''}`}>
                                                    <div className="rte">
                                                        {/* <!-- Review Section --> */}
                                                        <div className="comment-alt ">
                                                            <h2 className="title-text">Đánh Giá Sản Phẩm :</h2>
                                                            {/* <!-- Overall Rating --> */}
                                                            <div className="d-flex align-items-center mb-3">
                                                                <div className="text-warning me-2">
                                                                    {Array.from({ length: fullStars }).map((_, i) => (
                                                                        <i key={`full-${i}`} className="fas fa-star"></i>
                                                                    ))}

                                                                    {hasHalfStar && <i className="fas fa-star-half-alt"></i>}

                                                                    {Array.from({ length: emptyStars }).map((_, i) => (
                                                                        <i key={`empty-${i}`} className="far fa-star"></i>
                                                                    ))}
                                                                </div>

                                                                <span className="text-muted ms-2">
                                                                    {averageRating} / 5 ({reviews.length} đánh giá)
                                                                </span>
                                                            </div>

                                                            <p className="text-muted mb-4">Hình Ảnh Từ Người Mua</p>
                                                            {/* <!-- Review 1 --> */}
                                                            {reviews.map((review) => {
                                                                console.log(review);
                                                                return (<>
                                                                    <div key={review.id} className="user-review mb-4">
                                                                        <div className="d-flex align-items-center mb-2">
                                                                            <img
                                                                                src="/img/facebook_2.svg"
                                                                                alt={review.user.avatar}
                                                                                className="rounded-circle"
                                                                                width="50"
                                                                                height="50"
                                                                            />
                                                                            <div className="ms-3">
                                                                                <div className="text-user">{review.user.name}</div>
                                                                                <div className="text-warning">
                                                                                    {Array.from({ length: review.rating }).map((_, i) => (
                                                                                        <i key={i} className="fas fa-star"></i>
                                                                                    ))}
                                                                                    {Array.from({ length: 5 - review.rating }).map((_, i) => (
                                                                                        <i key={i} className="far fa-star"></i>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <p className="mb-0">
                                                                            <strong>Tên Sản Phẩm:</strong> Sản phẩm #{review.product_id}
                                                                        </p>

                                                                        <p className="mb-3">
                                                                            <strong>Mô Tả:</strong> {review.comment}
                                                                        </p>

                                                                        {review.images?.length > 0 && (
                                                                            <div className="d-flex gap-2 mb-2">
                                                                                {review.images.map((img: { image_path: string }, idx: number) => (
                                                                                    <img
                                                                                        key={idx}
                                                                                        src={img.image_path}
                                                                                        alt={`Ảnh ${idx + 1}`}
                                                                                        className="mr-3 image-anh"
                                                                                        width="100px"
                                                                                        height="100px"
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                        )}


                                                                        <button className="btn-report" onClick={() => handleReport(review.id)}>
                                                                            <i className="fas fa-flag me-1"></i> Báo cáo
                                                                        </button>

                                                                    </div></>)
                                                            }

                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-12 product-sidebar">
                                        <div className="sticky-box">
                                            <div className="section-viewed-product recent-page-viewed">
                                                <h2>
                                                    <span>
                                                        Bạn đã xem
                                                    </span>
                                                </h2>
                                                <div className="product-viewed-content">
                                                    {history.map((product) => (
                                                        <div className="product-view" key={product.id}>
                                                            <Link className="image_thumb" href={`/product/${product.id}`} title="Tổ Yến Tinh Chế VIP Loại 1">
                                                                <img width="370" height="480" className="lazyload loaded" src={`http://localhost:8000/storage/products/${product.image}`} alt={product.name} data-was-processed="true" />
                                                            </Link>
                                                            <div className="product-info">
                                                                <h3 className="product-name"><Link href={`/product/${product.id}`} title="Tổ Yến Tinh Chế VIP Loại 1" className="line-clamp line-clamp-3-new">{product.name}</Link></h3>
                                                                <div className="price-box">
                                                                    <span className="price">{Number(product.price).toLocaleString("vi-VN")}₫</span>
                                                                    <span className="compare-price">{Number(product.discount_price).toLocaleString('vi-VN')}đ</span>
                                                                </div>
                                                                <Link className="view-more" href={`/product/${product.id}`} title="Xem chi tiết">Xem chi tiết »</Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {/* <!-- sp2 --> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* <!-- ends --> */}


                        <div className="col-12 product-related product-swipers">
                            <div className="bg-shadow">
                                <h2>
                                    <Link href="/my-pham-saffron" title="Sản phẩm liên quan">
                                        Sản phẩm liên quan
                                    </Link>
                                </h2>
                                <div className="swiper_product_related swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events swiper-initialized swiper-horizontal swiper-backface-hidden">
                                    <div className="swiper-wrapper" style={{ transform: 'translate3d(0px, 0px, 0px)', transitionDuration: '0ms', }} id="swiper-wrapper-45eac8a6d77c6525" aria-live="polite">

                                        {relatedProducts.map((item: Product) => (
                                            <div
                                                className="swiper-slide swiper-slide-active"
                                                style={{ width: '292.75px', marginRight: '20px' }}
                                                role="group"
                                                aria-label="1 / 6"
                                                key={item.id}
                                            >
                                                <div className="item_product_main">
                                                    <form className="variants product-action item-product-main duration-300" encType="multipart/form-data">
                                                        <div className="product-thumbnail">
                                                            <Link
                                                                className="image_thumb scale_hover"
                                                                href={`/product/${item.id}`}
                                                                title={item.name}
                                                            >
                                                                <img
                                                                    className="# duration-300"
                                                                    src={item.image ? `http://localhost:8000/storage/products/${item.image}` : "/img/sp3.webp"}
                                                                    alt={item.name}
                                                                />
                                                            </Link>
                                                        </div>
                                                        <div className="product-info">
                                                            <div className="name-price">
                                                                <h3 className="product-name line-clamp-2-new">
                                                                    <Link href={`/product/${item.id}`} title={item.name}>
                                                                        {item.name}
                                                                    </Link>
                                                                </h3>
                                                                <div className="product-price-cart">
                                                                    <span className="price">{Number(item.price).toLocaleString("vi-VN")}₫</span>
                                                                </div>
                                                            </div>
                                                            <div className="product-button">
                                                                <div style={{ marginBottom: '0px !important' }}>
                                                                    <AddToCart product={product} onAddToCart={(product) => setSelectedProduct(product)} />
                                                                </div>
                                                                <Link
                                                                    href="javascript:void(0)"
                                                                    className="setWishlist btn-views btn-circle"
                                                                    data-wish={item.name}
                                                                    tabIndex={0}
                                                                    title="Thêm vào yêu thích"
                                                                >
                                                                    <img width="25" height="25" src="/img/heart.webp" alt="Thêm vào yêu thích" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        ))}
                                        {/* heets */}
                                    </div>
                                    <div className="swiper-button-next" tabIndex={0} role="button" aria-label="Next slide" aria-controls="swiper-wrapper-45eac8a6d77c6525" aria-disabled="false">
                                        <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="2.13003" y="29" width="38" height="38" transform="rotate(-45 2.13003 29)" stroke="black" fill="#fff" strokeWidth="2"></rect>
                                            <rect x="8" y="29.2133" width="30" height="30" transform="rotate(-45 8 29.2133)" fill="black"></rect>
                                            <path d="M18.5 29H39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M29 18.5L39.5 29L29 39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                    <div className="swiper-button-prev swiper-button-disabled" tabIndex={-1} role="button" aria-label="Previous slide" aria-controls="swiper-wrapper-45eac8a6d77c6525" aria-disabled="true">
                                        <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="2.13003" y="29" width="38" height="38" transform="rotate(-45 2.13003 29)" stroke="black" fill="#fff" strokeWidth="2"></rect>
                                            <rect x="8" y="29.2133" width="30" height="30" transform="rotate(-45 8 29.2133)" fill="black"></rect>
                                            <path d="M18.5 29H39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M29 18.5L39.5 29L29 39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                    <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            {selectedProduct && (
                <CartModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
            {showReportAlert && (
                <div
                    id="js-global-alert"
                    className="alert alert-danger alert-dismissible fade show active"
                    role="alert"
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        zIndex: 9999,
                        minWidth: "320px",
                    }}
                >
                    <button type="button" className="close" aria-label="Close"
                        onClick={() => setShowReportAlert(false)}
                    >x</button>
                    <h5 className="alert-heading mb-1">
                        <i className="fas fa-flag me-2 text-danger"></i> Đã gửi báo cáo
                    </h5>
                    <p className="alert-content mb-0" style={{ fontSize: '14px' }}>
                        Cảm ơn bạn đã báo cáo đánh giá này. Chúng tôi sẽ xem xét sớm nhất.
                    </p>
                </div>
            )}

        </>

    )
};

