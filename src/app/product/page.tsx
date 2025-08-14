'use client';
import Link from "next/link";
import "../styles/listProduct.css";
import useSWR from 'swr';
import { getProductsPage } from "../lib/product";
import { getCategories } from "../lib/category";
import { Product } from "@/app/types/product";
import { useMemo, useState } from "react";
import AddToCart from "../addToCart/page";
import AddToWishlist from "../addToWishlist/page";
import WishlistModal from "../wishlistModal/page";
import CartModal from "../cartModal/page";

const useCategories = () => {
    const { data, error, isLoading } = useSWR("categories", getCategories);

    return {
        categories: data?.data || [],
        isLoading,
        isError: error
    };
};

export default function ListProductPage() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedRanges, setSelectedRanges] = useState<[number, number | null][]>([]); // [min, max]
    const [showModal, setShowModal] = useState(false);
    const [actionText, setActionText] = useState<"add" | "remove">("add");

    const [isActive, setIsActive] = useState(false);
    const [sortType, setSortType] = useState("default");

    // Dùng SWR lấy sản phẩm theo trang
    const { data: productData, isLoading: loadingProducts } = useSWR(
        ["products", currentPage],
        () => getProductsPage(currentPage)
    );

    // Dùng SWR lấy danh mục
    const { categories, isLoading: loadingCategories } = useCategories();

    const products: Product[] = productData?.data || [];
    const totalPages: number = productData?.meta?.last_page || 0;


    // Cập nhật khoảng giá khi tick
    const handlePriceFilterChange = (min: number, max: number | null, checked: boolean) => {
        setSelectedRanges(prev => {
            if (checked) {
                return [...prev, [min, max]];
            } else {
                return prev.filter(([pMin, pMax]) => pMin !== min || pMax !== max);
            }
        });
    };

    // Lọc & Sắp xếp
    const filteredAndSortedItems = useMemo(() => {
        let filtered = [...products];

        // Lọc theo giá
        if (selectedRanges.length > 0) {
            filtered = filtered.filter(p => {
                return selectedRanges.some(([min, max]) => {
                    if (max === null) return p.price > min; // Trên max
                    return p.price >= min && p.price <= max;
                });
            });
        }

        // Sắp xếp
        switch (sortType) {
            case "alpha-asc":
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "alpha-desc":
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "created-desc":
                filtered.sort((a, b) => b.id - a.id);
                break;
            case "price-asc":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                filtered.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }
        return filtered;
    }, [products, sortType, selectedRanges]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleToggleWishlist = (action: "add" | "remove") => {
        setActionText(action);
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2500);
    };


    const renderPagination = () => {
        const paginationItems = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - (maxVisiblePages - 1));
        }

        if (startPage > 1) {
            paginationItems.push(
                <li key={1} className="page-item">
                    <Link href="#" className="page-link" onClick={() => handlePageChange(1)}>1</Link>
                </li>
            );
            if (startPage > 2) {
                paginationItems.push(<li key="ellipsis-start" className="page-item disabled"><span className="page-link">...</span></li>);
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            paginationItems.push(
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <Link href="#" className="page-link" onClick={() => handlePageChange(page)}>{page}</Link>
                </li>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationItems.push(<li key="ellipsis-end" className="page-item disabled"><span className="page-link">...</span></li>);
            }
            paginationItems.push(
                <li key={totalPages} className="page-item">
                    <Link href="#" className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</Link>
                </li>
            );
        }

        return paginationItems;
    };


    return (
        <>
            <div className="layout-collection">
                <section className="bread-crumb">
                    <div className="container">
                        <ul className="breadcrumb">
                            <li className="home">
                                <Link href="/" title="Trang chủ"><span>Trang chủ</span></Link>
                                <span className="mr_lr">&nbsp;<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-chevron-right fa-w-10"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" ></path></svg>&nbsp;</span>
                            </li>
                            <li><strong><span> Tất cả sản phẩm</span></strong></li>
                        </ul>
                    </div>
                </section>

                <div className="container">
                    <div className="row">
                        <aside className={`dqdt-sidebar left-content ${isActive ? "active" : ""} `}>
                            <div className="close-filters" title="Đóng bộ lọc" onClick={() => setIsActive(!isActive)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"></path>
                                </svg>
                            </div>
                            <div className="section-box-bg">
                                <div className="filter-content">
                                    <div className="filter-container">
                                        <div className="filter-container__selected-filter " style={{ display: 'none' }}>
                                            {/* <!-- Hiển thị khi có bộ lọc đã chọn --> */}
                                            <div className="filter-container__selected-filter-header clearfix">
                                                <span className="filter-container__selected-filter-header-title"><i className="fa fa-arrow-left hidden-sm-up"></i> Bạn chọn</span>
                                                <Link href="javascript:void(0) onClick={() => clearAllFiltered()}" className="filter-container__clear-all" title="Bỏ chọn hết">Bỏ chọn hết <i className="icon"><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" width="10" height="10" x="0" y="0" viewBox="0 0 365.696 365.696" xmlSpace="preserve" className=""><g><path xmlns="http://www.w3.org/2000/svg" d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0" fill="#ffffff" data-original="#000000" style={{}} className=""></path></g></svg></i></Link>
                                            </div>
                                            <div className="filter-container__selected-filter-list">
                                                <ul></ul>
                                            </div>
                                        </div>
                                        {/* <!-- Lọc giá --> */}

                                        <aside className="aside-item filter-price">
                                            <div className="aside-title">
                                                <h2><span>Chọn mức giá</span></h2>
                                            </div>
                                            <div className="aside-content filter-group content_price">
                                                <ul>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label data-filter="2-000-000d" htmlFor="filter-duoi-2-000-000d">
                                                                <input type="checkbox" id="filter-duoi-2-000-000d" data-group="Khoảng giá" data-field="price_min" data-text="Dưới 2.000.000đ" value="(<2000000)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Dưới 2 triệu
                                                            </label>
                                                        </span>
                                                    </li>

                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <label>
                                                            <input type="checkbox" onChange={(e) => handlePriceFilterChange(2000000, 6000000, e.target.checked)} />
                                                            Từ 2 - 6 triệu
                                                            <i className="fa"></i>
                                                        </label>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <label>
                                                            <input type="checkbox" onChange={(e) => handlePriceFilterChange(6000000, 15000000, e.target.checked)} />
                                                            Từ 6 - 15 triệu
                                                            <i className="fa"></i>

                                                        </label>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <label>
                                                            <input type="checkbox" onChange={(e) => handlePriceFilterChange(15000000, 20000000, e.target.checked)} />
                                                            Từ 15 - 20 triệu
                                                            <i className="fa"></i>
                                                        </label>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <label>
                                                            <input type="checkbox" onChange={(e) => handlePriceFilterChange(20000000, null, e.target.checked)} />
                                                            Trên 20 triệu
                                                            <i className="fa"></i>

                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                        </aside>

                                        {/* <!-- End Lọc giá --> */}
                                        {/* <!-- Lọc Loại --> */}
                                        <aside className="aside-item aside-itemxx filter-type">
                                            <div className="aside-title">
                                                <h2 className="title-filter title-head margin-top-0"><span>Loại sản phẩm</span></h2>
                                            </div>
                                            <div className="aside-content filter-group">
                                                <ul>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-set-qua">
                                                                <input type="checkbox" id="filter-set-qua" data-group="PRODUCT_TYPE" data-field="product_type.filter_key" data-text="" value="(&quot;Set quà&quot;)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Set quà
                                                            </label>
                                                        </span>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-my-pham">
                                                                <input type="checkbox" id="filter-my-pham" data-group="PRODUCT_TYPE" data-field="product_type.filter_key" data-text="" value="(&quot;Mỹ phẩm&quot;)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Mỹ phẩm
                                                            </label>
                                                        </span>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-saffron-cao-cap">
                                                                <input type="checkbox" id="filter-saffron-cao-cap" data-group="PRODUCT_TYPE" data-field="product_type.filter_key" data-text="" value="(&quot;Saffron Cao Cấp&quot;)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Saffron Cao Cấp
                                                            </label>
                                                        </span>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-thien-sam">
                                                                <input type="checkbox" id="filter-thien-sam" data-group="PRODUCT_TYPE" data-field="product_type.filter_key" data-text="" value="(&quot;Thiên Sâm&quot;)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Thiên Sâm
                                                            </label>
                                                        </span>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-yen-chung">
                                                                <input type="checkbox" id="filter-yen-chung" data-group="PRODUCT_TYPE" data-field="product_type.filter_key" data-text="" value="(&quot;Yến Chưng&quot;)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Yến Chưng
                                                            </label>
                                                        </span>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-soup">
                                                                <input type="checkbox" id="filter-soup" data-group="PRODUCT_TYPE" data-field="product_type.filter_key" data-text="" value="(&quot;Soup&quot;)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Soup
                                                            </label>
                                                        </span>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-sam-tuoi">
                                                                <input type="checkbox" id="filter-sam-tuoi" data-group="PRODUCT_TYPE" data-field="product_type.filter_key" data-text="" value="(&quot;Sâm Tươi&quot;)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Sâm Tươi
                                                            </label>
                                                        </span>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-hong-sam">
                                                                <input type="checkbox" id="filter-hong-sam" data-group="PRODUCT_TYPE" data-field="product_type.filter_key" data-text="" value="(&quot;Hồng Sâm&quot;)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Hồng Sâm
                                                            </label>
                                                        </span>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-hac-sam">
                                                                <input type="checkbox" id="filter-hac-sam" data-group="PRODUCT_TYPE" data-field="product_type.filter_key" data-text="" value="(&quot;Hắc Sâm&quot;)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Hắc Sâm
                                                            </label>
                                                        </span>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-yen-tinh-che">
                                                                <input type="checkbox" id="filter-yen-tinh-che" data-group="PRODUCT_TYPE" data-field="product_type.filter_key" data-text="" value="(&quot;Yến Tinh Chế&quot;)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Yến Tinh Chế
                                                            </label>
                                                        </span>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-yen-tho">
                                                                <input type="checkbox" id="filter-yen-tho" data-group="PRODUCT_TYPE" data-field="product_type.filter_key" data-text="" value="(&quot;Yến Thô&quot;)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Yến Thô
                                                            </label>
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </aside>

                                    </div>
                                </div>
                            </div>
                        </aside>
                        <div className="col-12 col-banner">
                            <Link href="/collections/all" title="click xem ngay" className="duration-300 has-aspect-1">
                                <picture>
                                    <source media="(max-width: 480px)" srcSet="//bizweb.dktcdn.net/thumb/large/100/506/650/themes/944598/assets/collection_banner_mb.jpg?1739018973665" />
                                    <img alt="Banner top" width="1250" height="306" className="lazyload loaded" data-src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/collection_banner.jpg?1739018973665" src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/collection_banner.jpg?1739018973665" data-was-processed="true" />
                                </picture>
                            </Link>
                        </div>
                        <div className="col-12">
                            <div className="col-title">
                                <h1>Tất cả sản phẩm</h1>
                                <div className="title-separator">
                                    <div className="separator-center"></div>
                                </div>
                            </div>
                            <div className="col-list-cate">

                                <div className="menu-list">
                                    {loadingCategories ? (
                                        <p>Đang tải danh mục...</p>
                                    ) : (
                                        categories.map((category) => (
                                            <Link key={category.id} className="cate-item duration-300" href={`/collections/${category.slug}`} title={category.name}>
                                                <div className="cate-info-title">{category.name}</div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="col-desc">
                                <p><strong>Sudes Nest</strong> đến nay đã chiếm trọn niềm tin của khách hàng bởi chất lượng - tinh tế - hợp khẩu vị trong từng dòng sản phẩm về Yến sào. <strong>Sudes Nest</strong> luôn mang đến cho quý khách hàng những sản phẩm chất lượng nhất - tốt nhất - tinh hoa nhất với đội ngũ chuyên gia nghiên cứu dinh dưỡng hàng đầu Việt Nam và luôn đầu tư dây chuyền sản xuất công nghệ cao, hiện đại, quy mô sản xuất lớn.</p>
                            </div>


                        </div>

                        <div className="block-collection col-lg-12 col-12">
                            <div className="category-products products-view products-view-grid list_hover_pro">
                                <div className="filter-containers">

                                    <div className="sort-cate clearfix">

                                        <div className="sudes-filter">
                                            <Link href="#" className="btn btn-outline btn-filter" title="Bộ lọc" onClick={(e) => { e.preventDefault(); setIsActive(!isActive) }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel-fill" viewBox="0 0 16 16">
                                                    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"></path>
                                                </svg>
                                                Bộ lọc
                                                <span className="count-filter-val">0</span>
                                            </Link>
                                        </div>

                                        <div className="sort-cate-right">
                                            <h3>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"></path>
                                                    <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"></path>
                                                </svg> Xếp theo</h3>
                                            <ul>
                                                <li className={`btn-quick-sort default ${sortType === "default" ? "active" : ""}`}>
                                                    <Link href="#" onClick={(e) => { e.preventDefault(); setSortType("default") }}>Mặc định</Link>
                                                </li>
                                                <li className={`btn-quick-sort alpha-asc ${sortType === "alpha-asc" ? "active" : ""}`}>
                                                    <Link href="#" onClick={(e) => { e.preventDefault(); setSortType("alpha-asc") }}>Tên A-Z</Link>
                                                </li>
                                                <li className={`btn-quick-sort alpha-desc ${sortType === "alpha-desc" ? "active" : ""}`}>
                                                    <Link href="#" onClick={(e) => { e.preventDefault(); setSortType("alpha-desc") }}>Tên Z-A</Link>
                                                </li>
                                                <li className={`btn-quick-sort position-desc ${sortType === "created-desc" ? "active" : ""}`}>
                                                    <Link href="#" onClick={(e) => { e.preventDefault(); setSortType("created-desc") }}>Hàng mới</Link>
                                                </li>
                                                <li className={`btn-quick-sort price-asc ${sortType === "price-asc" ? "active" : ""}`}>
                                                    <Link href="#" onClick={(e) => { e.preventDefault(); setSortType("price-asc") }}>Giá thấp đến cao</Link>
                                                </li>
                                                <li className={`btn-quick-sort price-desc ${sortType === "price-desc" ? "active" : ""}`}>
                                                    <Link href="#" onClick={(e) => { e.preventDefault(); setSortType("price-desc") }}>Giá cao xuống thấp</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>

                                <div className="products-view products-view-grid list_hover_pro">
                                    <div className="row">
                                        {/* sp 1 */}
                                        {loadingProducts ? (
                                            <p>Đang tải sản phẩm...</p>
                                        ) : (
                                                filteredAndSortedItems.map((product) => (
                                                <div className="col-6 col-md-3" key={product.id}>
                                                    <div className="item_product_main">

<<<<<<< HEAD
                                                            <form method="post" className="variants product-action item-product-main duration-300" data-cart-form="" data-id="product-actions-34775949" encType="multipart/form-data">
                                                            <span className="flash-sale">-
                                                                    {product.discount_price !== "0.00"
                                                                        ? ((parseInt(product.price) - parseInt(product.discount_price)) / parseInt(product.price) * 100).toFixed(0)
                                                                        : "0"}%
                                                            </span>
=======
                                                        <form action="/cart/add" method="post" className="variants product-action item-product-main duration-300" data-cart-form="" data-id="product-actions-34775949" encType="multipart/form-data">
                                                            {product.has_active_event ? (
                                                                <span className="flash-sale">-
                                                                    {product.event_discount_percentage}%
                                                                </span>
                                                            ) : (
                                                                product.base_discount > 0 && (
                                                                    <span className="flash-sale">-
                                                                        {Math.round(((product.base_price - (product.display_price || product.price)) / product.base_price) * 100)}%
                                                                    </span>
                                                                )
                                                            )}
>>>>>>> 8114f4cab21992087cdd79a04a056c920e3a25ca

                                                            <div className="product-thumbnail">
                                                                <Link className="image_thumb scale_hover" href={`/product/${product.id}`} title={product.name}>
                                                                        <img
                                                                            src={`${product.image}`}
                                                                            alt={product.name}
                                                                        />                                                                </Link>
                                                            </div>
                                                            <div className="product-info">
                                                                <div className="name-price">
                                                                    <h3 className="product-name line-clamp-2-new">
                                                                        <Link href={`/product/${product.id}`} title={product.name}>{product.name}</Link>
                                                                    </h3>
                                                                    <div className="product-price-cart">
<<<<<<< HEAD
                                                                            {product.discount_price !== "0.00" && (
                                                                                <span className="compare-price">{parseInt(product.price).toLocaleString()}₫</span>
                                                                            )}
                                                                            <span className="price">
                                                                                {parseInt(
                                                                                    product.discount_price === "0.00" ? product.price : product.discount_price
                                                                                ).toLocaleString()}₫
                                                                            </span>
=======
                                                                        {product.has_active_event ? (
                                                                            <>
                                                                                <span className="compare-price">{Number(product.original_price).toLocaleString('vi-VN')}₫</span>
                                                                                <span className="price">{Number(product.display_price).toLocaleString('vi-VN')}₫</span>
                                                                                {product.event_info && (
                                                                                    <div className="event-badge">
                                                                                        <span className="badge bg-danger text-white">
                                                                                            🔥 {product.event_info.name}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {product.base_discount > 0 && (
                                                                                    <span className="compare-price">{Number(product.base_price).toLocaleString('vi-VN')}₫</span>
                                                                                )}
                                                                                <span className="price">{Number(product.display_price || product.price).toLocaleString('vi-VN')}₫</span>
                                                                            </>
                                                                        )}
>>>>>>> 8114f4cab21992087cdd79a04a056c920e3a25ca
                                                                    </div>
                                                                </div>
                                                                <div className="product-button">
                                                                    {/* <input type="hidden" name="variantId" value={product.variantId} /> */}
<<<<<<< HEAD
                                                                        <AddToCart product={product} onAddToCart={(product) => setSelectedProduct(product)} />

                                                                        <AddToWishlist product={product} onToggle={handleToggleWishlist} />
=======
                                                                    <button 
                                                                        className="btn-cart btn-views add_to_cart btn btn-primary" 
                                                                        title="Thêm vào giỏ hàng"
                                                                        onClick={() => {
                                                                            // Sử dụng giá sự kiện nếu có
                                                                            const productToAdd = product.has_active_event ? {
                                                                                ...product,
                                                                                price: product.display_price.toString(),
                                                                                discount_price: "0.00"
                                                                            } : product;
                                                                            // Thêm vào giỏ hàng logic ở đây
                                                                        }}
                                                                    >
                                                                        <span>Thêm vào giỏ</span>
                                                                        <svg enableBackground="new 0 0 32 32" height="512" viewBox="0 0 32 32" width="512" xmlns="http://www.w3.org/2000/svg"><g><g><path d="m23.8 30h-15.6c-3.3 0-6-2.7-6-6v-.2l.6-16c.1-3.3 2.8-5.8 6-5.8h14.4c3.2 0 5.9 2.5 6 5.8l.6 16c.1 1.6-.5 3.1-1.6 4.3s-2.6 1.9-4.2 1.9c0 0-.1 0-.2 0zm-15-26c-2.2 0-3.9 1.7-4 3.8l-.6 16.2c0 2.2 1.8 4 4 4h15.8c1.1 0 2.1-.5 2.8-1.3s1.1-1.8 1.1-2.9l-.6-16c-.1-2.2-1.8-3.8-4-3.8z"></path></g><g><path d="m16 14c-3.9 0-7-3.1-7-7 0-.6.4-1 1-1s1 .4 1 1c0 2.8 2.2 5 5 5s5-2.2 5-5c0-.6.4-1 1-1s1 .4 1 1c0 3.9-3.1 7-7 7z"></path></g></g></svg>
                                                                    </button>
                                                                    <Link href="javascript:void(0)" className="setWishlist btn-views btn-circle" data-wish={`product-${product.id}`} tabIndex={0} title="Thêm vào yêu thích">
                                                                        <img width="25" height="25" src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/heart.png?1739018973665" alt="Thêm vào yêu thích" />
                                                                    </Link>
>>>>>>> 8114f4cab21992087cdd79a04a056c920e3a25ca
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        {/* hết sp 1 */}

                                    </div>
                                </div>
                                <div className="pagenav">
                                    <nav className="collection-paginate clearfix relative nav_pagi w_100">
                                        <ul className="pagination clearfix">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <Link className="page-link" href="#" onClick={() => handlePageChange(currentPage - 1)}>«</Link>
                                            </li>
                                            {renderPagination()}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <Link className="page-link" href="#" onClick={() => handlePageChange(currentPage + 1)}>»</Link>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>


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
            {showModal && <WishlistModal action={actionText} />}
        </>
    );
}
