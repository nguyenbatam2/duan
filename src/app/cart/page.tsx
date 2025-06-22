"use client";
import Link from 'next/link';
import '@/app/styles/cart.css';
import { Product } from '../types/product';
import { useState, useEffect } from 'react';
import { decreaseQuantity, getCart, increaseQuantity, getCartTotal, removeFromCart } from "../lib/addCart";

export default function Cart() {
    const [cart, setCart] = useState<Product[]>([]);

    useEffect(() => {
        setCart(getCart());
    }, []);



    const handleIncrease = (productId: number) => {
        increaseQuantity(productId);
        setCart(getCart());
    };

    const handleDecrease = (productId: number) => {
        decreaseQuantity(productId);
        setCart(getCart());
    };

    const handleRemove = (productId: number) => {
        removeFromCart(productId);
        setCart(getCart());
	};
	const calculateTotal = () => {
		return getCartTotal();
	};

	return (
		<>
			<section className="bread-crumb">
				<div className="container">
					<ul className="breadcrumb">
						<li className="home">
							<Link href="/" title="Trang chủ"><span>Trang chủ</span></Link>
							<span className="mr_lr">&nbsp;<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-chevron-right fa-w-10"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" className=""></path></svg>&nbsp;</span>
						</li>

						<li><strong><span>Giỏ hàng</span></strong></li>

					</ul>
				</div>
			</section>

			<section className="main-cart-page main-container col1-layout">
				<div className="main container cartpcstyle">
					<div className="wrap_background_aside margin-bottom-40">
						<div className="row">
							<div className="col-xl-8 col-lg-7 col-12 col-cart-left">
								{cart.length > 0 ? (
									<>
										<div className="bg-shadow margin-bottom-20">
											<div className="header-cart">
												<div className="title-block-page">
													<h1 className="title_cart">
														<span>Giỏ hàng của bạn</span>
													</h1>
												</div>
											</div>
											<div className="cart-page d-xl-block d-none">
												<div className="drawer__inner">
													<div className="CartPageContainer">

														<form action="/cart" method="post" className="cart ajaxcart cartpage">
															<div className="cart-header-info">
																<div>Thông tin sản phẩm</div>
																<div>Đơn giá</div>
																<div>Số lượng</div>
																<div>Thành tiền</div>
															</div>
															<div className="ajaxcart__inner ajaxcart__inner--has-fixed-footer cart_body items">
																{cart.map((item, index) => (
															<div className="ajaxcart__row ajaxcart__row--has-actions" key={index}>
																<div className="ajaxcart__product cart_product" data-line={index + 1}>
																	<Link href={`/product/${item.id}`} className="ajaxcart__product-image cart_image" title={item.name}>
																		<img src={item.image} alt={item.name} />
																	</Link>
																	<div className="grid__item cart_info">
																		<div className="ajaxcart__product-name-wrapper cart_name">
																			<Link href={`/product/${item.id}`} className="ajaxcart__product-name h4 line-clamp line-clamp-2-new" title={item.name}>{item.name}</Link>
																			<button type="button" title="Xóa" className="cart__btn-remove remove-item-cart ajaxifyCart--remove" onClick={() => handleRemove(item.id)} data-line={index + 1} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "inherit" }}>Xóa</button>
																		</div>
																		<div className="grid">
																			<div className="grid__item one-half text-right cart_prices">
																				<span className="cart-price">{Number(item.price).toLocaleString("vi-VN")}₫</span>
																			</div>
																		</div>
																		<div className="grid">
																			<div className="grid__item one-half cart_select">
																				<div className="ajaxcart__qty input-group-btn">
																					<button
																						type="button"
																						className="ajaxcart__qty-adjust ajaxcart__qty--minus items-count"
																						data-id={item.id}
																						data-qty={item.quantity - 1}
																						data-line={index + 1}
																						aria-label="-"
																						onClick={() => handleDecrease(item.id)}
																					>
																						-
																					</button>
																					<input type="text" name="updates[]" className="ajaxcart__qty-num number-sidebar" maxLength={3} min="1" data-id={item.id} data-line={index + 1} aria-label="quantity" pattern="[0-9]*" value={item.quantity ?? 1} readOnly />
																					<button type="button" className="ajaxcart__qty-adjust ajaxcart__qty--plus items-count" 
																						data-id={item.id} 
																						data-line={index + 1} 
																						data-qty={item.quantity + 1} 
																						aria-label="+"
																						onClick={() => handleIncrease(item.id)}
																					> + </button>
																				</div>
																			</div>
																		</div>
																		<div className="grid justify-right">
																			<div className="grid__item one-half text-right cart_prices">
																				<span className="cart-price">{Number(Number(item.price) * (item.quantity || 1)).toLocaleString("vi-VN")}₫</span>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														))}
															</div>
														</form>

													</div>
												</div>
											</div>
											<div className="cart-mobile-page d-block d-xl-none">
												<div className="CartMobileContainer"></div>
											</div>
										</div>
									</>
								) : (
										<>
											<div className="bg-shadow margin-bottom-20">
												<div className="header-cart">
													<div className="title-block-page">
														<h1 className="title_cart">
															<span>Giỏ hàng của bạn</span>
														</h1>
													</div>
												</div>
												<div className="cart-page d-xl-block d-none">
													<div className="drawer__inner">
														<div className="CartPageContainer"><div className="cart--empty-message"><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 201.387 201.387" xmlSpace="preserve"> <g> <g> <path d="M129.413,24.885C127.389,10.699,115.041,0,100.692,0C91.464,0,82.7,4.453,77.251,11.916    c-1.113,1.522-0.78,3.657,0.742,4.77c1.517,1.109,3.657,0.78,4.768-0.744c4.171-5.707,10.873-9.115,17.93-9.115    c10.974,0,20.415,8.178,21.963,19.021c0.244,1.703,1.705,2.932,3.376,2.932c0.159,0,0.323-0.012,0.486-0.034    C128.382,28.479,129.679,26.75,129.413,24.885z"></path> </g> </g> <g> <g> <path d="M178.712,63.096l-10.24-17.067c-0.616-1.029-1.727-1.657-2.927-1.657h-9.813c-1.884,0-3.413,1.529-3.413,3.413    s1.529,3.413,3.413,3.413h7.881l6.144,10.24H31.626l6.144-10.24h3.615c1.884,0,3.413-1.529,3.413-3.413s-1.529-3.413-3.413-3.413    h-5.547c-1.2,0-2.311,0.628-2.927,1.657l-10.24,17.067c-0.633,1.056-0.648,2.369-0.043,3.439s1.739,1.732,2.97,1.732h150.187    c1.231,0,2.364-0.662,2.97-1.732S179.345,64.15,178.712,63.096z"></path> </g> </g> <g> <g> <path d="M161.698,31.623c-0.478-0.771-1.241-1.318-2.123-1.524l-46.531-10.883c-0.881-0.207-1.809-0.053-2.579,0.423    c-0.768,0.478-1.316,1.241-1.522,2.123l-3.509,15c-0.43,1.835,0.71,3.671,2.546,4.099c1.835,0.43,3.673-0.71,4.101-2.546    l2.732-11.675l39.883,9.329l-6.267,26.795c-0.43,1.835,0.71,3.671,2.546,4.099c0.263,0.061,0.524,0.09,0.782,0.09    c1.55,0,2.953-1.062,3.318-2.635l7.045-30.118C162.328,33.319,162.176,32.391,161.698,31.623z"></path> </g> </g> <g> <g> <path d="M102.497,39.692l-3.11-26.305c-0.106-0.899-0.565-1.72-1.277-2.28c-0.712-0.56-1.611-0.816-2.514-0.71l-57.09,6.748    c-1.871,0.222-3.209,1.918-2.988,3.791l5.185,43.873c0.206,1.737,1.679,3.014,3.386,3.014c0.133,0,0.27-0.009,0.406-0.024    c1.87-0.222,3.208-1.918,2.988-3.791l-4.785-40.486l50.311-5.946l2.708,22.915c0.222,1.872,1.91,3.202,3.791,2.99    C101.379,43.261,102.717,41.564,102.497,39.692z"></path> </g> </g> <g> <g> <path d="M129.492,63.556l-6.775-28.174c-0.212-0.879-0.765-1.64-1.536-2.113c-0.771-0.469-1.696-0.616-2.581-0.406L63.613,46.087    c-1.833,0.44-2.961,2.284-2.521,4.117l3.386,14.082c0.44,1.835,2.284,2.964,4.116,2.521c1.833-0.44,2.961-2.284,2.521-4.117    l-2.589-10.764l48.35-11.626l5.977,24.854c0.375,1.565,1.775,2.615,3.316,2.615c0.265,0,0.533-0.031,0.802-0.096    C128.804,67.232,129.932,65.389,129.492,63.556z"></path> </g> </g> <g> <g> <path d="M179.197,64.679c-0.094-1.814-1.592-3.238-3.41-3.238H25.6c-1.818,0-3.316,1.423-3.41,3.238l-6.827,133.12    c-0.048,0.934,0.29,1.848,0.934,2.526c0.645,0.677,1.539,1.062,2.475,1.062h163.84c0.935,0,1.83-0.384,2.478-1.062    c0.643-0.678,0.981-1.591,0.934-2.526L179.197,64.679z M22.364,194.56l6.477-126.293h143.701l6.477,126.293H22.364z"></path> </g> </g> <g> <g> <path d="M126.292,75.093c-5.647,0-10.24,4.593-10.24,10.24c0,5.647,4.593,10.24,10.24,10.24c5.647,0,10.24-4.593,10.24-10.24    C136.532,79.686,131.939,75.093,126.292,75.093z M126.292,88.747c-1.883,0-3.413-1.531-3.413-3.413s1.531-3.413,3.413-3.413    c1.882,0,3.413,1.531,3.413,3.413S128.174,88.747,126.292,88.747z"></path> </g> </g> <g> <g> <path d="M75.092,75.093c-5.647,0-10.24,4.593-10.24,10.24c0,5.647,4.593,10.24,10.24,10.24c5.647,0,10.24-4.593,10.24-10.24    C85.332,79.686,80.739,75.093,75.092,75.093z M75.092,88.747c-1.882,0-3.413-1.531-3.413-3.413s1.531-3.413,3.413-3.413    s3.413,1.531,3.413,3.413S76.974,88.747,75.092,88.747z"></path> </g> </g> <g> <g> <path d="M126.292,85.333h-0.263c-1.884,0-3.413,1.529-3.413,3.413c0,0.466,0.092,0.911,0.263,1.316v17.457    c0,12.233-9.953,22.187-22.187,22.187s-22.187-9.953-22.187-22.187V88.747c0-1.884-1.529-3.413-3.413-3.413    s-3.413,1.529-3.413,3.413v18.773c0,15.998,13.015,29.013,29.013,29.013s29.013-13.015,29.013-29.013V88.747    C129.705,86.863,128.176,85.333,126.292,85.333z"></path> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg><p>Giỏ hàng của bạn đang trống</p></div></div>
													</div>
												</div>
												<div className="cart-mobile-page d-block d-xl-none">
													<div className="CartMobileContainer"><div className="cart--empty-message"><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 201.387 201.387" xmlSpace="preserve"> <g> <g> <path d="M129.413,24.885C127.389,10.699,115.041,0,100.692,0C91.464,0,82.7,4.453,77.251,11.916    c-1.113,1.522-0.78,3.657,0.742,4.77c1.517,1.109,3.657,0.78,4.768-0.744c4.171-5.707,10.873-9.115,17.93-9.115    c10.974,0,20.415,8.178,21.963,19.021c0.244,1.703,1.705,2.932,3.376,2.932c0.159,0,0.323-0.012,0.486-0.034    C128.382,28.479,129.679,26.75,129.413,24.885z"></path> </g> </g> <g> <g> <path d="M178.712,63.096l-10.24-17.067c-0.616-1.029-1.727-1.657-2.927-1.657h-9.813c-1.884,0-3.413,1.529-3.413,3.413    s1.529,3.413,3.413,3.413h7.881l6.144,10.24H31.626l6.144-10.24h3.615c1.884,0,3.413-1.529,3.413-3.413s-1.529-3.413-3.413-3.413    h-5.547c-1.2,0-2.311,0.628-2.927,1.657l-10.24,17.067c-0.633,1.056-0.648,2.369-0.043,3.439s1.739,1.732,2.97,1.732h150.187    c1.231,0,2.364-0.662,2.97-1.732S179.345,64.15,178.712,63.096z"></path> </g> </g> <g> <g> <path d="M161.698,31.623c-0.478-0.771-1.241-1.318-2.123-1.524l-46.531-10.883c-0.881-0.207-1.809-0.053-2.579,0.423    c-0.768,0.478-1.316,1.241-1.522,2.123l-3.509,15c-0.43,1.835,0.71,3.671,2.546,4.099c1.835,0.43,3.673-0.71,4.101-2.546    l2.732-11.675l39.883,9.329l-6.267,26.795c-0.43,1.835,0.71,3.671,2.546,4.099c0.263,0.061,0.524,0.09,0.782,0.09    c1.55,0,2.953-1.062,3.318-2.635l7.045-30.118C162.328,33.319,162.176,32.391,161.698,31.623z"></path> </g> </g> <g> <g> <path d="M102.497,39.692l-3.11-26.305c-0.106-0.899-0.565-1.72-1.277-2.28c-0.712-0.56-1.611-0.816-2.514-0.71l-57.09,6.748    c-1.871,0.222-3.209,1.918-2.988,3.791l5.185,43.873c0.206,1.737,1.679,3.014,3.386,3.014c0.133,0,0.27-0.009,0.406-0.024    c1.87-0.222,3.208-1.918,2.988-3.791l-4.785-40.486l50.311-5.946l2.708,22.915c0.222,1.872,1.91,3.202,3.791,2.99    C101.379,43.261,102.717,41.564,102.497,39.692z"></path> </g> </g> <g> <g> <path d="M129.492,63.556l-6.775-28.174c-0.212-0.879-0.765-1.64-1.536-2.113c-0.771-0.469-1.696-0.616-2.581-0.406L63.613,46.087    c-1.833,0.44-2.961,2.284-2.521,4.117l3.386,14.082c0.44,1.835,2.284,2.964,4.116,2.521c1.833-0.44,2.961-2.284,2.521-4.117    l-2.589-10.764l48.35-11.626l5.977,24.854c0.375,1.565,1.775,2.615,3.316,2.615c0.265,0,0.533-0.031,0.802-0.096    C128.804,67.232,129.932,65.389,129.492,63.556z"></path> </g> </g> <g> <g> <path d="M179.197,64.679c-0.094-1.814-1.592-3.238-3.41-3.238H25.6c-1.818,0-3.316,1.423-3.41,3.238l-6.827,133.12    c-0.048,0.934,0.29,1.848,0.934,2.526c0.645,0.677,1.539,1.062,2.475,1.062h163.84c0.935,0,1.83-0.384,2.478-1.062    c0.643-0.678,0.981-1.591,0.934-2.526L179.197,64.679z M22.364,194.56l6.477-126.293h143.701l6.477,126.293H22.364z"></path> </g> </g> <g> <g> <path d="M126.292,75.093c-5.647,0-10.24,4.593-10.24,10.24c0,5.647,4.593,10.24,10.24,10.24c5.647,0,10.24-4.593,10.24-10.24    C136.532,79.686,131.939,75.093,126.292,75.093z M126.292,88.747c-1.883,0-3.413-1.531-3.413-3.413s1.531-3.413,3.413-3.413    c1.882,0,3.413,1.531,3.413,3.413S128.174,88.747,126.292,88.747z"></path> </g> </g> <g> <g> <path d="M75.092,75.093c-5.647,0-10.24,4.593-10.24,10.24c0,5.647,4.593,10.24,10.24,10.24c5.647,0,10.24-4.593,10.24-10.24    C85.332,79.686,80.739,75.093,75.092,75.093z M75.092,88.747c-1.882,0-3.413-1.531-3.413-3.413s1.531-3.413,3.413-3.413    s3.413,1.531,3.413,3.413S76.974,88.747,75.092,88.747z"></path> </g> </g> <g> <g> <path d="M126.292,85.333h-0.263c-1.884,0-3.413,1.529-3.413,3.413c0,0.466,0.092,0.911,0.263,1.316v17.457    c0,12.233-9.953,22.187-22.187,22.187s-22.187-9.953-22.187-22.187V88.747c0-1.884-1.529-3.413-3.413-3.413    s-3.413,1.529-3.413,3.413v18.773c0,15.998,13.015,29.013,29.013,29.013s29.013-13.015,29.013-29.013V88.747    C129.705,86.863,128.176,85.333,126.292,85.333z"></path> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg><p>Giỏ hàng của bạn đang trống</p></div></div>
												</div>
											</div>
										</>
								)}
								<div className="bg-shadow margin-bottom-20">
									<div className="product-suggest product-swipers">
										<h2>
											<Link href="/san-pham-noi-bat" title="Có thể bạn thích">
												Có thể bạn thích
											</Link>
										</h2>


										<div className="swiper_suggest swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events">
											<div className="swiper-wrapper" style={{ transform: 'translate3d(0px, 0px, 0px)' }}>

												<div className="swiper-slide swiper-slide-active" style={{ width: '261.667px', marginRight: '10px' }}>
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
																				<span style={{ letterSpacing: '-0.2px' }}>- Tặng 1 túi giấy xách đi kèm <br/>- 1 Hộp đường phèn </span>
																			</p>

																		</div>
																	</div>
															</div>

															<div className="product-thumbnail">
																<Link className="image_thumb scale_hover" href="/copy-of-to-yen-tinh-che-cho-be-baby-loai-3" title="Tổ Yến Tinh Chế cho bé BaBy (loại 3)">
																	<img className="lazyload duration-300 loaded" src="//bizweb.dktcdn.net/thumb/large/100/506/650/products/bb2-50gr-0-nap-494df53fb54c4233b0ba3c0a8ab3dfbe-97fc1701b8a14297ac03ee1e64edf1b2-master-d488b4d7-4784-48b2-a54a-c7d6343654fa.jpg?v=1709574876467" data-src="//bizweb.dktcdn.net/thumb/large/100/506/650/products/bb2-50gr-0-nap-494df53fb54c4233b0ba3c0a8ab3dfbe-97fc1701b8a14297ac03ee1e64edf1b2-master-d488b4d7-4784-48b2-a54a-c7d6343654fa.jpg?v=1709574876467" alt="Tổ Yến Tinh Chế cho bé BaBy (loại 3)" data-was-processed="true" />
																</Link>
															</div>
															<div className="product-info">
																<div className="name-price">
																	<h3 className="product-name line-clamp-2-new">
																		<Link href="/copy-of-to-yen-tinh-che-cho-be-baby-loai-3" title="Tổ Yến Tinh Chế cho bé BaBy (loại 3)">Tổ Yến Tinh Chế cho bé BaBy (loại 3)</Link>
																	</h3>
																	<div className="product-price-cart">
																		<span className="compare-price">3.100.000₫</span>

																		<span className="price">2.900.000₫</span>
																	</div>
																</div>
																<div className="product-button">
																	<input type="hidden" name="variantId" value="111118886" />
																		<button className="btn-cart btn-views add_to_cart btn btn-primary " title="Thêm vào giỏ hàng">
																			<span>Thêm vào giỏ</span>
																			<svg enableBackground="new 0 0 32 32" height="512" viewBox="0 0 32 32" width="512" xmlns="http://www.w3.org/2000/svg"><g><g><path d="m23.8 30h-15.6c-3.3 0-6-2.7-6-6v-.2l.6-16c.1-3.3 2.8-5.8 6-5.8h14.4c3.2 0 5.9 2.5 6 5.8l.6 16c.1 1.6-.5 3.1-1.6 4.3s-2.6 1.9-4.2 1.9c0 0-.1 0-.2 0zm-15-26c-2.2 0-3.9 1.7-4 3.8l-.6 16.2c0 2.2 1.8 4 4 4h15.8c1.1 0 2.1-.5 2.8-1.3s1.1-1.8 1.1-2.9l-.6-16c-.1-2.2-1.8-3.8-4-3.8z"></path></g><g><path d="m16 14c-3.9 0-7-3.1-7-7 0-.6.4-1 1-1s1 .4 1 1c0 2.8 2.2 5 5 5s5-2.2 5-5c0-.6.4-1 1-1s1 .4 1 1c0 3.9-3.1 7-7 7z"></path></g></g></svg>
																		</button>
																		<Link href="javascript:void(0)" className="setWishlist btn-views btn-circle" data-wish="copy-of-to-yen-tinh-che-cho-be-baby-loai-3" tabIndex={0} title="Thêm vào yêu thích">
																			<img width="25" height="25" src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/heart.png?1739018973665" alt="Thêm vào yêu thích" />
																		</Link>
																</div>
															</div>
														</form>
													</div>
												</div>

											</div>
											<div className="swiper-button-next">
												<svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
													<rect x="2.13003" y="29" width="38" height="38" transform="rotate(-45 2.13003 29)" stroke="black" fill="#fff" strokeWidth="2"></rect>
													<rect x="8" y="29.2133" width="30" height="30" transform="rotate(-45 8 29.2133)" fill="black"></rect>
													<path d="M18.5 29H39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
													<path d="M29 18.5L39.5 29L29 39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
												</svg>
											</div>
											<div className="swiper-button-prev swiper-button-disabled">
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
								{/* <script>
						var swiper_suggest = null;
						function initSwiperSuggest() {
							swiper_suggest = new Swiper('.swiper_suggest', {
								slidesPerView: 4,
								spaceBetween: 20,
								slidesPerGroup: 1,
								navigation: {
									nextEl: '.swiper_suggest .swiper-button-next',
									prevEl: '.swiper_suggest .swiper-button-prev',
								},
								breakpoints: {
									768: {
										slidesPerView: 3,
										spaceBetween: 20
									},
									992: {
										slidesPerView: 3,
										spaceBetween: 20
									},
									1024: {
										slidesPerView: 2.5,
										spaceBetween: 20
									},
									1200: {
										slidesPerView: 3,
										spaceBetween: 10
									}
								}
							});
						}
						function destroySwiperSuggest() {
							if (swiper_suggest) {
								swiper_suggest.destroy(true, true);
								swiper_suggest = null;
							}
						}
						function toggleSwiperSuggest() {
							if ($(window).width() <= 767 && swiper_suggest) {
								destroySwiperSuggest();
							} else if ($(window).width() > 767 && !swiper_suggest) {
								initSwiperSuggest();
							}
						}
						toggleSwiperSuggest();
						$(window).resize(toggleSwiperSuggest);
					</script> */}

							</div>
							<div className="col-xl-4 col-lg-5 col-12 col-cart-right">
								<div className="sticky">
									<div className="bg-shadow margin-bottom-20">
										<div className="ajaxcart__footer">
											<div className="checkout-header">
												Thông tin đơn hàng
											</div>
											<div className="checkout-body">
												<div className="summary-total">

													<div className="content-items">
														<div className="item-content-left">Tổng tiền</div>
														<div className="item-content-right"><span className="total-price">{calculateTotal().toLocaleString("vi-VN")}₫</span></div>
													</div>

												</div>
												<div className="summary-action">
													<p>Phí vận chuyển sẽ được tính ở trang thanh toán.</p>
													<p>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</p>
												</div>

												{/* <div className="summary-vat">
													<form method="post" noValidate  className="formVAT">
														<h4>
															Thời gian giao hàng
														</h4>
														<div className="timedeli-modal">
															<fieldset className="input_group date_pick">
																<input type="text" placeholder="Chọn ngày" readOnly id="date" name="attributes[shipdate]" className="date_picker" />
															</fieldset>
															<fieldset className="input_group date_time">
																<select name="time" className="timedeli-cta" defaultValue="">
																	<option value="">Chọn thời gian</option>

																	<option value="08h00 - 12h00">08h00 - 12h00</option>

																	<option value="14h00 - 18h00">14h00 - 18h00</option>

																	<option value="19h00 - 21h00">19h00 - 21h00</option>

																</select>
															</fieldset>
														</div>

														<div className="r-bill">
															<div className="checkbox">
																<input type="hidden" name="attributes[invoice]" id="re-checkbox-bill" value="không" />
																<input type="checkbox" id="checkbox-bill" name="attributes[invoice]" value="có" className="regular-checkbox" />
																<label htmlFor="checkbox-bill" className="box"></label>
																<label htmlFor="checkbox-bill" className="title">Xuất hóa đơn công ty</label>
															</div>
															<div className="bill-field" style={{ display: 'none' }}>
																<div className="form-group">
																	<label>Tên công ty</label>
																	<input type="text" className="form-control val-f" name="attributes[company_name]" value="" placeholder="Tên công ty" />
																</div>
																<div className="form-group">
																	<label>Mã số thuế</label>
																	<input type="text" pattern=".{10,}" className="form-control val-f val-n" name="attributes[tax_code]" value="" placeholder="Mã số thuế" />
																</div>
																<div className="form-group">
																	<label>Địa chỉ công ty</label>
																	<textarea className="form-control val-f" name="attributes[company_address]" placeholder="Nhập địa chỉ công ty (bao gồm Phường/Xã, Quận/Huyện, Tỉnh/Thành phố nếu có)"></textarea>
																</div>
																<div className="form-group">
																	<label>Email nhận hoá đơn</label>
																	<input type="email" className="form-control val-f val-email" name="attributes[invoice_email]" value="" placeholder="Email nhận hoá đơn" />
																</div>
															</div>
														</div>
														<button  type="button" className="button btn btn-default cart__btn-proceed-checkout btn-primary duration-300" id="btn-proceed-checkout" title="Thanh toán ngay">Thanh toán ngay</button>
													</form>
												</div> */}

												<div className="summary-button">
													<div className="cart__btn-proceed-checkout-dt">
														<button  type="button" className="button btn btn-default cart__btn-proceed-checkout btn-primary duration-300" id="btn-proceed-checkout" title="Thanh toán ngay">Thanh toán ngay</button>
													</div>
													<Link className="return_buy btn btn-extent duration-300" title="Tiếp tục mua hàng" href="/product">Tiếp tục mua hàng</Link>
												</div>
											</div>
										</div>
									</div>

									<div className="bg-shadow">
										<div className="product-coupons">
											<div className="title">Khuyến mãi dành cho bạn</div>
											<div className="swiper_coupons swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events">
												<div className="swiper-wrapper" style={{ transform: 'translate3d(0px, 0px, 0px)', transitionDuration: '0ms' }}>

													<div className="swiper-slide" style={{ width: '300.4px', marginRight: '10px' }}>
														<div className="box-coupon">
															<div className="mask-ticket"></div>
															<div className="image">
																<img width="88" height="88" className="lazyload loaded" src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/img_coupon_1.jpg?1739018973665" data-src="//bizweb.dktcdn.net/100/506/650/themes/944598/assets/img_coupon_1.jpg?1739018973665" alt="NEST200" data-was-processed="true" />
															</div>
															<div className="content_wrap">
																<Link title="Chi tiết" href="javascript:void(0)" className="info-button" data-coupon="NEST200" data-time="12/12/2025" data-content="Áp dụng cho đơn hàng từ <b>4,500,000đ</b> trở lên
Không đi kèm với chương trình khác">
																	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
																		<path d="M144 80c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z"></path>
																	</svg>
																</Link>
																<div className="content-top">
																	NEST200
																	<span className="line-clamp line-clamp-2">Giảm 200k giá trị đơn hàng</span>
																</div>
																<div className="content-bottom">
																	<span>HSD: 12/12/2025</span>
																	<div className="coupon-code js-copy" data-copy="NEST200" title="Sao chép">Copy mã</div>
																</div>
															</div>
														</div>
													</div>


												</div>
												<div className="swiper-button-prev">
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
										</div>
									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}