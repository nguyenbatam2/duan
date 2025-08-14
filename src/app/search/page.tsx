'use client';

export const dynamic = 'force-dynamic';
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { searchProducts } from "../lib/product";
import { Product } from "../types/product";
import AddToCart from "@/app/addToCart/page";
import CartModal from "../cartModal/page"; 
import '../styles/listProduct.css'

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';
    const [result, setResult] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


    useEffect(() => {
        if (query) {
            searchProducts(query).then(setResult);
        }
    }, [query]);
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

            <section className="signup search-main wrap_background background_white clearfix">
                <div className="container">



                    <div className="margin-bottom-15 no-padding">
                        <h1 className="title-head title_search">Có {query.length} kết quả tìm kiếm phù hợp</h1>
                    </div>
                    <div className="category-products">
                        <div className="d-none">
                            <span className="search_content">{query}</span>
                            <span className="search_count">{query.length}</span>
                        </div>
                        <div className="products-view-grid">
                            <div className="row">

                                {result.length === 0 ? (
                                    <p>Không tìm thấy sản phẩm nào.</p>
                                ) : (
                                    result.map((product) => (
                                        <div className="col-6 col-sm-4  col-md-3 col-lg-3" key={product.id}>
                                            <div className="item_product_main">

                                                <form action="/cart/add" method="post" className="variants product-action item-product-main duration-300" data-cart-form="" data-id="product-actions-34619457" encType="multipart/form-data">

                                                    <div className="product-thumbnail">
                                                        <Link className="image_thumb scale_hover" href="/hac-sam-lat-tam-mat-ong-kgs-han-quoc-hop-8-goi-x-20g" title="Hắc Sâm Lát Tẩm Mật Ong KGS Hàn Quốc Hộp 8 Gói x 20g">
                                                            <img className="lazyload duration-300 loaded" src="//bizweb.dktcdn.net/thumb/large/100/506/650/products/hac-sam-lat-tam-mat-ong-kgs-2-34f0db34554247d3a590c7d92db6655a-grande.jpg?v=1708619688693" data-src="//bizweb.dktcdn.net/thumb/large/100/506/650/products/hac-sam-lat-tam-mat-ong-kgs-2-34f0db34554247d3a590c7d92db6655a-grande.jpg?v=1708619688693" alt="Hắc Sâm Lát Tẩm Mật Ong KGS Hàn Quốc Hộp 8 Gói x 20g" data-was-processed="true" />
                                                        </Link>
                                                    </div>
                                                    <div className="product-info">
                                                        <div className="name-price">
                                                            <h3 className="product-name line-clamp-2-new">
                                                                <Link href={`/product/${product.id}`} title={product.name}>{product.name}</Link>
                                                            </h3>
                                                            <div className="product-price-cart">
                                                                <span className="price">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                                                            </div>
                                                        </div>
                                                        <div className="product-button">
                                                            <AddToCart product={product} onAddToCart={(product) => setSelectedProduct(product)} />

                                                            <Link href="javascript:void(0)" className="setWishlist btn-views btn-circle" data-wish="hac-sam-lat-tam-mat-ong-kgs-han-quoc-hop-8-goi-x-20g" tabIndex={0} title="Thêm vào yêu thích">
                                                                <img width="25" height="25" src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/heart.png?1739018973665" alt="Thêm vào yêu thích" />
                                                            </Link>
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
            </section>
            {selectedProduct && (
                <CartModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}