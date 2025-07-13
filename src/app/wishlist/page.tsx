"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ thêm useRouter
import Cookies from "js-cookie";

import { Product } from "../types/product";
import { getWishlist } from "../lib/wishlist";
import AddToCart from "@/app/addToCart/page";
import CartModal from "../cartModal/page";
import "../styles/listProduct.css";
import AddToWishlist from "../addToWishlist/page";
import WishlistModal from "../wishlistModal/page";

export default function SearchPage() {
    const [result, setResult] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [actionText, setActionText] = useState<"add" | "remove">("add");

    const router = useRouter();

    useEffect(() => {
        const fetchWishlist = async () => {
            const cookieData = Cookies.get("author");

            if (!cookieData) {
                router.push("/login");
                return;
            }

            try {
                const parsed = JSON.parse(cookieData);
                const data = await getWishlist(parsed.token); // ✅ truyền token vào
                const productsOnly = data.map((item: any) => item.product);
                setResult(productsOnly);
            } catch (err) {
                console.error("Lỗi khi load wishlist", err);
            }
        };

        fetchWishlist();
    }, []);

    const handleToggleWishlist = (action: "add" | "remove") => {
        setActionText(action);
        setShowModal(true);

        setTimeout(() => {
            setShowModal(false);
        }, 2500);
    };

    return (
        <>
            <section className="bread-crumb">
                <div className="container">
                    <ul className="breadcrumb">
                        <li className="home">
                            <Link href="/" title="Trang chủ"><span>Trang chủ</span></Link>
                            <span className="mr_lr">&nbsp;<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-chevron-right fa-w-10"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" ></path></svg>&nbsp;</span>
                        </li>
                        <li><strong><span>Tìm kiếm</span></strong></li>
                    </ul>
                </div>
            </section>

            <section className="page">
                <div className="container container--wishlist">
                    <div className="page-title category-title">
                        <h1 className="title-head">
                            <Link href="/danh-sach-yeu-thich" title="Danh sách yêu thích">Danh sách yêu thích</Link></h1>
                    </div>
                    <div className="content-page rte">
                        <div id="list-favorite">
                            <div className="list-favorite-right" data-type="wishlist">
                                <div className="list-favorite-main">
                                    <div className="list-favorite-list row">
                                        {result.length === 0 ? (
                                            <p>Không tìm thấy sản phẩm nào.</p>
                                        ) : (
                                            result.map((product: any) => (
                                                <div className="col-6 col-sm-6 col-md-4 col-lg-3" key={product.id}>
                                                    <div className="item_product_main js-wishlist-item">
                                                        <form method="post" className="variants product-action item-product-main duration-300" encType="multipart/form-data">
                                                            <span className="flash-sale">-
                                                                {/* {product.discount_price !== "0.00"
                                                                    ? ((parseInt(product.price) - parseInt(product.discount_price)) / parseInt(product.price) * 100).toFixed(0)
                                                                    : "0"}% */}
                                                                10%
                                                            </span>

                                                            <div className="product-thumbnail">
                                                                <Link className="image_thumb scale_hover" href="/to-yen-tinh-che-vip-loai-2" title="Tổ Yến Tinh Chế VIP Loại 2">
                                                                    <img className="lazyload duration-300 loaded" src="//bizweb.dktcdn.net/thumb/large/100/506/650/products/tinh-che-2-1-5565c813c66f4c63a00aaf83242ae033-master-1.jpg?v=1708395697850" data-src="//bizweb.dktcdn.net/thumb/large/100/506/650/products/tinh-che-2-1-5565c813c66f4c63a00aaf83242ae033-master-1.jpg?v=1708395697850" alt="Tổ Yến Tinh Chế VIP Loại 2" data-was-processed="true" />
                                                                </Link>
                                                            </div>
                                                            <div className="product-info">
                                                                <div className="name-price">
                                                                    <h3 className="product-name line-clamp-2-new">
                                                                        <Link href={`/product/${product.id}`} title={product.name}>{product.name}</Link>
                                                                    </h3>
                                                                    <div className="product-price-cart">
                                                                        <span className="compare-price">2.100.000₫</span>

                                                                        <span className="price">{Number(product.price).toLocaleString('vi-VN')}₫</span>
                                                                    </div>
                                                                </div>
                                                                <div className="product-button">
                                                                    <AddToCart product={product} onAddToCart={(product) => setSelectedProduct(product)} />
                                                                    <AddToWishlist product={product} onToggle={handleToggleWishlist} />

                                                                </div>
                                                            </div>
                                                        </form>
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
