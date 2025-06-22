'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from 'swr';
import { useState } from "react";
import { getProductsByCategory  } from "../../lib/category";
import { Product } from "../../types/product";
import { Category } from "../..//types/category";
import "../../styles/listProduct.css";

const useCategory = (id: number) => {
    const { data, error, isLoading } = useSWR(['category', id], () => getProductsByCategory(id));
    return {
        category: data || null,
        isLoading,
        isError: error
    };
};

const useProducts = (categoryId: number, page: number) => {
    const { data, error, isLoading } = useSWR(["products", categoryId, page], () => getProductsByCategory (categoryId, page));
    return {
        products: data?.data || [],
        totalPages: data?.meta?.last_page || 1,
        isLoading,
        isError: error
    };
};

export default function CategoryProductPage() {
    const params = useParams();
    const categoryId = Number(params.id);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { category, isLoading: loadingCategory } = useCategory(categoryId);
    const { products, totalPages, isLoading: loadingProducts } = useProducts(categoryId, currentPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
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
                        <aside className="dqdt-sidebar left-content">
                            <div className="close-filters" title="Đóng bộ lọc">
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
                                                        <span>
                                                            <label data-filter="6-000-000d" htmlFor="filter-2-000-000d-6-000-000d">
                                                                <input type="checkbox" id="filter-2-000-000d-6-000-000d" data-group="Khoảng giá" data-field="price_min" data-text="2.000.000đ - 6.000.000đ" value="(>=2000000 AND <=6000000)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Từ 2 triệu - 6 triệu
                                                            </label>
                                                        </span>
                                                    </li>

                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label data-filter="15-000-000d" htmlFor="filter-6-000-000d-15-000-000d">
                                                                <input type="checkbox" id="filter-6-000-000d-15-000-000d" data-group="Khoảng giá" data-field="price_min" data-text="6.000.000đ - 15.000.000đ" value="(>=6000000 AND <=15000000)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Từ 6 triệu - 15 triệu
                                                            </label>
                                                        </span>
                                                    </li>

                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label data-filter="20-000-000d" htmlFor="filter-15-000-000d-20-000-000d">
                                                                <input type="checkbox" id="filter-15-000-000d-20-000-000d" data-group="Khoảng giá" data-field="price_min" data-text="15.000.000đ - 20.000.000đ" value="(>=15000000 AND <=20000000)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Từ 15 triệu - 20 triệu
                                                            </label>
                                                        </span>
                                                    </li>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label data-filter="20-000-000d" htmlFor="filter-tren20-000-000d">
                                                                <input type="checkbox" id="filter-tren20-000-000d" data-group="Khoảng giá" data-field="price_min" data-text="Trên 20.000.000đ" value="(>20000000)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Trên 20 triệu
                                                            </label>
                                                        </span>
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
                                        {/* <!-- End Lọc Loại --> */}

                                        {/* <!-- Lọc Thương hiệu --> */}



                                        <aside className="aside-item filter-vendor f-left">
                                            <div className="aside-title">
                                                <h2 className="title-filter title-head margin-top-0"><span>Thương hiệu</span></h2>
                                            </div>
                                            <div className="aside-content margin-top-0 filter-group">
                                                <ul>


                                                    <li className="filter-item filter-item--check-box filter-item--green ">
                                                        <span>
                                                            <label htmlFor="filter-the-journey-of-skin">
                                                                <input type="checkbox" id="filter-the-journey-of-skin" data-group="Hãng" data-field="vendor" data-text="The Journey of Skin" value="(The Journey of Skin)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                The Journey of Skin
                                                            </label>
                                                        </span>
                                                    </li>



                                                    <li className="filter-item filter-item--check-box filter-item--green ">
                                                        <span>
                                                            <label htmlFor="filter-saffron-shyam">
                                                                <input type="checkbox" id="filter-saffron-shyam" data-group="Hãng" data-field="vendor" data-text="Saffron SHYAM" value="(Saffron SHYAM)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Saffron SHYAM
                                                            </label>
                                                        </span>
                                                    </li>



                                                    <li className="filter-item filter-item--check-box filter-item--green ">
                                                        <span>
                                                            <label htmlFor="filter-kgs-han-quoc">
                                                                <input type="checkbox" id="filter-kgs-han-quoc" data-group="Hãng" data-field="vendor" data-text="KGS Hàn Quốc" value="(KGS Hàn Quốc)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                KGS Hàn Quốc
                                                            </label>
                                                        </span>
                                                    </li>



                                                    <li className="filter-item filter-item--check-box filter-item--green ">
                                                        <span>
                                                            <label htmlFor="filter-thuong-vy-yen-dao">
                                                                <input type="checkbox" id="filter-thuong-vy-yen-dao" data-group="Hãng" data-field="vendor" data-text="Thượng Vy Yến đảo" value="(Thượng Vy Yến đảo)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Thượng Vy Yến đảo
                                                            </label>
                                                        </span>
                                                    </li>



                                                    <li className="filter-item filter-item--check-box filter-item--green ">
                                                        <span>
                                                            <label htmlFor="filter-kanghwa">
                                                                <input type="checkbox" id="filter-kanghwa" data-group="Hãng" data-field="vendor" data-text="KangHwa" value="(KangHwa)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                KangHwa
                                                            </label>
                                                        </span>
                                                    </li>



                                                    <li className="filter-item filter-item--check-box filter-item--green ">
                                                        <span>
                                                            <label htmlFor="filter-sanga">
                                                                <input type="checkbox" id="filter-sanga" data-group="Hãng" data-field="vendor" data-text="SangA" value="(SangA)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                SangA
                                                            </label>
                                                        </span>
                                                    </li>



                                                    <li className="filter-item filter-item--check-box filter-item--green ">
                                                        <span>
                                                            <label htmlFor="filter-teawong">
                                                                <input type="checkbox" id="filter-teawong" data-group="Hãng" data-field="vendor" data-text="Teawong" value="(Teawong)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Teawong
                                                            </label>
                                                        </span>
                                                    </li>



                                                    <li className="filter-item filter-item--check-box filter-item--green ">
                                                        <span>
                                                            <label htmlFor="filter-achimmadang">
                                                                <input type="checkbox" id="filter-achimmadang" data-group="Hãng" data-field="vendor" data-text="Achimmadang" value="(Achimmadang)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Achimmadang
                                                            </label>
                                                        </span>
                                                    </li>



                                                    <li className="filter-item filter-item--check-box filter-item--green ">
                                                        <span>
                                                            <label htmlFor="filter-sudes-nest">
                                                                <input type="checkbox" id="filter-sudes-nest" data-group="Hãng" data-field="vendor" data-text="Sudes Nest" value="(Sudes Nest)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Sudes Nest
                                                            </label>
                                                        </span>
                                                    </li>


                                                </ul>
                                            </div>
                                        </aside>

                                        {/* <!-- End lọc tag 1 --> */}

                                        {/* <!-- Lọc tag 2 --> */}

                                        <aside className="aside-item filter-tag">
                                            <div className="aside-title">
                                                <h2 className="title-head margin-top-0">
                                                    <span>Theo vị</span>
                                                </h2>
                                            </div>
                                            <div className="aside-content filter-group">
                                                <ul>
                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-cay">
                                                                <input type="checkbox" id="filter-cay" data-group="tag2" data-field="tags" data-text="Cay" value="(Cay)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Cay
                                                            </label>
                                                        </span>
                                                    </li>

                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-chua">
                                                                <input type="checkbox" id="filter-chua" data-group="tag2" data-field="tags" data-text="Chua" value="(Chua)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Chua
                                                            </label>
                                                        </span>
                                                    </li>

                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-deo">
                                                                <input type="checkbox" id="filter-deo" data-group="tag2" data-field="tags" data-text="Dẻo" value="(Dẻo)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Dẻo
                                                            </label>
                                                        </span>
                                                    </li>

                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-the">
                                                                <input type="checkbox" id="filter-the" data-group="tag2" data-field="tags" data-text="The" value="(The)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                The
                                                            </label>
                                                        </span>
                                                    </li>

                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-man">
                                                                <input type="checkbox" id="filter-man" data-group="tag2" data-field="tags" data-text="Mặn" value="(Mặn)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Mặn
                                                            </label>
                                                        </span>
                                                    </li>

                                                    <li className="filter-item filter-item--check-box filter-item--green">
                                                        <span>
                                                            <label htmlFor="filter-ngot">
                                                                <input type="checkbox" id="filter-ngot" data-group="tag2" data-field="tags" data-text="Ngọt" value="(Ngọt)" data-operator="OR" />
                                                                <i className="fa"></i>
                                                                Ngọt
                                                            </label>
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </aside>

                                        {/* <!-- End lọc tag 2 --> */}

                                        {/* <!-- Lọc tag 3 --> */}

                                    </div>
                                </div>				</div>
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
                                <h1> Danh mục sản phẩm</h1>
                                <div className="title-separator">
                                    <div className="separator-center"></div>
                                </div>
                            </div>
                            <div className="col-list-cate">

                                <div className="menu-list">
                                    {loadingCategory ? (
                                        <p>Đang tải danh mục...</p>
                                    ) : (
                                        Array.isArray(category) && category.map((cat: Category) => (
                                            <Link key={cat.id} className="cate-item duration-300" href={`/collections/${cat.slug}`} title={cat.name}>
                                                <div className="cate-info-title">{cat.name}</div>
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
                                            <Link href="#" className="btn btn-outline btn-filter" title="Bộ lọc">
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
                                                <li className="btn-quick-sort default active">
                                                    <Link href="javascript:; onclick=sortby('default')" title="Mặc định"><i></i>Mặc định</Link>
                                                </li>
                                                <li className="btn-quick-sort alpha-asc">
                                                    <Link href="javascript:; onclick= sortby('alpha-asc')" title="Tên A-Z"><i></i>Tên A-Z</Link>
                                                </li>
                                                <li className="btn-quick-sort alpha-desc">
                                                    <Link href="javascript:; onclick=sortby('alpha-desc')" title="Tên Z-A"><i></i>Tên Z-A</Link>
                                                </li>
                                                <li className="btn-quick-sort position-desc">
                                                    <Link href="javascript:; onclick=sortby('created-desc')" title="Hàng mới"><i></i>Hàng mới</Link>
                                                </li>
                                                <li className="btn-quick-sort price-asc">
                                                    <Link href="javascript:; onclick=sortby('price-asc')" title="Giá thấp đến cao"><i></i>Giá thấp đến cao</Link>
                                                </li>
                                                <li className="btn-quick-sort price-desc">
                                                    <Link href="javascript:; onclick=sortby('price-desc')" title="Giá cao xuống thấp"><i></i>Giá cao xuống thấp</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* <script>
                                            function countFilterItem() {
		var countFilter = $('.filter-container__selected-filter-list ul li').length;
                                            $(".count-filter-val").text(countFilter);
	}
                                            countFilterItem();
                                        </script> */}

                                </div>

                                <div className="products-view products-view-grid list_hover_pro">
                                    <div className="row">
                                        {/* sp 1 */}
                                        {loadingProducts ? (
                                            <p>Đang tải sản phẩm...</p>
                                        ) : (
                                            products.slice(0, 8).map((product) => (
                                                <div className="col-6 col-md-3" key={product.id}>
                                                    <div className="item_product_main">

                                                        <form action="/cart/add" method="post" className="variants product-action item-product-main duration-300" data-cart-form="" data-id="product-actions-34775949" encType="multipart/form-data">
                                                            <span className="flash-sale">-
                                                                6%
                                                            </span>

                                                            <div className="tag-promo" title="Quà tặng">
                                                                <img src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/tag_pro_icon.svg?1739018973665" data-src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/tag_pro_icon.svg?1739018973665" alt="Quà tặng" className="lazyload loaded" data-was-processed="true" />
                                                                <div className="promotion-content">
                                                                    <div className="line-clamp-5-new" title=" - Tặng 1 túi giấy xách đi kèm - 1 Hộp đường phèn ">

                                                                        <p>
                                                                            <span style={{ letterSpacing: "-0.2px" }}>- Tặng 1 túi giấy xách đi kèm <br />- 1 Hộp đường phèn </span>
                                                                        </p>

                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="product-thumbnail">
                                                                <Link className="image_thumb scale_hover" href={`/product/${product.id}`} title={product.name}>
                                                                    <img className="lazyload duration-300 loaded" src="https://bizweb.dktcdn.net/thumb/large/100/506/650/products/bb2-50gr-0-nap-494df53fb54c4233b0ba3c0a8ab3dfbe-97fc1701b8a14297ac03ee1e64edf1b2-master-d488b4d7-4784-48b2-a54a-c7d6343654fa.jpg?v=1709574876467" alt={product.name} data-was-processed="true" />
                                                                </Link>
                                                            </div>
                                                            <div className="product-info">
                                                                <div className="name-price">
                                                                    <h3 className="product-name line-clamp-2-new">
                                                                        <Link href={`/product/${product.id}`} title={product.name}>{product.name}</Link>
                                                                    </h3>
                                                                    <div className="product-price-cart">
                                                                        <span className="compare-price">{product.price}</span>

                                                                        <span className="price">{product.price}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="product-button">
                                                                    {/* <input type="hidden" name="variantId" value={product.variantId} /> */}
                                                                    <button className="btn-cart btn-views add_to_cart btn btn-primary " title="Thêm vào giỏ hàng">
                                                                        <span>Thêm vào giỏ</span>
                                                                        <svg enableBackground="new 0 0 32 32" height="512" viewBox="0 0 32 32" width="512" xmlns="http://www.w3.org/2000/svg"><g><g><path d="m23.8 30h-15.6c-3.3 0-6-2.7-6-6v-.2l.6-16c.1-3.3 2.8-5.8 6-5.8h14.4c3.2 0 5.9 2.5 6 5.8l.6 16c.1 1.6-.5 3.1-1.6 4.3s-2.6 1.9-4.2 1.9c0 0-.1 0-.2 0zm-15-26c-2.2 0-3.9 1.7-4 3.8l-.6 16.2c0 2.2 1.8 4 4 4h15.8c1.1 0 2.1-.5 2.8-1.3s1.1-1.8 1.1-2.9l-.6-16c-.1-2.2-1.8-3.8-4-3.8z"></path></g><g><path d="m16 14c-3.9 0-7-3.1-7-7 0-.6.4-1 1-1s1 .4 1 1c0 2.8 2.2 5 5 5s5-2.2 5-5c0-.6.4-1 1-1s1 .4 1 1c0 3.9-3.1 7-7 7z"></path></g></g></svg>
                                                                    </button>
                                                                    <Link href="javascript:void(0)" className="setWishlist btn-views btn-circle" data-wish={`product-${product.id}`} tabIndex={0} title="Thêm vào yêu thích">
                                                                        <img width="25" height="25" src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/heart.png?1739018973665" alt="Thêm vào yêu thích" />
                                                                    </Link>
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
        </>
    );
}
