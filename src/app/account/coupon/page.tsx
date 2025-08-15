'use client';
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getCoupons, saveCoupon } from "@/app/lib/Coupon";
import { usePopup } from "@/app/context/PopupContext";
import { Coupon } from "@/app/types/coupon";
import { useRouter } from "next/navigation";
import '@/app/styles/product-detail.css';
import '@/app/styles/coupon_detail.css';
import Navbar from "@/app/navbar/page";

export default function CouponsPage() {
    const { setIsOpen, setSelectedCoupon } = usePopup();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [saved, setSaved] = useState<number[]>([]);
    const [q, setQ] = useState("");
    const [onlyFreeShip, setOnlyFreeShip] = useState(false);
    const [typeFilter, setTypeFilter] = useState("");
    const [scopeFilter, setScopeFilter] = useState("");
    const [minDiscount, setMinDiscount] = useState(0);
    const [sortBy, setSortBy] = useState("");
    const [loading, setLoading] = useState(true);


    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const list = await getCoupons();
                setCoupons(list);
            } catch (e: any) {
                toast.error(e?.response?.data?.message || "Không tải được danh sách mã");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        return coupons.filter(c => {
            const textOk =
                !q ||
                c.code.toLowerCase().includes(q.toLowerCase()) ||
                (c.description || "").toLowerCase().includes(q.toLowerCase());

            const typeOk = !typeFilter || c.type === typeFilter;
            const scopeOk = !scopeFilter || c.scope === scopeFilter;
            const freeShipOk = !onlyFreeShip || c.free_shipping;

            const discountValue =
                c.total_discount || c.product_discount || c.shipping_discount || 0;
            const minDiscountOk = discountValue >= minDiscount;

            return textOk && typeOk && scopeOk && freeShipOk && minDiscountOk;
        });
    }, [coupons, q, typeFilter, scopeFilter, onlyFreeShip, minDiscount]);

    const sorted = useMemo(() => {
        let arr = [...filtered];
        if (sortBy === "newest") {
            arr.sort((a, b) => b.id - a.id);
        } else if (sortBy === "highest") {
            arr.sort((a, b) => {
                const valA =
                    a.total_discount || a.product_discount || a.shipping_discount || 0;
                const valB =
                    b.total_discount || b.product_discount || b.shipping_discount || 0;
                return valB - valA;
            });
        } else if (sortBy === "shipFirst") {
            arr.sort((a, b) => Number(b.free_shipping) - Number(a.free_shipping));
        }
        return arr;
    }, [filtered, sortBy]);

    async function handleSave(coupon: Coupon) {
        try {
            let res;
            if (!saved.includes(coupon.id)) {
                res = await saveCoupon(coupon.id);
                setSaved(prev => [...prev, coupon.id]);
            }
            await navigator.clipboard.writeText(coupon.code);
            toast.success(res?.message || "Đã lưu & copy mã");
        } catch (e: any) {
            if (e?.response?.data?.message === "Coupon already saved") {
                await navigator.clipboard.writeText(coupon.code);
                toast.success("Mã đã lưu trước đó & copy lại");
            } else {
                toast.error(e?.response?.data?.message || "Lưu mã thất bại");
            }
        }
    }


    async function handleUseNow(coupon: Coupon) {
        try {
            if (!saved.includes(coupon.id)) {
                await saveCoupon(coupon.id);
                setSaved(prev => [...prev, coupon.id]);
            }
            router.push(`/checkout?coupon_code=${encodeURIComponent(coupon.code)}`);
        } catch (e: any) {
            if (e?.response?.data?.message === "Coupon already saved") {
                router.push(`/checkout?coupon_code=${encodeURIComponent(coupon.code)}`);
            } else {
                toast.error(e?.response?.data?.message || "Không thể dùng ngay mã này");
            }
        }
    }

    return (
            <section className="signup page_customer_account">
                <div className="container">
                    <div className="row">
                        <Navbar />
                        <div className="col-xs-12 col-sm-12 col-lg-9 col-right-ac">                                 
                            <div className="bg-shadow">
                                <h1 className="title-head margin-top-0">Khuyến mãi dành cho bạn</h1>
                                <div className="promo-row">
                                    <div className="promo-col">
                                        <div className="input-group-custom">
                                            <input type="text" id="qInput" placeholder="Tìm mã..." aria-label="Tìm mã" value={q} onChange={(e) => setQ(e.target.value)} />
                                            <div className="input-icon" aria-hidden="true"><i className="fas fa-search"></i></div>
                                        </div>
                                    </div>
                                    <div className="promo-col">
                                        <div className="input-group-custom">
                                            <input type="number" id="minDiscountInput" placeholder="Giảm tối thiểu" aria-label="Giảm tối thiểu" min="0" value={minDiscount} onChange={(e) => setMinDiscount(Number(e.target.value))} />
                                            <div className="input-icon" aria-hidden="true"><i className="fas fa-percent"></i></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="filters-row">
                                    <select id="typeFilter" className="filter-select" aria-label="Chọn loại khuyến mãi" onChange={(e) => setTypeFilter(e.target.value)}>
                                        <option value="">Tất cả loại</option>
                                        <option value="percent">% giảm</option>
                                        <option value="fixed">Số tiền cố định</option>
                                    </select>
                                    <select id="scopeFilter" className="filter-select" aria-label="Chọn phạm vi khuyến mãi" onChange={(e) => setScopeFilter(e.target.value)}>
                                        <option value="">Tất cả phạm vi</option>
                                        <option value="order">Toàn đơn</option>
                                        <option value="product">Sản phẩm</option>
                                        <option value="category">Danh mục</option>
                                        <option value="shipping">Vận chuyển</option>
                                    </select>
                                    <select id="sortBy" className="filter-select" aria-label="Sắp xếp khuyến mãi" onChange={(e) => setSortBy(e.target.value)}>
                                        <option value="">Mặc định</option>
                                        <option value="newest">Mới nhất</option>
                                        <option value="highest">Giảm nhiều nhất</option>
                                        <option value="shipFirst">Ưu đãi ship trước</option>
                                    </select>
                                    <label className="checkbox-wrapper" htmlFor="freeShipCheck" aria-hidden="true"  >
                                        <input type="checkbox" id="freeShipCheck" checked={onlyFreeShip} onChange={(e) => setOnlyFreeShip(e.target.checked)} />
                                        <span style={{ cursor: "pointer" , marginLeft: "25px"}}>Chỉ free ship</span>
                                    </label>
                                </div>
                            </div>
                            <div className="bg-shadow">
                                <div className="row">
                                    <div className="col-12 product-coupons margin-bottom-20">
                                        <div className="bg-shadow">
                                            {/* <div className="title"></div> */}
                                            <div
                                                className="swiper_coupons swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events">
                                                <div className="swiper-wrapper_coupon_wrapper" style={{
                                                    transform: "translate3d(0px, 0px, 0px)"
                                                }}>
                                                    {loading ? (
                                                        <div
                                                            className="d-flex justify-content-center align-items-center">
                                                            <div className="spinner-border" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                            sorted.map(coupon => (
                                                                <div className="swiper-slide swiper-slide-active" style={{
                                                                    width: "290.75px", marginRight: "2px",
                                                                    marginBottom: "20px"
                                                                }} key={coupon.id}>
                                                                    <div className="box-coupon">
                                                                    <div className="mask-ticket">
                                                                    </div>
                                                                    <div className="image">
                                                                        <img width="88" height="88"
                                                                            className="lazyload loaded"
                                                                            src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/img_coupon_1.jpg?1739018973665"
                                                                            data-src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/img_coupon_1.jpg?1739018973665"
                                                                            alt="NEST200" data-was-processed="true" />
                                                                    </div>
                                                                    <div className="content_wrap">
                                                                        <a title="Chi tiết" className="info-button"
                                                                            onClick={() => {
                                                                                setSelectedCoupon({
                                                                                    id: coupon.id,
                                                                                    code: coupon.code,
                                                                                    end_at: coupon.end_at,
                                                                                    description: coupon.description,
                                                                                });
                                                                                setIsOpen(true);
                                                                            }}>
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 192 512">
                                                                                <path
                                                                                    d="M144 80c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z">
                                                                                </path>
                                                                            </svg>
                                                                        </a>
                                                                        <div className="content-top">
                                                                            {coupon.code || "Không có mô tả"}
                                                                            <span
                                                                                className="line-clamp line-clamp-2">{coupon.description
                                                                                    || "Không có mô tả"}</span>
                                                                        </div>
                                                                        <div className="content-bottom">
                                                                            <div onClick={() => handleSave(coupon)}
                                                                                className={`coupon-code js-copy
                                                                            ${saved.includes(coupon.id) ? 'saved' :
                                                                                        ''}`}
                                                                                title="Lưu về tài khoản và copy mã"
                                                                            >
                                                                                {saved.includes(coupon.id) ? "lưu" : "Copy"}
                                                                            </div>
                                                                            <div onClick={() => handleUseNow(coupon)}
                                                                                className={`coupon-code js-copy
                                                                            ${saved.includes(coupon.id) ? 'saved' :
                                                                                        ''}`}
                                                                                title="Click để lưu/copy lại"
                                                                                style={{ backgroundColor: "#d0a73c" }}
                                                                            >
                                                                                Dùng ngay
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        ))
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>
            </section>
    );
}
