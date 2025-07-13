
'use client';
import Link from 'next/link';
import useSWR from 'swr';
import { getCategories } from "../lib/category";
import { searchProducts } from "../lib/product";
import { useContext, useEffect, useState, useRef } from "react";
import { getCartLength } from '../lib/addCart';
import { AuthContext } from "../context/authContext";
import { Product } from '../types/product';
import { getWishlist } from '../lib/wishlist';

const useCategories = () => {
    const { data, error, isLoading } = useSWR("categories", getCategories);
    return {
        categories: data?.data || [],
        isLoading,
        isError: error
    };
};


export default function Header() {
    // Categories, isLoading, isError are fetched but not used in the component.
    const { categories, isLoading, isError } = useCategories();
    const [cartLength, setCartLength] = useState(0);
    const { author } = useContext(AuthContext);
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<Product[]>([]);
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { 
        const delayDebounce = setTimeout(async () => {
            if (query.trim()) {
                try {
                    const data = await searchProducts(query);
                    setResult(data);
                    setIsOpen(true);
                }
                catch (error) {
                    console.error("Error fetching search results:", error);
                    setResult([]);
                }
            } else {
                setResult([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const data = await getWishlist();
                const productsOnly = data.map((item: any) => item.product);
                setWishlist(productsOnly);
            } catch (err) {
                console.error("Lỗi khi load wishlist", err);
            }
        };

        fetchWishlist();
    }, []);

    useEffect(() => {
        setCartLength(getCartLength());

    }, [cartLength]);
    useEffect(() => {
        const handleStorageChange = () => {
            setCartLength(getCartLength());
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("cartUpdated", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("cartUpdated", handleStorageChange);
        };
    }, []);

    if (isLoading) return <p>Đang tải danh mục...</p>;
    if (isError) return <p>Không thể tải danh mục.</p>;

    return (
        <>
            <header className="header">
                <div className="topbar">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-9 header-promo">

                                <div className="notification">
                                    <svg viewBox="0 0 166 197">
                                        <path d="M82.8652955,196.898522 C97.8853137,196.898522 110.154225,184.733014 110.154225,169.792619 L55.4909279,169.792619 C55.4909279,184.733014 67.8452774,196.898522 82.8652955,196.898522 L82.8652955,196.898522 Z" className="notification--bellClapper"></path>
                                        <path d="M146.189736,135.093562 L146.189736,82.040478 C146.189736,52.1121695 125.723173,27.9861651 97.4598237,21.2550099 L97.4598237,14.4635396 C97.4598237,6.74321823 90.6498186,0 82.8530327,0 C75.0440643,0 68.2462416,6.74321823 68.2462416,14.4635396 L68.2462416,21.2550099 C39.9707102,27.9861651 19.5163297,52.1121695 19.5163297,82.040478 L19.5163297,135.093562 L0,154.418491 L0,164.080956 L165.706065,164.080956 L165.706065,154.418491 L146.189736,135.093562 Z" className="notification--bell"></path>
                                    </svg>
                                </div>
                                <ul className="ul-default promo-list js-promo">
                                    <li className="promo-item animated flipInX see-block">
                                        <Link className="duration-300 line-clamp-2-new" href="#" title="[05.09 - 01.10] Càng mua càng giảm: mua 6 tặng 1, mua 10 tặng 2, mua 20 tặng 5">
                                                [05.09 - 01.10] Càng mua càng giảm: mua 6 tặng <span>1</span>, mua 10 tặng <span>2</span>, mua 20 tặng <span>5</span>
                                        </Link>
                                    </li>
                                    <li className="promo-item see-none">
                                        <Link className="duration-300 line-clamp-2-new" href="#" title="Khuyến mãi 30/4 - 1/5  hấp dẫn nhất mua hè này KHÔNG THỂ BỎ LỠ!!!!">Khuyến mãi <span>30/4 - 1/5  hấp dẫn nhất mua hè này</span> KHÔNG THỂ BỎ LỠ!!!!</Link>
                                    </li>
                                    <li className="promo-item see-none">
                                        <Link className="duration-300 line-clamp-2-new" href="#" title="Ưu đãi độc quyền. Giảm 30 - 50% cho những ai có ngày sinh trùng với Black Friday.">Ưu đãi độc quyền. <span>Giảm 30 - 50%</span> cho những ai có ngày sinh trùng với Black Friday.</Link>
                                    </li>
                                </ul>

                            </div>
                            <div className="col-lg-3 header-hotline sm-hidden">
                                <Link title="Điện thoại: 1900 6750" href="tel:19006750">
                                    <svg id="Layer_1" enableBackground="new 0 0 64 64" height="23" viewBox="0 0 64 64" width="23" xmlns="http://www.w3.org/2000/svg"><g><path d="m55.267 22.76h-13.732v-14.337c0-2.07-.809-4.019-2.276-5.486-1.468-1.467-3.416-2.276-5.486-2.276h-25.049c-4.28 0-7.762 3.482-7.762 7.762v16.699c0 4.28 3.482 7.762 7.762 7.762h.587v4.762c0 1.474.877 2.781 2.235 3.331.437.177.892.262 1.343.262.939 0 1.855-.373 2.528-1.067l7.04-7.002v14.05c0 4.279 3.486 7.761 7.77 7.761h11.021l7.312 7.273c.688.708 1.608 1.085 2.552 1.085.451 0 .906-.086 1.344-.264 1.356-.549 2.232-1.854 2.232-3.325v-4.77h.579c4.285 0 7.771-3.481 7.771-7.761v-16.7c0-4.277-3.486-7.759-7.771-7.759zm-33.142 7.124c-.396 0-.777.157-1.058.437l-7.785 7.743c-.229.236-.479.185-.61.132-.135-.055-.361-.198-.361-.55v-6.262c0-.829-.671-1.5-1.5-1.5h-2.087c-2.626 0-4.762-2.136-4.762-4.762v-16.699c0-2.626 2.136-4.762 4.762-4.762h25.048c1.27 0 2.464.496 3.365 1.397.901.9 1.397 2.095 1.397 3.364v16.699c0 2.626-2.137 4.762-4.763 4.762h-11.646zm37.913 17.336c0 2.625-2.14 4.761-4.771 4.761h-2.079c-.828 0-1.5.672-1.5 1.5v6.27c0 .348-.226.491-.359.545-.133.053-.385.107-.634-.148l-7.77-7.729c-.281-.279-.661-.437-1.058-.437h-11.64c-2.63 0-4.77-2.136-4.77-4.761v-14.337h8.314c4.065 0 7.403-3.141 7.73-7.123h13.765c2.631 0 4.771 2.135 4.771 4.76v16.699z"></path><g><path d="m33.461 36.667c-1.22 0-2.213.994-2.213 2.213s.994 2.213 2.213 2.213c1.221 0 2.215-.994 2.215-2.213s-.993-2.213-2.215-2.213z"></path><path d="m42.747 36.667c-1.22 0-2.213.994-2.213 2.213s.994 2.213 2.213 2.213c1.221 0 2.215-.994 2.215-2.213s-.994-2.213-2.215-2.213z"></path><path d="m52.033 36.667c-1.22 0-2.213.994-2.213 2.213s.994 2.213 2.213 2.213c1.221 0 2.215-.994 2.215-2.213s-.994-2.213-2.215-2.213z"></path></g><g><path d="m20.753 21.827c-.866 0-1.568.722-1.568 1.589 0 .846.681 1.589 1.568 1.589s1.589-.743 1.589-1.589c0-.867-.722-1.589-1.589-1.589z"></path><path d="m21.059 8.54c-3.192 0-4.659 1.892-4.659 3.169 0 .922.78 1.348 1.419 1.348 1.277 0 .757-1.821 3.169-1.821 1.182 0 2.128.52 2.128 1.608 0 1.277-1.324 2.01-2.104 2.672-.686.591-1.585 1.561-1.585 3.595 0 1.23.331 1.584 1.301 1.584 1.159 0 1.395-.52 1.395-.97 0-1.23.024-1.939 1.324-2.956.638-.497 2.648-2.105 2.648-4.328.001-2.222-2.009-3.901-5.036-3.901z"></path></g></g></svg>
                                    <div className="text-box">
                                        <span className="acc-text-small">Tư vấn mua hàng</span>
                                        <span className="acc-text">1900 6750</span>
                                    </div>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="main-header">
                    <div className="container">
                        <div className="box-hearder">
                            <div className="row align-items-center">
                                <div className="col-6 col-lg-3 col-md-4 header-logo">

                                    <Link href="/" className="logo-wrapper" title="Sudes Nest">
                                        <img width="300" height="96" src="/img/logo1.2.png" alt="Bird's Nest" className="" />
                                    </Link>

                                </div>
                                <div className="col-12 col-md-12 col-lg-6 header-mid">
                                    <div className="list-top-item header_tim_kiem">
                                        <form action="/search" method="get" className="header-search-form input-group search-bar" role="search">
                                            <input name="query" value={query} ref={inputRef} onChange={(e) => setQuery(e.target.value)}
                                                onFocus={() => setIsOpen(true)}
                                                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                                                className="input-group-field auto-search search-auto form-control" placeholder="Tìm sản phẩm..." autoComplete="off" type="text" />
                                            <button type="submit" className="btn icon-fallback-text" aria-label="Tìm kiếm" title="Tìm kiếm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                                                </svg>
                                            </button>

                                            <div className={`search-suggest ${isOpen ? 'open' : ''}`}>

                                                <div className="search-recent d-none">
                                                    <div className="search-title">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                                                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"></path>
                                                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"></path>
                                                        </svg>
                                                        Tìm kiếm gần đây
                                                    </div>
                                                    <div className="search-list">
                                                    </div>
                                                </div>


                                                <div className="item-suggest">
                                                    <div className="search-title">
                                                        <svg height="20" viewBox="0 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><g id="trend_up"><path id="background" d="m256 31a225.07 225.07 0 0 1 87.57 432.33 225.07 225.07 0 0 1 -175.14-414.66 223.45 223.45 0 0 1 87.57-17.67m0-31c-141.38 0-256 114.62-256 256s114.62 256 256 256 256-114.62 256-256-114.62-256-256-256z"></path><path d="m133.35 334.73a18.11 18.11 0 0 1 -8-1.9c-6.59-3.23-10.36-10.21-9.17-17a22.45 22.45 0 0 1 5.4-11.46c27.31-27.74 54.67-55 75.46-75.63a18 18 0 0 1 12.75-5.63c4.83 0 9.49 2.1 13.47 6.08l47 47 64-64h-6.46c-8.21 0-19.46-.1-25.91-.16-10.16-.08-17.28-7.16-17.33-17.22a17.52 17.52 0 0 1 4.84-12.53 17.19 17.19 0 0 1 12.31-4.88c13-.05 26-.07 38.52-.07 13.05 0 26.06 0 38.67.07 9.73 0 16.84 7 16.9 16.56.18 26.67.17 53 0 78.22-.06 9.58-7.33 16.54-17.28 16.54h-.2c-9.88-.09-16.89-7.06-17.05-16.94-.12-7.75-.1-15.63-.07-23.24q0-5 0-10v-2c-.25.22-.48.44-.7.66q-32.46 32.6-64.89 65.22l-9 9c-5.4 5.43-10.45 8.07-15.44 8.07s-9.9-2.58-15.16-7.88l-46.26-46.25-3.75 3.81c-4 4-7.82 7.76-11.52 11.48l-17.38 17.49c-10 10.08-20.34 20.51-30.55 30.73a18.58 18.58 0 0 1 -13.2 5.86z"></path></g></g></svg>
                                                        Đề xuất phổ biến
                                                    </div>
                                                    <div className="search-list">


                                                        <Link href="/" className="search-item" title="Tìm kiếm Tổ yến">
                                                            Tổ yến
                                                        </Link>

                                                        <Link href="/" className="search-item" title="Tìm kiếm Tổ yến chưng tươi">
                                                            Tổ yến chưng tươi
                                                        </Link>

                                                        <Link href="/" className="search-item" title="Tìm kiếm Yến chưng sẵn">
                                                            Yến chưng sẵn
                                                        </Link>

                                                        <Link href="/" className="search-item" title="Tìm kiếm Sữa hạt tổ yến">
                                                            Sữa hạt tổ yến
                                                        </Link>

                                                        <Link href="/" className="search-item" title="Tìm kiếm Tổ yến thô">
                                                            Tổ yến thô
                                                        </Link>

                                                        <Link href="/" className="search-item" title="Tìm kiếm Tổ yến không đường">
                                                            Tổ yến không đường
                                                        </Link>

                                                    </div>
                                                </div>

                                                {/* hiển thị kq */}
                                                <div className="list-search">

                                                    {result.slice(0, 5).map((item) => (

                                                        <Link key={item.id} className="product-smart" href={`/product/${item.id}`} title={item.name}>
                                                            <div className="image_thumb">
                                                                <img width="58" height="58" className="lazyload loaded" src="//bizweb.dktcdn.net/thumb/compact/100/506/650/products/to-yen-tho-vip-loai-1.jpg?v=1705573680173" alt="Tổ yến thô VIP Loại 1" data-was-processed="true" />
                                                            </div>
                                                            <div className="product-info">
                                                                <h3 className="product-name"><span>{item.name}</span></h3>
                                                                <div className="price-box">
                                                                    <span className="price">{Number(item.price).toLocaleString('vi-VN')}đ</span><span className="compare-price">{item.price}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}

                                                    {query.trim() && (
                                                        <Link
                                                            href={`/search?query=${encodeURIComponent(query)}&type=product`}
                                                            className="see-all-search"
                                                            title="Xem tất cả"
                                                        >
                                                            Xem tất cả kết quả »
                                                        </Link>
                                                    )}

                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-3 col-md-8 header-right">
                                    <div className="sudes-header-stores sm-hidden">
                                        <Link href="/he-thong-cua-hang" title="Cửa hàng">
                                            <span className="box-icon">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 0C6.12297 0 2.96875 3.15422 2.96875 7.03125C2.96875 8.34117 3.3316 9.61953 4.01832 10.7286L9.59977 19.723C9.70668 19.8953 9.89504 20 10.0976 20C10.0992 20 10.1007 20 10.1023 20C10.3066 19.9984 10.4954 19.8905 10.6003 19.7152L16.0395 10.6336C16.6883 9.54797 17.0312 8.3023 17.0312 7.03125C17.0312 3.15422 13.877 0 10 0ZM15.0338 10.032L10.0888 18.2885L5.01434 10.1112C4.44273 9.18805 4.13281 8.12305 4.13281 7.03125C4.13281 3.80039 6.76914 1.16406 10 1.16406C13.2309 1.16406 15.8633 3.80039 15.8633 7.03125C15.8633 8.09066 15.5738 9.12844 15.0338 10.032Z" fill="white"></path>
                                                    <path d="M10 3.51562C8.06148 3.51562 6.48438 5.09273 6.48438 7.03125C6.48438 8.95738 8.03582 10.5469 10 10.5469C11.9884 10.5469 13.5156 8.93621 13.5156 7.03125C13.5156 5.09273 11.9385 3.51562 10 3.51562ZM10 9.38281C8.7009 9.38281 7.64844 8.32684 7.64844 7.03125C7.64844 5.73891 8.70766 4.67969 10 4.67969C11.2923 4.67969 12.3477 5.73891 12.3477 7.03125C12.3477 8.30793 11.3197 9.38281 10 9.38281Z" fill="white"></path>
                                                </svg>
                                            </span>
                                            <span className="item-title sm-hidden">Cửa hàng</span>
                                        </Link>
                                    </div>
                                    <div className="sudes-header-iwish sm-hidden">
                                        <Link href="/wishlist" title="Danh sách yêu thích">
                                            <span className="box-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path>
                                                </svg>
                                                <span className="js-wishlist-count">{wishlist.length}</span>
                                            </span>
                                            <span className="item-title sm-hidden">Yêu thích</span>
                                        </Link>
                                    </div>
                                    
                                    <div className="sudes-header-account header-action_account">
                                        
                                        <Link href="javascript:;" className="header-account" aria-label="Tài khoản" title="Tài khoản">
                                            <span className="box-icon">
                                                <svg viewBox="-42 0 512 512.001" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="m210.351562 246.632812c33.882813 0 63.21875-12.152343 87.195313-36.128906 23.96875-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.128906 87.195312 23.980469 23.96875 53.316406 36.125 87.191406 36.125zm-65.972656-189.292968c18.394532-18.394532 39.972656-27.335938 65.972656-27.335938 25.996094 0 47.578126 8.941406 65.976563 27.335938 18.394531 18.398437 27.339844 39.980468 27.339844 65.972656 0 26-8.945313 47.578125-27.339844 65.976562-18.398437 18.398438-39.980469 27.339844-65.976563 27.339844-25.992187 0-47.570312-8.945312-65.972656-27.339844-18.398437-18.394531-27.34375-39.976562-27.34375-65.976562 0-25.992188 8.945313-47.574219 27.34375-65.972656zm0 0"></path><path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.3125-10.339844-7.808594-20.550781-13.375-30.335938-5.769532-10.15625-12.550782-19-20.160157-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.042969 5.339844-10.96875 0-22.085937-1.796876-33.042968-5.339844-11.210938-3.621094-20.300782-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.753906-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.609375 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.0625 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.777344-1.023438 19.953125-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.4375 23.730469 65.066406 23.730469h246.53125c26.621094 0 48.511719-7.984375 65.0625-23.730469 16.757813-15.945312 25.253906-37.589843 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm-44.90625 72.828125c-10.933594 10.40625-25.449218 15.464844-44.378906 15.464844h-246.527344c-18.933594 0-33.449218-5.058594-44.378906-15.460938-10.722656-10.207031-15.933594-24.140625-15.933594-42.585937 0-9.59375.316406-19.066407.949219-28.160157.617187-8.921874 1.878906-18.722656 3.75-29.136718 1.847656-10.285156 4.199219-19.9375 6.996094-28.675782 2.683593-8.378906 6.34375-16.675781 10.882812-24.667968 4.332031-7.617188 9.316407-14.152344 14.816407-19.417969 5.144531-4.925781 11.628906-8.957031 19.269531-11.980469 7.066406-2.796875 15.007812-4.328125 23.628906-4.558594 1.050781.558594 2.921875 1.625 5.953125 3.601563 6.167969 4.019531 13.277344 8.605469 21.136719 13.625 8.859375 5.648437 20.273437 10.75 33.910156 15.152344 13.941406 4.507812 28.160156 6.796875 42.273437 6.796875 14.113282 0 28.335938-2.289063 42.269532-6.792969 13.648437-4.410156 25.058594-9.507813 33.929687-15.164063 8.042969-5.140624 14.953125-9.59375 21.121094-13.617187 3.03125-1.972656 4.902344-3.042969 5.953125-3.601563 8.625.230469 16.566406 1.761719 23.636719 4.558594 7.636719 3.023438 14.121093 7.058594 19.265625 11.980469 5.5 5.261719 10.484375 11.796875 14.816406 19.421875 4.542969 7.988281 8.207031 16.289062 10.886719 24.660156 2.800781 8.75 5.15625 18.398438 7 28.675782 1.867187 10.433593 3.132812 20.238281 3.75 29.144531v.007812c.636719 9.058594.957031 18.527344.960937 28.148438-.003906 18.449219-5.214844 32.378906-15.9375 42.582031zm0 0"></path>
                                                </svg>
                                            </span>
                                            <span className="item-title sm-hidden">{author ? author.user.name : "Tài khoản"}</span>
                                            <svg width="30" height="30" viewBox="0 0 8 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.13382 7.1278L7.13379 7.12777L0.512271 0.509686L0.795057 0.226752L0.51227 0.509685C0.512123 0.509538 0.51201 0.509431 0.511927 0.509356L7.13382 7.1278ZM7.13382 7.1278C7.62239 7.61603 7.622 8.40641 7.13301 8.89414L7.13298 8.89417L0.502368 15.5089C0.50222 15.509 0.502106 15.5091 0.502022 15.5092C0.501841 15.5092 0.501547 15.5093 0.501149 15.5093C0.500827 15.5093 0.500574 15.5093 0.500392 15.5092L7.13055 8.89499C7.13056 8.89498 7.13057 8.89497 7.13058 8.89495C7.61976 8.407 7.62011 7.61541 7.13138 7.12699L7.13382 7.1278Z"></path>
                                            </svg>
                                        </Link>
                                        {author ? (<>
                                        <ul>

                                            <li className="li-account"><Link rel="nofollow" href="/account" title="Tài khoản">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
                                                </svg>
                                                Tài khoản
                                            </Link>
                                            </li>
                                            <li className="li-account"><Link rel="nofollow" href="/logout" title="Đăng xuất">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"></path>
                                                    <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"></path>
                                                </svg>
                                                Đăng xuất
                                            </Link>
                                            </li>

                                        </ul>
                                 </>) : (
                                                <>
                                                <ul>
                                                    
                                                    <li className="li-account"><Link rel="nofollow" href="/login" title="Đăng nhập">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"></path>
                                                            <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"></path>
                                                        </svg>
                                                        Đăng nhập</Link>
                                                    </li>
                                                    <li className="li-account"><Link rel="nofollow" href="/register" title="Đăng ký">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-plus" viewBox="0 0 16 16">
                                                            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"></path>
                                                            <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"></path>
                                                        </svg>
                                                        Đăng ký</Link>
                                                    </li>
                                                    
                                                </ul>
                                                </>
                                 )}

                                    </div>
                                    <div className="sudes-header-cart header-action_cart">
                                        <Link className="a-hea" href="/cart" aria-label="Giỏ hàng" title="Giỏ hàng">
                                            <span className="box-icon">
                                                <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clipPath="url(#clip0_253_2)">
                                                        <path d="M400.739 512H111.461C50.2676 512 0.200195 462.629 0.200195 402.286V398.629L11.3263 106.057C13.1806 45.7143 63.248 0 122.587 0H389.613C448.952 0 499.02 45.7143 500.874 106.057L512 398.629C513.854 427.886 502.728 455.314 482.331 477.257C461.933 499.2 434.118 512 404.448 512C404.448 512 402.594 512 400.739 512ZM122.587 36.5714C81.7915 36.5714 50.2676 67.6572 48.4132 106.057L37.2871 402.286C37.2871 442.514 70.6654 475.429 111.461 475.429H404.448C424.846 475.429 443.389 466.286 456.37 451.657C469.35 437.029 476.768 418.743 476.768 398.629L465.641 106.057C463.787 65.8286 432.263 36.5714 391.468 36.5714H122.587Z" fill="black"></path>
                                                        <path d="M256.1 219.429C183.78 219.429 126.295 162.743 126.295 91.4288C126.295 80.4574 133.713 73.1431 144.839 73.1431C155.965 73.1431 163.382 80.4574 163.382 91.4288C163.382 142.629 204.178 182.857 256.1 182.857C308.021 182.857 348.817 142.629 348.817 91.4288C348.817 80.4574 356.235 73.1431 367.361 73.1431C378.487 73.1431 385.904 80.4574 385.904 91.4288C385.904 162.743 328.419 219.429 256.1 219.429Z" fill="black"></path>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_253_2">
                                                            <rect width="512" height="512" fill="white"></rect>
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <span className="count_item count_item_pr">{cartLength}</span>
                                            </span>
                                            <span className="item-title sm-hidden">Giỏ hàng</span>
                                        </Link>
                                        <div className="top-cart-content">
                                            <div className="CartHeaderContainer">

                                                <form action="/cart" method="post" className="cart ajaxcart cartheader">
                                                    <div className="title_cart_hea" onClick={(() => window.location.href = '/cart')}>Giỏ hàng</div>
                                                    <div className="ajaxcart__inner ajaxcart__inner--has-fixed-footer cart_body items">
                                                        <div className="ajaxcart__row">
                                                            <div className="ajaxcart__product cart_product" data-line="1">
                                                                <Link href="" className="ajaxcart__product-img cart_img" title="">
                                                                    <img width="80" height="80" src="https://bizweb.dktcdn.net/thumb/compact/100/506/650/products/set-qua-20-10-img-1.jpg" alt="" /></Link>
                                                                <div className="grid__item cart_info">
                                                                    <div className="ajaxcart__product-name-wrapper cart_name">
                                                                        <Link href="" className="ajaxcart__product-name h4 line-clamp line-clamp-2-new" title="">Set quà 2010 – Maneli #1 bồi bổ sức khỏe, dưỡng nhan</Link>
                                                                        <Link title="Xóa" className="cart__btn-remove remove-item-cart ajaxifyCart--remove" href="javascript:;" data-line="1"></Link>

                                                                    </div>
                                                                    <div className="grid">
                                                                        <div className="grid__item one-half cart_select cart_item_name">
                                                                            <div className="ajaxcart__qty input-group-btn">
                                                                                <button type="button" className="ajaxcart__qty-adjust ajaxcart__qty--minus items-count" data-id="" data-qty="0" data-line="1" aria-label="-">
                                                                                    -
                                                                                </button>
                                                                                <input type="text" name="updates[]" className="ajaxcart__qty-num number-sidebar" min="0" data-id="" data-line="1" aria-label="quantity" pattern="[0-9]*" />
                                                                                <button type="button" className="ajaxcart__qty-adjust ajaxcart__qty--plus items-count" data-id="" data-line="1" data-qty="2" aria-label="+">
                                                                                    +
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid__item one-half text-right cart_prices">
                                                                            <span className="cart-price">500.000₫</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ajaxcart__footer ajaxcart__footer--fixed cart-footer">
                                                        <div className="ajaxcart__subtotal">
                                                            <div className="cart__subtotal">
                                                                <div className="cart__col-6">Tổng tiền:</div>
                                                                <div className="text-right cart__totle"><span className="total-price">500.000₫</span></div>
                                                            </div>
                                                        </div>
                                                        <div className="cart__btn-proceed-checkout-dt ">
                                                            <button onClick={() => location.href = '/checkout'} type="button" className="button btn btn-primary cart__btn-proceed-checkout" id="btn-proceed-checkout" title="Thanh toán">Thanh toán</button>
                                                        </div>
                                                    </div>
                                                </form>


                                            </div>
                                        </div>
                                    </div>
                                    <button className="menu-icon md-hidden" aria-label="Menu" id="btn-menu-mobile" title="Menu">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header-menu">
                    <div className="container">
                        <div className="navigation-horizontal">
                            <div className="title_menu md-hidden">
                                <ul id="tabs-menu-mb">
                                    <li className="tab-link" data-tab="tab-menu-1">Danh mục</li>
                                    <li className="tab-link" data-tab="tab-menu-2">Menu</li>
                                </ul>
                                <div className="close-mb-menu"></div>
                            </div>
                            <div className="row">
                                <div className="col-lg-3 col-sm-12 col-xs-12 col-12 sudes-cate-header tab-content-mb" id="tab-menu-1">
                                    <div className="title">
                                        <svg className="icon-left" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V7C0 7.26522 0.105357 7.51957 0.292893 7.70711C0.48043 7.89464 0.734784 8 1 8H7C7.26522 8 7.51957 7.89464 7.70711 7.70711C7.89464 7.51957 8 7.26522 8 7V1C8 0.734784 7.89464 0.48043 7.70711 0.292893C7.51957 0.105357 7.26522 0 7 0V0ZM6 6H2V2H6V6ZM17 0H11C10.7348 0 10.4804 0.105357 10.2929 0.292893C10.1054 0.48043 10 0.734784 10 1V7C10 7.26522 10.1054 7.51957 10.2929 7.70711C10.4804 7.89464 10.7348 8 11 8H17C17.2652 8 17.5196 7.89464 17.7071 7.70711C17.8946 7.51957 18 7.26522 18 7V1C18 0.734784 17.8946 0.48043 17.7071 0.292893C17.5196 0.105357 17.2652 0 17 0V0ZM16 6H12V2H16V6ZM7 10H1C0.734784 10 0.48043 10.1054 0.292893 10.2929C0.105357 10.4804 0 10.7348 0 11V17C0 17.2652 0.105357 17.5196 0.292893 17.7071C0.48043 17.8946 0.734784 18 1 18H7C7.26522 18 7.51957 17.8946 7.70711 17.7071C7.89464 17.5196 8 17.2652 8 17V11C8 10.7348 7.89464 10.4804 7.70711 10.2929C7.51957 10.1054 7.26522 10 7 10ZM6 16H2V12H6V16ZM14 10C11.794 10 10 11.794 10 14C10 16.206 11.794 18 14 18C16.206 18 18 16.206 18 14C18 11.794 16.206 10 14 10ZM14 16C12.897 16 12 15.103 12 14C12 12.897 12.897 12 14 12C15.103 12 16 12.897 16 14C16 15.103 15.103 16 14 16Z" fill="#F4342A"></path>
                                        </svg>
                                        <span>Danh mục sản phẩm</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right icon-right" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"></path>
                                        </svg>
                                    </div>


                                    <div className="sudes-list-cate" data-section="header_nav_cate">

                                        <ul className="sudes-main-cate">

                                            {categories.map((category: any) => (
                                                        <li className="sudes-main-cate-has-child menu-item-count" key={category.id}>
                                                            <Link
                                                                href={`/category/${category.id}?category_id=${category.id}&page=1`}
                                                                title={category.name}
                                                            >
                                                                {/* <img
                                                                    className="lazyload loaded"
                                                                    src="http://bizweb.dktcdn.net/100/506/650/themes/944598/assets/index-cate-icon-2.png?1739018973665"
                                                                    width={100}
                                                                    height={100}
                                                                    alt="Yến img tươi"
                                                                /> */}
                                                                {category.name}
                                                            </Link>
                                                            <i className="open_mnu down_icon"></i>
                                                        </li>
                                                    ))}
                                            {/* <li className="sudes-main-cate-has-child menu-item-count ">
                                                <Link href="/yen-nuoc" title="Yến nước">
                                                    <img className="lazyload loaded" src="http://bizweb.dktcdn.net/100/506/650/themes/944598/assets/index-cate-icon-3.png?1739018973665" data-src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/index-cate-icon-3.png?1739018973665" width={100}
                                                        height={100} alt="img nước" data-was-processed="true" />
                                                    Yến nước
                                                </Link>
                                                <i className="open_mnu down_icon"></i>
                                                <ul className="menu-child sub-menu sudes-sub-mega-menu">


                                                    <li>
                                                        <Link href="/yen-nuoc-chung-duong-phen" title="Yến nước chưng đường phèn">Yến nước chưng đường phèn</Link>
                                                    </li>



                                                    <li>
                                                        <Link href="/yen-nuoc-ky-tu" title="Yến nước kỳ tử">Yến nước kỳ tử</Link>
                                                    </li>



                                                    <li>
                                                        <Link href="/yen-nuoc-duong-an-kieng" title="Yến nước đường ăn kiêng">Yến nước đường ăn kiêng</Link>
                                                    </li>



                                                    <li>
                                                        <Link href="/yen-nuoc-nha-dam-hat-chia" title="Yến nước nha đam hạt chia">Yến nước nha đam hạt chia</Link>
                                                    </li>


                                                </ul>
                                            </li>

                                            <li className="sudes-main-cate-has-child menu-item-count ">
                                                <Link href="/dong-trung-ha-thao" title="Đông trùng hạ thảo">
                                                    <img className="lazyload loaded" src="http://bizweb.dktcdn.net/100/506/650/themes/944598/assets/index-cate-icon-4.png?1739018973665" data-src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/index-cate-icon-4.png?1739018973665" alt="Đông trùng img thảo" data-was-processed="true" />
                                                    Đông trùng hạ thảo
                                                </Link>
                                                <i className="open_mnu down_icon"></i>
                                                <ul className="menu-child sub-menu sudes-sub-mega-menu">


                                                    <li>
                                                        <Link href="/nam-dong-trung-ha-thao-tuoi" title="Nấm đông trùng hạ thảo tươi">Nấm đông trùng hạ thảo tươi</Link>
                                                    </li>



                                                    <li>
                                                        <Link href="/nam-dong-trung-ha-thao-kho" title="Nấm đông trùng hạ thảo khô">Nấm đông trùng hạ thảo khô</Link>
                                                    </li>



                                                    <li>
                                                        <Link href="/vien-dong-trung-ha-thao" title="Viên đông trùng hạ thảo">Viên đông trùng hạ thảo</Link>
                                                    </li>


                                                </ul>
                                            </li>

                                            <li className="sudes-main-cate-has-child menu-item-count ">
                                                <Link href="/sam-han-quoc" title="Sâm Hàn Quốc">
                                                    <img className="lazyload loaded" src="http://bizweb.dktcdn.net/100/506/650/themes/944598/assets/index-cate-icon-5.png?1739018973665" data-src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/index-cate-icon-5.png?1739018973665" alt="Sâm img Quốc" data-was-processed="true" />
                                                    Sâm Hàn Quốc
                                                </Link>
                                                <i className="open_mnu down_icon"></i>
                                                <ul className="menu-child sub-menu sudes-sub-mega-menu">


                                                    <li className="sudes-main-cate-has-child clearfix">
                                                        <Link href="/hong-sam" title="Hồng sâm">Hồng sâm</Link>
                                                        <i className="open_mnu down_icon"></i>
                                                        <ul className="menu-child menu-child-2 sub-menu clearfix">

                                                            <li>
                                                                <Link href="/keo-hong-sam" title="Kẹo hồng sâm">Kẹo hồng sâm</Link>
                                                            </li>

                                                            <li>
                                                                <Link href="/tra-hong-sam" title="Trà hồng sâm">Trà hồng sâm</Link>
                                                            </li>

                                                            <li>
                                                                <Link href="/cao-hong-sam" title="Cao hồng sâm">Cao hồng sâm</Link>
                                                            </li>

                                                        </ul>
                                                    </li>



                                                    <li className="sudes-main-cate-has-child clearfix">
                                                        <Link href="/thien-sam" title="Thiên sâm">Thiên sâm</Link>
                                                        <i className="open_mnu down_icon"></i>
                                                        <ul className="menu-child menu-child-2 sub-menu clearfix">

                                                            <li>
                                                                <Link href="/thien-sam-premium" title="Thiên sâm premium">Thiên sâm premium</Link>
                                                            </li>

                                                            <li>
                                                                <Link href="/thien-sam-dong-trung" title="Thiên sâm đông trùng">Thiên sâm đông trùng</Link>
                                                            </li>

                                                        </ul>
                                                    </li>



                                                    <li className="sudes-main-cate-has-child clearfix">
                                                        <Link href="/hac-sam" title="Hắc sâm">Hắc sâm</Link>
                                                        <i className="open_mnu down_icon"></i>
                                                        <ul className="menu-child menu-child-2 sub-menu clearfix">

                                                            <li>
                                                                <Link href="/keo-hac-sam" title="Kẹo hắc sâm">Kẹo hắc sâm</Link>
                                                            </li>

                                                            <li>
                                                                <Link href="/nuoc-hac-sam" title="Nước hắc sâm">Nước hắc sâm</Link>
                                                            </li>

                                                            <li>
                                                                <Link href="/cao-hac-sam" title="Cao hắc sâm">Cao hắc sâm</Link>
                                                            </li>

                                                        </ul>
                                                    </li>



                                                    <li className="sudes-main-cate-has-child clearfix">
                                                        <Link href="/sam-tuoi" title="Sâm tươi">Sâm tươi</Link>
                                                        <i className="open_mnu down_icon"></i>
                                                        <ul className="menu-child menu-child-2 sub-menu clearfix">

                                                            <li>
                                                                <Link href="/sam-cu-tuoi" title="Sâm củ tươi">Sâm củ tươi</Link>
                                                            </li>

                                                            <li>
                                                                <Link href="/binh-sam-tuoi-ngam-san" title="Bình sâm tươi ngâm sẵn">Bình sâm tươi ngâm sẵn</Link>
                                                            </li>

                                                        </ul>
                                                    </li>


                                                </ul>
                                            </li>

                                            <li className="sudes-main-cate-has-child menu-item-count ">
                                                <Link href="/saffron" title="Saffron">
                                                    <img className="lazyload loaded" src="http://bizweb.dktcdn.net/100/506/650/themes/944598/assets/index-cate-icon-6.png?1739018973665" data-src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/index-cate-icon-6.png?1739018973665" alt="imgffron" data-was-processed="true" />
                                                    Saffron
                                                </Link>
                                                <i className="open_mnu down_icon"></i>
                                                <ul className="menu-child sub-menu sudes-sub-mega-menu">


                                                    <li>
                                                        <Link href="/saffron-tay-a" title="Saffron Tây Á">Saffron Tây Á</Link>
                                                    </li>



                                                    <li>
                                                        <Link href="/set-qua-tang-saffron" title="Set quà tặng Saffron">Set quà tặng Saffron</Link>
                                                    </li>



                                                    <li>
                                                        <Link href="/mat-ong-saffron" title="Mật ong Saffron">Mật ong Saffron</Link>
                                                    </li>



                                                    <li>
                                                        <Link href="/my-pham-saffron" title="Mỹ phẩm Saffron">Mỹ phẩm Saffron</Link>
                                                    </li>


                                                </ul>
                                            </li>

                                            <li className="sudes-main-cate-has-child menu-item-count ">
                                                <Link href="/soup" title="Soup">
                                                    <img className="lazyload loaded" src="http://bizweb.dktcdn.net/100/506/650/themes/944598/assets/index-cate-icon-7.png?1739018973665" data-src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/index-cate-icon-7.png?1739018973665" alt="Soup" data-was-processed="true" />
                                                    Soup
                                                </Link>
                                                <i className="open_mnu down_icon"></i>
                                                <ul className="menu-child sub-menu sudes-sub-mega-menu">


                                                    <li>
                                                        <Link href="/soup-vi-ca-bao-ngu-to-yen" title="Soup Vi cá - bào ngư - tổ yến">Soup Vi cá - bào ngư - tổ yến</Link>
                                                    </li>



                                                    <li>
                                                        <Link href="/soup-vi-ca-bao-ngu" title="Soup Vi cá - bào ngư">Soup Vi cá - bào ngư</Link>
                                                    </li>



                                                    <li>
                                                        <Link href="/bat-tran-ngu-xi-ngu-thien" title="Bát Trân Ngư Xí Ngự Thiện">Bát Trân Ngư Xí Ngự Thiện</Link>
                                                    </li>



                                                    <li>
                                                        <Link href="/bat-tran-uy-uy-ngu-thien" title="Bát Trân Uy Uy Ngự Thiện">Bát Trân Uy Uy Ngự Thiện</Link>
                                                    </li>


                                                </ul>
                                            </li> */}
                                            
                                            {/* <li className="menu-item-count ">
                                                <Link href="/qua-bieu-cao-cap" title="Quà biếu cao cấp"><img className="lazyload loaded" src="http://bizweb.dktcdn.net/100/506/650/themes/944598/assets/index-cate-icon-8.png?1739018973665" data-src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/index-cate-icon-8.png?1739018973665" alt="Quà biếu cao cấp" data-was-processed="true" /> Quà biếu cao cấp</Link>
                                            </li> */}


                                        </ul>

                                    </div>



                                </div>
                                <div className="col-lg-9 col-sm-12 col-xs-12 col-12 sudes-main-header tab-content-mb" id="tab-menu-2">
                                    <div className="col-menu has-promo-btn">
                                        <ul id="nav" className="nav">



                                            <li className="nav-item active">
                                                <Link className="nav-link" href="/" title="Trang chủ">Trang chủ</Link>
                                            </li>



                                            <li className="nav-item ">
                                                <Link className="nav-link" href="/gioi-thieu" title="Giới thiệu">Giới thiệu</Link>
                                            </li>



                                            <li className="nav-item has-childs " data-section="header_nav">
                                                <Link href="/product" className="nav-link" title="Sản phẩm">Sản phẩm
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"></path>
                                                    </svg>
                                                </Link>
                                                <i className="open_mnu down_icon"></i>

                                                {/* <ul className="dropdown-menu">


                                                    <li className="dropdown-submenu nav-item-lv2 has-childs2">
                                                        <Link className="nav-link" href="/to-yen" title="Tổ yến">Tổ yến <svg width="8" height="17" viewBox="0 0 8 17" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7.13382 7.1278L7.13379 7.12777L0.512271 0.509686L0.795057 0.226752L0.51227 0.509685C0.512123 0.509538 0.51201 0.509431 0.511927 0.509356L7.13382 7.1278ZM7.13382 7.1278C7.62239 7.61603 7.622 8.40641 7.13301 8.89414L7.13298 8.89417L0.502368 15.5089C0.50222 15.509 0.502106 15.5091 0.502022 15.5092C0.501841 15.5092 0.501547 15.5093 0.501149 15.5093C0.500827 15.5093 0.500574 15.5093 0.500392 15.5092L7.13055 8.89499C7.13056 8.89498 7.13057 8.89497 7.13058 8.89495C7.61976 8.407 7.62011 7.61541 7.13138 7.12699L7.13382 7.1278Z"></path></svg></Link>
                                                        <i className="open_mnu down_icon"></i>
                                                        <ul className="dropdown-menu">

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/to-yen-tho" title="Tổ yến thô">Tổ yến thô</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/to-yen-lam-sach" title="Tổ yến làm sạch">Tổ yến làm sạch</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/to-yen-tinh-che" title="Tổ yến tinh chế">Tổ yến tinh chế</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/to-yen-cao-cap" title="Tổ yến cao cấp">Tổ yến cao cấp</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/to-yen-rut-long" title="Tổ yến rút lông">Tổ yến rút lông</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/yen-vun" title="Yến vụn">Yến vụn</Link>
                                                            </li>

                                                        </ul>
                                                    </li>



                                                    <li className="dropdown-submenu nav-item-lv2 has-childs2">
                                                        <Link className="nav-link" href="/yen-chung-tuoi" title="Yến chưng tươi">Yến chưng tươi <svg width="8" height="17" viewBox="0 0 8 17" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7.13382 7.1278L7.13379 7.12777L0.512271 0.509686L0.795057 0.226752L0.51227 0.509685C0.512123 0.509538 0.51201 0.509431 0.511927 0.509356L7.13382 7.1278ZM7.13382 7.1278C7.62239 7.61603 7.622 8.40641 7.13301 8.89414L7.13298 8.89417L0.502368 15.5089C0.50222 15.509 0.502106 15.5091 0.502022 15.5092C0.501841 15.5092 0.501547 15.5093 0.501149 15.5093C0.500827 15.5093 0.500574 15.5093 0.500392 15.5092L7.13055 8.89499C7.13056 8.89498 7.13057 8.89497 7.13058 8.89495C7.61976 8.407 7.62011 7.61541 7.13138 7.12699L7.13382 7.1278Z"></path></svg></Link>
                                                        <i className="open_mnu down_icon"></i>
                                                        <ul className="dropdown-menu">

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/yen-chung-dinh-duong" title="Yến chưng dinh dưỡng">Yến chưng dinh dưỡng</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/yen-hu-chung-san-cho-be" title="Yến hũ chưng sẵn cho bé">Yến hũ chưng sẵn cho bé</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/yen-hu-chung-khong-duong" title="Yến hũ chưng không đường">Yến hũ chưng không đường</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/yen-hu-chung-it-duong" title="Yến hũ chưng ít đường">Yến hũ chưng ít đường</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/yen-chung-hat-sen" title="Yến chưng hạt sen">Yến chưng hạt sen</Link>
                                                            </li>

                                                        </ul>
                                                    </li>



                                                    <li className="dropdown-submenu nav-item-lv2 has-childs2">
                                                        <Link className="nav-link" href="/yen-nuoc" title="Yến nước">Yến nước <svg width="8" height="17" viewBox="0 0 8 17" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7.13382 7.1278L7.13379 7.12777L0.512271 0.509686L0.795057 0.226752L0.51227 0.509685C0.512123 0.509538 0.51201 0.509431 0.511927 0.509356L7.13382 7.1278ZM7.13382 7.1278C7.62239 7.61603 7.622 8.40641 7.13301 8.89414L7.13298 8.89417L0.502368 15.5089C0.50222 15.509 0.502106 15.5091 0.502022 15.5092C0.501841 15.5092 0.501547 15.5093 0.501149 15.5093C0.500827 15.5093 0.500574 15.5093 0.500392 15.5092L7.13055 8.89499C7.13056 8.89498 7.13057 8.89497 7.13058 8.89495C7.61976 8.407 7.62011 7.61541 7.13138 7.12699L7.13382 7.1278Z"></path></svg></Link>
                                                        <i className="open_mnu down_icon"></i>
                                                        <ul className="dropdown-menu">

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/yen-nuoc-chung-duong-phen" title="Yến nước chưng đường phèn">Yến nước chưng đường phèn</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/yen-nuoc-ky-tu" title="Yến nước kỳ tử">Yến nước kỳ tử</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/yen-nuoc-duong-an-kieng" title="Yến nước đường ăn kiêng">Yến nước đường ăn kiêng</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/yen-nuoc-nha-dam-hat-chia" title="Yến nước nha đam hạt chia">Yến nước nha đam hạt chia</Link>
                                                            </li>

                                                        </ul>
                                                    </li>



                                                    <li className="dropdown-submenu nav-item-lv2 has-childs2">
                                                        <Link className="nav-link" href="/dong-trung-ha-thao" title="Đông trùng hạ thảo">Đông trùng hạ thảo <svg width="8" height="17" viewBox="0 0 8 17" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7.13382 7.1278L7.13379 7.12777L0.512271 0.509686L0.795057 0.226752L0.51227 0.509685C0.512123 0.509538 0.51201 0.509431 0.511927 0.509356L7.13382 7.1278ZM7.13382 7.1278C7.62239 7.61603 7.622 8.40641 7.13301 8.89414L7.13298 8.89417L0.502368 15.5089C0.50222 15.509 0.502106 15.5091 0.502022 15.5092C0.501841 15.5092 0.501547 15.5093 0.501149 15.5093C0.500827 15.5093 0.500574 15.5093 0.500392 15.5092L7.13055 8.89499C7.13056 8.89498 7.13057 8.89497 7.13058 8.89495C7.61976 8.407 7.62011 7.61541 7.13138 7.12699L7.13382 7.1278Z"></path></svg></Link>
                                                        <i className="open_mnu down_icon"></i>
                                                        <ul className="dropdown-menu">

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/nam-dong-trung-ha-thao-tuoi" title="Nấm đông trùng hạ thảo tươi">Nấm đông trùng hạ thảo tươi</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/nam-dong-trung-ha-thao-kho" title="Nấm đông trùng hạ thảo khô">Nấm đông trùng hạ thảo khô</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/vien-dong-trung-ha-thao" title="Viên đông trùng hạ thảo">Viên đông trùng hạ thảo</Link>
                                                            </li>

                                                        </ul>
                                                    </li>



                                                    <li className="dropdown-submenu nav-item-lv2 has-childs2">
                                                        <Link className="nav-link" href="/sam-han-quoc" title="Sâm Hàn Quốc">Sâm Hàn Quốc <svg width="8" height="17" viewBox="0 0 8 17" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7.13382 7.1278L7.13379 7.12777L0.512271 0.509686L0.795057 0.226752L0.51227 0.509685C0.512123 0.509538 0.51201 0.509431 0.511927 0.509356L7.13382 7.1278ZM7.13382 7.1278C7.62239 7.61603 7.622 8.40641 7.13301 8.89414L7.13298 8.89417L0.502368 15.5089C0.50222 15.509 0.502106 15.5091 0.502022 15.5092C0.501841 15.5092 0.501547 15.5093 0.501149 15.5093C0.500827 15.5093 0.500574 15.5093 0.500392 15.5092L7.13055 8.89499C7.13056 8.89498 7.13057 8.89497 7.13058 8.89495C7.61976 8.407 7.62011 7.61541 7.13138 7.12699L7.13382 7.1278Z"></path></svg></Link>
                                                        <i className="open_mnu down_icon"></i>
                                                        <ul className="dropdown-menu">

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/hong-sam" title="Hồng sâm">Hồng sâm</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/thien-sam" title="Thiên sâm">Thiên sâm</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/hac-sam" title="Hắc sâm">Hắc sâm</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/sam-tuoi" title="Sâm tươi">Sâm tươi</Link>
                                                            </li>

                                                        </ul>
                                                    </li>



                                                    <li className="dropdown-submenu nav-item-lv2 has-childs2">
                                                        <Link className="nav-link" href="/saffron" title="Saffron">Saffron <svg width="8" height="17" viewBox="0 0 8 17" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7.13382 7.1278L7.13379 7.12777L0.512271 0.509686L0.795057 0.226752L0.51227 0.509685C0.512123 0.509538 0.51201 0.509431 0.511927 0.509356L7.13382 7.1278ZM7.13382 7.1278C7.62239 7.61603 7.622 8.40641 7.13301 8.89414L7.13298 8.89417L0.502368 15.5089C0.50222 15.509 0.502106 15.5091 0.502022 15.5092C0.501841 15.5092 0.501547 15.5093 0.501149 15.5093C0.500827 15.5093 0.500574 15.5093 0.500392 15.5092L7.13055 8.89499C7.13056 8.89498 7.13057 8.89497 7.13058 8.89495C7.61976 8.407 7.62011 7.61541 7.13138 7.12699L7.13382 7.1278Z"></path></svg></Link>
                                                        <i className="open_mnu down_icon"></i>
                                                        <ul className="dropdown-menu">

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/saffron-tay-a" title="Saffron Tây Á">Saffron Tây Á</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/set-qua-tang-saffron" title="Set quà tặng Saffron">Set quà tặng Saffron</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/mat-ong-saffron" title="Mật ong Saffron">Mật ong Saffron</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/my-pham-saffron" title="Mỹ phẩm Saffron">Mỹ phẩm Saffron</Link>
                                                            </li>

                                                        </ul>
                                                    </li>



                                                    <li className="dropdown-submenu nav-item-lv2 has-childs2">
                                                        <Link className="nav-link" href="/soup" title="Soup">Soup <svg width="8" height="17" viewBox="0 0 8 17" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7.13382 7.1278L7.13379 7.12777L0.512271 0.509686L0.795057 0.226752L0.51227 0.509685C0.512123 0.509538 0.51201 0.509431 0.511927 0.509356L7.13382 7.1278ZM7.13382 7.1278C7.62239 7.61603 7.622 8.40641 7.13301 8.89414L7.13298 8.89417L0.502368 15.5089C0.50222 15.509 0.502106 15.5091 0.502022 15.5092C0.501841 15.5092 0.501547 15.5093 0.501149 15.5093C0.500827 15.5093 0.500574 15.5093 0.500392 15.5092L7.13055 8.89499C7.13056 8.89498 7.13057 8.89497 7.13058 8.89495C7.61976 8.407 7.62011 7.61541 7.13138 7.12699L7.13382 7.1278Z"></path></svg></Link>
                                                        <i className="open_mnu down_icon"></i>
                                                        <ul className="dropdown-menu">

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/soup-vi-ca-bao-ngu-to-yen" title="Soup Vi cá - bào ngư - tổ yến">Soup Vi cá - bào ngư - tổ yến</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/soup-vi-ca-bao-ngu" title="Soup Vi cá - bào ngư">Soup Vi cá - bào ngư</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/bat-tran-ngu-xi-ngu-thien" title="Bát Trân Ngư Xí Ngự Thiện">Bát Trân Ngư Xí Ngự Thiện</Link>
                                                            </li>

                                                            <li className="nav-item-lv3">
                                                                <Link className="nav-link" href="/bat-tran-uy-uy-ngu-thien" title="Bát Trân Uy Uy Ngự Thiện">Bát Trân Uy Uy Ngự Thiện</Link>
                                                            </li>

                                                        </ul>
                                                    </li>



                                                    <li className="nav-item-lv2">
                                                        <Link className="nav-link" href="/qua-bieu-cao-cap" title="Quà biếu cao cấp">Quà biếu cao cấp</Link>
                                                    </li>


                                                </ul> */}

                                            </li>



                                            <li className="nav-item has-childs " data-section="header_nav">
                                                <Link href="/kien-thuc" className="nav-link" title="Tin tức">Tin tức
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"></path>
                                                    </svg>
                                                </Link>
                                                <i className="open_mnu down_icon"></i>

                                                <ul className="dropdown-menu">


                                                    <li className="nav-item-lv2">
                                                        <Link className="nav-link" href="/kien-thuc" title="Kiến thức">Kiến thức</Link>
                                                    </li>



                                                    <li className="nav-item-lv2">
                                                        <Link className="nav-link" href="/kinh-nghiem" title="Kinh nghiệm">Kinh nghiệm</Link>
                                                    </li>


                                                </ul>

                                            </li>



                                            <li className="nav-item has-childs " data-section="header_nav">
                                                <Link href="/chinh-sach-mua-hang" className="nav-link" title="Chính sách">Chính sách
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"></path>
                                                    </svg>
                                                </Link>
                                                <i className="open_mnu down_icon"></i>

                                                <ul className="dropdown-menu">


                                                    <li className="nav-item-lv2">
                                                        <Link className="nav-link" href="/chinh-sach-mua-hang" title="Chính sách mua hàng">Chính sách mua hàng</Link>
                                                    </li>



                                                    <li className="nav-item-lv2">
                                                        <Link className="nav-link" href="/chinh-sach-thanh-toan" title="Chính sách thanh toán">Chính sách thanh toán</Link>
                                                    </li>



                                                    <li className="nav-item-lv2">
                                                        <Link className="nav-link" href="/chinh-sach-van-chuyen" title="Chính sách vận chuyển">Chính sách vận chuyển</Link>
                                                    </li>



                                                    <li className="nav-item-lv2">
                                                        <Link className="nav-link" href="/cam-ket-cua-hang" title="Cam kết cửa hàng">Cam kết cửa hàng</Link>
                                                    </li>



                                                    <li className="nav-item-lv2">
                                                        <Link className="nav-link" href="/chinh-sach-bao-mat" title="Chính sách bảo mật">Chính sách bảo mật</Link>
                                                    </li>



                                                    <li className="nav-item-lv2">
                                                        <Link className="nav-link" href="/chinh-sach-thanh-vien" title="Chính sách thành viên">Chính sách thành viên</Link>
                                                    </li>


                                                </ul>

                                            </li>



                                            <li className="nav-item ">
                                                <Link className="nav-link" href="/lien-he" title="Liên hệ">Liên hệ</Link>
                                            </li>


                                        </ul>
                                    </div>
                                    <div className="control-menu">
                                        <Link href="#" id="prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="#fff" d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path></svg></Link>
                                        <Link href="#" id="next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="#fff" d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg></Link>
                                    </div>

                                    <div className="button-promo">
                                        <Link href="/san-pham-khuyen-mai" title="Hot deal" className="duration-300">
                                            <img src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/btn_promotion_icon.png?1739018973665" data-src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/btn_promotion_icon.png?1739018973665" alt="Hot deal" className="imgzyload loaded" data-was-processed="true" />
                                            <span>Hot deal</span>
                                        </Link>
                                    </div>


                                </div>
                            </div>
                            <ul className="md-hidden list-menu-account">

                                <li className="li-account">
                                    <Link href="/san-pham-khuyen-mai" title="Hot deal" className="promo">
                                        <img src="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC" data-src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/btn_promotion_icon.png?img8973665" alt="Hot deal" className="lazyload" />
                                        Hot deal
                                    </Link>
                                </li>

                                <li className="li-account">
                                    <Link href="/danh-sach-yeu-thich" title="Danh sách yêu thích">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path>
                                        </svg>
                                        Danh sách Yêu thích <div className="js-wishlist-count">{wishlist.length}</div>
                                    </Link>
                                </li>
                                <li className="li-account">
                                    <Link href="/he-thong-cua-hang" title="Cửa hàng">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 0C6.12297 0 2.96875 3.15422 2.96875 7.03125C2.96875 8.34117 3.3316 9.61953 4.01832 10.7286L9.59977 19.723C9.70668 19.8953 9.89504 20 10.0976 20C10.0992 20 10.1007 20 10.1023 20C10.3066 19.9984 10.4954 19.8905 10.6003 19.7152L16.0395 10.6336C16.6883 9.54797 17.0312 8.3023 17.0312 7.03125C17.0312 3.15422 13.877 0 10 0ZM15.0338 10.032L10.0888 18.2885L5.01434 10.1112C4.44273 9.18805 4.13281 8.12305 4.13281 7.03125C4.13281 3.80039 6.76914 1.16406 10 1.16406C13.2309 1.16406 15.8633 3.80039 15.8633 7.03125C15.8633 8.09066 15.5738 9.12844 15.0338 10.032Z" fill="white"></path>
                                            <path d="M10 3.51562C8.06148 3.51562 6.48438 5.09273 6.48438 7.03125C6.48438 8.95738 8.03582 10.5469 10 10.5469C11.9884 10.5469 13.5156 8.93621 13.5156 7.03125C13.5156 5.09273 11.9385 3.51562 10 3.51562ZM10 9.38281C8.7009 9.38281 7.64844 8.32684 7.64844 7.03125C7.64844 5.73891 8.70766 4.67969 10 4.67969C11.2923 4.67969 12.3477 5.73891 12.3477 7.03125C12.3477 8.30793 11.3197 9.38281 10 9.38281Z" fill="white"></path>
                                        </svg>
                                        Cửa hàng
                                    </Link>
                                </li>

                                <li className="li-account">
                                    <Link title="Điện thoại: 1900 6750" href="tel:19006750">
                                        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_509_108)">
                                                <path d="M18.1771 14.2476C17.7063 13.7573 17.1383 13.4952 16.5364 13.4952C15.9393 13.4952 15.3665 13.7525 14.8762 14.2428L13.3422 15.7719C13.216 15.7039 13.0898 15.6408 12.9685 15.5777C12.7937 15.4903 12.6287 15.4078 12.4879 15.3204C11.051 14.4078 9.74519 13.2185 8.49278 11.6797C7.88599 10.9127 7.47823 10.2671 7.18212 9.61177C7.58017 9.2477 7.9491 8.86906 8.30832 8.50499C8.44424 8.36907 8.58016 8.22829 8.71608 8.09237C9.73548 7.07297 9.73548 5.7526 8.71608 4.73319L7.39085 3.40797C7.24037 3.25748 7.08503 3.10214 6.9394 2.94681C6.64814 2.64584 6.34232 2.33516 6.02679 2.04391C5.55592 1.57789 4.99282 1.33032 4.4006 1.33032C3.80837 1.33032 3.23556 1.57789 2.75013 2.04391C2.74528 2.04876 2.74528 2.04876 2.74043 2.05361L1.08996 3.71864C0.46861 4.33999 0.114245 5.09726 0.0365763 5.97589C-0.0799271 7.39335 0.337543 8.71372 0.657928 9.57779C1.44433 11.6991 2.61907 13.6651 4.37147 15.7719C6.49766 18.3107 9.05588 20.3155 11.9782 21.7281C13.0947 22.2572 14.5849 22.8834 16.25 22.9902C16.3519 22.9951 16.4587 22.9999 16.5558 22.9999C17.6771 22.9999 18.6189 22.597 19.3567 21.7961C19.3616 21.7864 19.3713 21.7815 19.3761 21.7718C19.6286 21.466 19.9198 21.1893 20.2256 20.8932C20.4344 20.6942 20.648 20.4854 20.8567 20.267C21.3373 19.767 21.5897 19.1845 21.5897 18.5874C21.5897 17.9855 21.3324 17.4078 20.8421 16.9224L18.1771 14.2476ZM19.915 19.3592C19.9101 19.3641 19.9101 19.3592 19.915 19.3592C19.7256 19.5631 19.5315 19.7476 19.3227 19.9514C19.0072 20.2524 18.6868 20.5679 18.3859 20.9223C17.8956 21.4466 17.3179 21.6941 16.5606 21.6941C16.4878 21.6941 16.4102 21.6941 16.3373 21.6893C14.8956 21.5971 13.5558 21.034 12.551 20.5534C9.80344 19.2233 7.39085 17.335 5.38602 14.9418C3.7307 12.9467 2.62392 11.102 1.89092 9.12149C1.43947 7.91276 1.27442 6.97103 1.34724 6.08269C1.39578 5.51474 1.61423 5.04387 2.01713 4.64096L3.67245 2.98564C3.91031 2.76234 4.16274 2.64099 4.41031 2.64099C4.71613 2.64099 4.9637 2.82545 5.11904 2.98079C5.12389 2.98564 5.12874 2.9905 5.1336 2.99535C5.42971 3.27205 5.71126 3.55845 6.00737 3.86427C6.15786 4.01961 6.3132 4.17495 6.46853 4.33514L7.79376 5.66036C8.30832 6.17492 8.30832 6.65064 7.79376 7.1652C7.65298 7.30597 7.51706 7.44675 7.37629 7.58267C6.96853 8.00014 6.58018 8.38848 6.15786 8.76712C6.14815 8.77683 6.13844 8.78168 6.13359 8.79139C5.71612 9.20886 5.79378 9.61662 5.88116 9.89332C5.88602 9.90788 5.89087 9.92245 5.89573 9.93701C6.24038 10.7719 6.72581 11.5583 7.46367 12.4952L7.46852 12.5001C8.80831 14.1505 10.2209 15.4369 11.7791 16.4224C11.9782 16.5486 12.1821 16.6505 12.3762 16.7476C12.551 16.835 12.716 16.9175 12.8568 17.0049C12.8762 17.0146 12.8956 17.0292 12.9151 17.0389C13.0801 17.1214 13.2354 17.1602 13.3956 17.1602C13.7985 17.1602 14.051 16.9078 14.1335 16.8253L15.7937 15.1651C15.9587 15.0001 16.2208 14.801 16.5267 14.801C16.8276 14.801 17.0752 14.9903 17.2257 15.1554C17.2305 15.1602 17.2305 15.1602 17.2354 15.1651L19.9101 17.8398C20.4101 18.335 20.4101 18.8447 19.915 19.3592Z" fill="white"></path>
                                                <path d="M12.4296 5.47116C13.7014 5.68475 14.8567 6.28669 15.779 7.209C16.7013 8.13132 17.2984 9.28665 17.5169 10.5585C17.5703 10.8789 17.847 11.1022 18.1625 11.1022C18.2013 11.1022 18.2353 11.0973 18.2741 11.0924C18.6334 11.0342 18.8712 10.6944 18.813 10.3352C18.5508 8.79636 17.8227 7.39347 16.7111 6.28183C15.5994 5.17019 14.1965 4.44205 12.6577 4.17992C12.2985 4.12166 11.9635 4.35953 11.9004 4.71389C11.8373 5.06825 12.0703 5.41291 12.4296 5.47116Z" fill="white"></path>
                                                <path d="M22.9732 10.1458C22.5411 7.61184 21.347 5.30604 19.512 3.47111C17.6771 1.63618 15.3713 0.442024 12.8374 0.00999088C12.483 -0.0531151 12.148 0.1896 12.0849 0.543965C12.0267 0.903183 12.2646 1.23813 12.6238 1.30124C14.8859 1.68473 16.949 2.75753 18.5897 4.39343C20.2305 6.03419 21.2984 8.09727 21.6819 10.3594C21.7353 10.6798 22.012 10.9031 22.3275 10.9031C22.3664 10.9031 22.4003 10.8982 22.4392 10.8933C22.7935 10.84 23.0363 10.5001 22.9732 10.1458Z" fill="white"></path>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_509_108">
                                                    <rect width="23" height="23" fill="white"></rect>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        Hotline: <span className="acc-text">1900 6750</span>
                                    </Link>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mobile-nav-overflow"></div>
            </header>
        </>
    );
}
