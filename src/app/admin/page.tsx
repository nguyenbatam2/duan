'use client';
import "../admin/style/admin.css";

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import React from 'react';
// import { Toaster, toast } from 'react-hot-toast';
import Navbar from '../admin/component/navbar';

export default function Home() {
    const router = useRouter();

useEffect(() => {
    const token = Cookies.get('token');
    console.log(token);
if(!token){
    router.push('/admin/login');
}
},[router]);
// 
    return (
        <>
            <section className="home">
                <header className="home-header">
                    <div className="text">Xin chào Admin</div>
                    <div className="search">
                        <input type="text" placeholder="Tìm kiếm khách hàng, công việc" />
                    </div>
                </header>
                <main className="home-main">
                    <div className="home__container one">

                        <div className="home__content_top">

                            <div className="home__content_top--item">
                                <div className="box__content--title">
                                    <h2 className="text">Tổng Sản Phẩm</h2>
                                    {/* <i className="fas fa-ellipsis-h"></i> */}
                                </div>
                                <div className="box__content--item">
                                    {/* <span className="number">{products.length}</span> */}
                                </div>
                            </div>

                            <div className="home__content_top--item">
                                <div className="box__content--title">
                                    <h2 className="text">Tổng Đơn Hàng</h2>
                                    {/* <i className="fas fa-ellipsis-h"></i> */}
                                </div>
                                <div className="box__content--item">
                                    {/* <span className="number">{orders.length}</span> */}
                                </div>
                            </div>

                            <div className="home__content_top--item">
                                <div className="box__content--title">
                                    <h2 className="text">Tổng Khách hàng</h2>
                                    {/* <i className="fas fa-ellipsis-h"></i> */}
                                </div>
                                <div className="box__content--item">
                                    {/* <span className="number">{user.length}</span> */}
                                </div>
                            </div>

                            <div className="home__content_top--item">
                                <div className="box__content--title">
                                    <h2 className="text">Tổng Tiền Sản Phẩm</h2>
                                    {/* <i className="fas fa-ellipsis-h"></i> */}
                                </div>
                                <div className="box__content--item">
                                    {/* <span className="number">{orders.reduce((total, order) => total + order.totalAmount, 0).toLocaleString('vi-VN') + 'đ'}</span> */}
                                </div>
                            </div>

                        </div>



                    </div>
                    <div className="home__container two">
                        {/* <div className="home__container--title">
                            <a href="#">Quản Lý Đơn Hàng</a>
                            <a href="#">Quản Lý Khách Hàng</a>
                        </div> */}
                        <div className="home__container--content">
                            <div className="home__container--content_Left">
                                {/* <select name="" id="" className="select">
                                    <option value="">Quản lý hành trình khách hàng</option>
                                </select>
                                <div className="panel">
                                    <div className="head__panel--tile">
                                        <span>Kho dữ liệu khách hàng</span>
                                        <i className="fas fa-chart-pie icon"></i>
                                    </div>
                                    <div className="body__panel">
                                        <div className="body__panel--content">
                                            <div className="number"> <i className="fas fa-users"></i> 9 </div>
                                            <div className="text">Khách hàng</div>
                                        </div>
                                        <div className="actions">
                                            <button>
                                                <i className="fas fa-user-plus"></i>
                                                <span>Thêm khách hàng</span>
                                            </button>
                                            <button>
                                                <i className="fas fa-download"></i>
                                                <span>Tải về</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="footer__panel">
                                        <button className="upload-btn" type="submit">
                                            <i className="fas fa-upload"></i>
                                            <span>Upload khách hàng</span>
                                        </button>
                                    </div>
                                </div> */}
                            </div>
                            <div className="home__container--content_right">
                                {/* đổi hiển thị đồ thi ở đây  */}
                            </div>
                        </div>
                    </div>
                </main>
            </section>
        </>
    );
}