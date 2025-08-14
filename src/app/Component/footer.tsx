import Link from 'next/link';
// import img from 'next/img';
export default function Footer() { 
    return (
        <>
            
            <footer className="footer">
                <div className="mid-footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 col-md-12 col-lg-cus-30 footer-info">
                                <div className="logo-footer">
                                    <Link href="home.php" title="Bird's Nest">
                                        <img width="300" height="90" src="/img/logo_zoom.png" alt="Bird's Nest" className="" />
                                    </Link>
                                </div>
                                <div className="list-menu toggle-mn">
                                    <div className="content-contact clearfix">
                                        <span className="list_footer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"></path>
                                            </svg>
                                            <b>Địa chỉ: </b>
                                            <span className="address">Số 1, Đường 2, Khu đô thị mới, Phường 3, Quận 4, TP. Hồ Chí Minh</span>
                                        </span>
                                    </div>
                                    <div className="content-contact clearfix">
                                        <span className="list_footer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                                                <path fillRule ="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"></path>
                                            </svg>
                                            <b>Điện thoại: </b>
                                            <a title="1900 6750" href="tel:19006750">
                                                1900 6750
                                            </a>
                                        </span>
                                    </div>
                                    <div className="content-contact clearfix">
                                        <span className="list_footer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                                                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"></path>
                                            </svg>
                                            <b>Email: </b>
                                            <a title="support@sapo.vn" href="mailto:support@sapo.vn">
                                                support@sapo.vn
                                            </a>
                                        </span>
                                    </div>
                                </div>
                                {/* <!-- icon --> */}
                                <div className="social-footer">
                                    <div className="social">
                                        <Link href="https://facebook.com/" target="_blank" aria-label="Facebook" title="Theo dõi Bird's Nest trên Facebook">
                                            <img className="" width="35" height="35" alt="Facebook" src="/img/facebook_2.svg" />
                                        </Link>
                                        <Link href="https://www.instagram.com/" target="_blank" aria-label="Instagram" title="Theo dõi Bird's Nest trên Instagram">
                                            <img className="" width="35" height="35" alt="Instagram" src="/img/instagram_1.svg" />
                                        </Link>
                                        <Link href="https://shopee.vn/" target="_blank" aria-label="Shopee" title="Theo dõi Bird's Nest trên Shopee">
                                            <img className="" width="35" height="35" alt="Shopee" src="/img/shopee.svg"/>
                                        </Link>
                                        <Link href="https://www.lazada.vn/" target="_blank" aria-label="Lazada" title="Theo dõi Bird's Nest trên Lazada">
                                            <img className="" width="35" height="35" alt="Lazada" src="/img/lazada.svg"/>
                                        </Link>
                                        <Link href="https://www.tiktok.com/vi-VN" target="_blank" aria-label="Tiktok" title="Theo dõi Bird's Nest trên Tiktok">
                                            <img className="" width="35" height="35" alt="Tiktok" src="/img/tiktok.svg"/>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4 col-lg-cus-20 footer-click">
                                <h4 className="title-menu clicked">
                                    <span>Chính sách</span>
                                </h4>
                                <ul className="list-menu toggle-mn hidden-mob">
                                    <li className="li_menu">
                                        <Link href="/chinh-sach-mua-hang" title="Chính sách mua hàng">Chính sách mua
                                            hàng</Link>
                                    </li>
                                    <li className="li_menu">
                                        <Link href="/chinh-sach-thanh-toan" title="Chính sách thanh toán">Chính sách thanh
                                            toán</Link>
                                    </li>
                                    <li className="li_menu">
                                        <Link href="/chinh-sach-van-chuyen" title="Chính sách vận chuyển">Chính sách vận
                                            chuyển</Link>
                                    </li>
                                    <li className="li_menu">
                                        <Link href="/cam-ket-cua-hang" title="Cam kết cửa hàng">Cam kết cửa hàng</Link>nk
                                    </li>
                                    <li className="li_menu">
                                        <Link href="/chinh-sach-bao-mat" title="Chính sách bảo mật">Chính sách bảo mật</Link>
                                    </li>
                                    <li className="li_menu">
                                        <Link href="/chinh-sach-thanh-vien" title="Chính sách thành viên">Chính sách thành
                                            viên</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-xs-12 col-md-4 col-lg-cus-20 footer-click">
                                <h4 className="title-menu clicked">
                                    <span>Hướng dẫn</span>
                                </h4>
                                <ul className="list-menu toggle-mn hidden-mob footer-click">
                                    <li className="li_menu">
                                        <Link href="/huong-dan-mua-hang" title="Hướng dẫn mua hàng">Hướng dẫn mua hàng</Link>
                                    </li>
                                    <li className="li_menu">
                                        <Link href="/huong-dan-doi-tra" title="Hướng dẫn đổi trả">Hướng dẫn đổi trả</Link>
                                    </li>
                                    <li className="li_menu">
                                        <Link href="/huong-dan-thanh-toan" title="Hướng dẫn thanh toán">Hướng dẫn thanh
                                            toán</Link>
                                    </li>
                                    <li className="li_menu">
                                        <Link href="/quy-dinh-bao-hanh" title="Quy định bảo hành">Quy định bảo hành</Link>
                                    </li>
                                    <li className="li_menu">
                                        <Link href="/huong-dan-chuyen-khoan" title="Hướng dẫn chuyển khoản">Hướng dẫn
                                            chuyển khoản</Link>
                                    </li>
                                </ul>   
                            </div>
                            <div className="col-xs-12 col-md-4 col-lg-cus-30">
                                <div className="block-payment">
                                    <h4 className="title-menu">
                                        <span>Hỗ trợ thanh toán</span>
                                    </h4>
                                    <div className="payment-footer list-menu">
                                        <div className="payment-item">
                                            <img className="" width="126" height="58" alt="MoMo" src="/img/payment_1.webp"/>
                                        </div>
                                        <div className="payment-item">
                                            <img className="" width="126" height="58" alt="Zalo Pay" src="/img/payment_2.webp"/>
                                        </div>
                                        <div className="payment-item">
                                            <img className="" width="126" height="58" alt="VnPay" src="/img/payment_3.webp"/>
                                        </div>
                                        <div className="payment-item">
                                            <img className="" width="126" height="58" alt="Moca" src="/img/payment_4.webp"/>
                                        </div>
                                        <div className="payment-item">
                                            <img className="" width="126" height="58" alt="Visa" src="/img/payment_5.webp"/>
                                        </div>
                                        <div className="payment-item">
                                            <img className="" width="126" height="58" alt="ATM" src="/img/payment_6.webp"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="block-certifi">
                                    <h4 className="title-menu">
                                        <span>Chứng nhận</span>
                                    </h4>
                                    <div className="certifi-footer">
                                        <Link href="#" title="Chứng nhận 1" target="_blank">
                                            <img width="335" height="108" className="" alt="Chứng nhận 1" src="/img/chungnhan1.png"/>
                                        </Link>
                                        <Link href="#" title="Chứng nhận 2" target="_blank">
                                            <img width="335" height="108" className="" alt="Chứng nhận 2" src="/img/chungnhan2.png"/>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-footer-bottom copyright clearfix">
                    <div className="container">
                        <div className="row tablet">
                            <div id="copyright" className="col-lg-12 col-md-12 col-xs-12 fot_copyright">
                                <span className="wsp">

                                    <span className="mobile">© Bản quyền thuộc về <b>Nhóm BMB</b>
                                        <span className="dash"> | </span>
                                    </span>
                                    <span className="opacity1">Sáng lập <b>2025</b></span>
                                </span>
                            </div>
                        </div>
                        <a href="#" className="backtop show" title="Lên đầu trang">
                            <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2.13003" y="29" width="38" height="38" transform="rotate(-45 2.13003 29)" stroke="black" fill="#fff" strokeWidth="2"></rect>
                                <rect x="8" y="29.2133" width="30" height="30" transform="rotate(-45 8 29.2133)" fill="black"></rect>
                                <path d="M18.5 29H39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M29 18.5L39.5 29L29 39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </>
    )
}