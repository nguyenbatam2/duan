'use client';

import Navbar from '../navbar/page';
import '../styles/order.css';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Author } from '../types/author';
import { updateUserAddress } from '../lib/authorApi';

export default function Account() {
    const [user, setUser] = useState<Author | null>(null);
    console.log("Account component rendered", user);
    useEffect(() => {
        const cookieData = Cookies.get("author");
        if (cookieData) {
            try {
                const parsed = JSON.parse(cookieData);
                setUser(parsed.user); // Lưu user vào state
            } catch (error) {
                console.error("Không thể parse cookie:", error);
            }
        }
    }, []);

    if (!user) return <div>Đang tải thông tin tài khoản...</div>;

    return (
        <>
            <section className="signup page_customer_account">
                <div className="container">
                    <div className="row">
                        <Navbar />
                        <div className="col-lg-9 col-12 col-right-ac">
                            <div className="bg-shadow">
                                <div className="main-home">
                                    <div className="info-profile">
                                        <h1>Hồ sơ của bạn</h1>
                                        <span>Quản lý thông tin hồ sơ để bảo mật tài khoản</span>
                                    </div>
                                    <div className="wrap">
                                        <div className="form-profile">
                                            <form action="" method="post">
                                                <div className="form-info">
                                                    <label htmlFor="name">Tên đăng nhập *</label>
                                                    <input id="name" readOnly type="text" value={user.name} />
                                                </div>
                                                <div className="form-info">
                                                    <label htmlFor="email">Email *</label>
                                                    <input id="email" readOnly type="email" value={user.email} />
                                                </div>
                                                <div className="form-info">
                                                    <label htmlFor="phone">Số điện thoại *</label>
                                                    <input id="phone" readOnly type="text" value={user.phone} />
                                                </div>
                                                <div className="form-info">
                                                    <label htmlFor="address">Địa chỉ*</label>
                                                    <input id="address" readOnly type="text" value={user.address} />
                                                </div>
                                                <button type="submit" className="primary btn-cart btn-views add_to_cart btn btn-primary" style={{maxWidth: "100%", width: "100%"}}>Cập nhật</button>
                                            </form>
                                        </div>
                                        <div className="form-image">
                                            <form action="" method="post">
                                                <div className="image">
                                                    <img alt="" src={user.avatar} />
                                                </div>
                                            <label className="btn-image" htmlFor="avatar-upload">Tải ảnh lên</label>
                                            <input id="avatar-upload" type="file" style={{ display: 'none' }} />
                                            </form>
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