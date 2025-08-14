// app/coupons/page.tsx (hoặc component CouponsPage)
'use client';
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getCoupons, saveCoupon, buildCodeToIdMap, formatCoupon } from "@/app/lib/Coupon";
import { Coupon } from "@/app/types/coupon";
import { useRouter } from "next/navigation";
import '@/app/styles/product-detail.css';
import Navbar from "@/app/navbar/page";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [saved, setSaved] = useState<number[]>([]); // id đã lưu (đánh dấu UI)
    const [q, setQ] = useState("");
    const [onlyFreeShip, setOnlyFreeShip] = useState(false);
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

    const codeToId = useMemo(() => buildCodeToIdMap(coupons), [coupons]);

    const filtered = useMemo(() => {
        const kw = q.trim().toLowerCase();
        return coupons.filter(c => {
            const okText = !kw || c.code.toLowerCase().includes(kw) || (c.description || "").toLowerCase().includes(kw);
            const okShip = !onlyFreeShip || c.free_shipping;
            return okText && okShip;
        });
    }, [coupons, q, onlyFreeShip]);
    async function handleSave(coupon: Coupon) {
        try {
            let res;
            if (!saved.includes(coupon.id)) {
                res = await saveCoupon(coupon.id);
                setSaved(prev => [...prev, coupon.id]);
            }
            // Luôn copy mã, kể cả đã lưu
            await navigator.clipboard.writeText(coupon.code);
            toast.success(res?.message || "Đã lưu & copy mã");
        } catch (e: any) {
            // Nếu lỗi là coupon đã lưu thì vẫn copy mã & báo thành công
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
            // Nếu chưa lưu thì mới gọi API
            if (!saved.includes(coupon.id)) {
                await saveCoupon(coupon.id);
                setSaved(prev => [...prev, coupon.id]);
            }
            // Chuyển sang checkout
            router.push(`/checkout?coupon_code=${encodeURIComponent(coupon.code)}`);
        } catch (e: any) {
            // Nếu đã lưu rồi vẫn cho chuyển trang
            if (e?.response?.data?.message === "Coupon already saved") {
                router.push(`/checkout?coupon_code=${encodeURIComponent(coupon.code)}`);
            } else {
                toast.error(e?.response?.data?.message || "Không thể dùng ngay mã này");
            }
        }
    }

    return (
        <>
            <section className="signup page_customer_account">
                <div className="container">
                    <div className="row">
                        <Navbar />
                        <div className="col-xs-12 col-sm-12 col-lg-9 col-right-ac">
                            <div className="bg-shadow">
                                <div className="d-flex gap-3 mb-4">
                                    <input
                                        className="form-control"
                                        placeholder="Tìm theo mã hoặc mô tả…"
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                    />
                                    <label className="d-flex align-items-center gap-2">
                                        <input type="checkbox" checked={onlyFreeShip} onChange={(e) => setOnlyFreeShip(e.target.checked)} />
                                        Chỉ hiện mã Free ship
                                    </label>
                                </div>

                                <div className="col-12 product-coupons margin-bottom-20">
                                    <div className="bg-shadow">
                                        <div className="title">Khuyến mãi dành cho bạn</div>
                                        <div className="swiper_coupons swiper-container">
                                            <div className="swiper-wrapper_coupon_wrapper">

                                                {loading ? (
                                                    <p>Đang tải…</p>
                                                ) : filtered.length === 0 ? (
                                                    <p>Không có mã phù hợp.</p>
                                                ) : (
                                                    filtered.map((coupon, index) => (

                                                        <div className="swiper-slide" style={{ width: "calc(100%/3 - 16px)", marginRight: "16px" }} key={index}>
                                                            <div className="box-coupon">
                                                                <div className="mask-ticket"></div>
                                                                <div className="image">
                                                                    <img width="88" height="88" src="/img/img_coupon_1.webp" alt={coupon.code} />
                                                                </div>
                                                                <div className="content_wrap">
                                                                    <a
                                                                        title="Chi tiết"
                                                                        href="#"
                                                                        className="info-button"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            // Handle detail view here
                                                                        }}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                                                                            <path d="M144 80c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z"></path>
                                                                        </svg>
                                                                    </a>
                                                                    <div className="content">
                                                                        <div className="title">{coupon.code || "Không có mô tả"}</div>
                                                                        <div className="description">{coupon.description || "Không có mô tả"} </div>
                                                                    </div>
                                                                    <div className="content-bottom">
                                                                        <button
                                                                            onClick={() => handleSave(coupon)}
                                                                            className={`coupon-code js-copy ${saved.includes(coupon.id) ? 'saved' : ''}`}
                                                                            disabled={saved.includes(coupon.id)}
                                                                            title="Lưu về tài khoản và copy mã"
                                                                        >
                                                                            {saved.includes(coupon.id) ? "Đã lưu" : "Lưu & Copy"}
                                                                        </button>                                                    <button
                                                                            onClick={() => handleUseNow(coupon)}
                                                                            className={`coupon-code js-copy }`}
                                                                            title="Click để lưu/copy lại"
                                                                        >
                                                                            Dùng ngay
                                                                        </button>
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
            </section>
        </>
    );
}
