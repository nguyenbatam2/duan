import Link from "next/link";
import '@/app/styles/contact.css';
export default function Contact() {
    return (
        <>
            <section className="bread-crumb">
                <div className="container">
                    <ul className="breadcrumb">
                        <li className="home">
                            <Link href="/" title="Trang chủ"><span>Trang chủ</span></Link>
                            <span className="mr_lr">&nbsp;<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-chevron-right fa-w-10"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" className=""></path></svg>&nbsp;</span>
                        </li>

                        <li><strong><span>Liên hệ</span></strong></li>

                    </ul>
                </div>
            </section>

            <h1 className="title-head-contact a-left d-none">Liên hệ</h1>

            <div className="layout-contact">
                <div className="container">
                    <div className="bg-shadow">
                        <div className="row">
                            <div className="col-lg-5 col-12">
                                <div className="contact">
                                    <h4>
                                        Cửa hàng Bird's Nest
                                    </h4>
                                    <div className="des_foo">
                                    </div>
                                    <div className="time_work">
                                        <div className="item">
                                            <b>Địa chỉ:</b>
                                            Tân Chánh Hiệp, District 12, Ho Chi Minh City, Vietnam
                                        </div>
                                        <div className="item">
                                            <b>Hotline:</b> <a className="fone" href="tel:19006750" title="1900 6750">1900
                                                6750</a>
                                        </div>
                                        <div className="item">
                                            <b>Email:</b> <a href="mailto:support@sapo.vn" title="support@sapo.vn">support@sapo.vn</a>
                                        </div>
                                        <div className="item">
                                            <a href="index.html" className="btn btn-primary frame" title="Hệ thống cửa hàng">
                                                <svg width="14" height="32" viewBox="0 0 14 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="border-svg border-svg-left">
                                                    <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" fill="none"></path>
                                                    <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" stroke="white"></path>
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-fill" viewBox="0 0 16 16">
                                                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z">
                                                    </path>
                                                    <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z">
                                                    </path>
                                                </svg>
                                                Hệ thống cửa hàng
                                                <svg width="14" height="32" viewBox="0 0 14 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="border-svg border-svg-right">
                                                    <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" fill="none"></path>
                                                    <path d="M13.3726 0H0.372559V13.2018L3.16222 16L6.37256 19L9.5 16L7.93628 14.5L6.37256 13L0.372559 18.6069V32H13.3726" stroke="white"></path>
                                                </svg>
                                            </a>
                                        </div>

                                    </div>
                                </div>
                                <div className="form-contact">
                                    <h4>
                                        Liên hệ với chúng tôi
                                    </h4>
                                    <div id="pagelogin">
                                        <form id="contact" acceptCharset="UTF-8">
                                            <div className="group_contact">
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                                        <input placeholder="Họ và tên" type="text" className="form-control  form-control-lg" required />
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                                        <input placeholder="Email" type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" required id="email1" className="form-control form-control-lg" />
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                                        <input type="number" placeholder="Điện thoại" name="contact[phone]" className="form-control form-control-lg" required />
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                                        <textarea placeholder="Nội dung" name="contact[body]" id="comment" className="form-control content-area form-control-lg" rows={5} required></textarea>
                                                        <button type="submit" className="btn btn-primary">Gửi tin nhắn <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                                                        </svg></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7 col-12">
                                <div id="contact_map" className="map">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8429.782517954374!2d106.61962160601269!3d10.857067325898733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bee0b0ef9e5%3A0x5b4da59e47aa97a8!2zQ8O0bmcgVmnDqm4gUGjhuqduIE3hu4FtIFF1YW5nIFRydW5n!5e0!3m2!1svi!2sus!4v1731866420191!5m2!1svi!2sus" width="100%" height="450" style={{ border: "0" }} allowFullscreen loading="lazy"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}