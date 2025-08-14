'use client';
import { useState } from 'react';
import '../styles/account.css'

export default function Navbar() {
    const [ navbar , setNavBar ] = useState('1')
    const tabs = [
        { id: '1', title: 'Thông tin tài khoản', href: '/account' },
        { id: '2', title: 'Đơn hàng của bạn', href: '/account/order' },

        { id: '3', title: 'Danh sách Mã giảm', href: '/account/coupon' },
        { id: '4', title: 'Đổi mật khẩu', href: '/account/password' },
        { id: '5', title: 'Địa chỉ', href: '/account/addresse' },
        { id: '6', title: 'Đăng xuất', href: '/logout' },
    ];
    return (
        <>
            <div className="col-lg-3 col-12 col-left-ac">
                <div className="block-account bg-shadow">
                    <h5 className="title-account">Trang tài khoản</h5>
                    <p>
                        Xin chào, <span style={{ color: "#053024" }}>Nguyễn Bá Tâm</span>&nbsp;!
                    </p>
                    <ul>
                        {tabs.map(tab => (
                            <li key={tab.id}>
                                <a href={tab.href}  className={`title-info ${navbar === tab.id ? 'active' : ''}`} title={tab.title} onClick={() => setNavBar(tab.id)}> {tab.title}</a>
                            </li>
                        ))}
                        {/* <li>
                            <a className="title-info" title="Thông tin tài khoản">Thông tin tài khoản</a>
                        </li>
                        <li>
                            <a className="title-info " href="/account/orders" title="Đơn hàng của bạn">Đơn hàng của bạn</a>
                        </li>

                        <li>
                            <a className="title-info" href="/danh-sach-yeu-thich" title="Đăng ký">
                                Danh sách yêu thích (<span className="js-wishlist-count">1</span>)
                            </a>
                        </li>

                        <li>
                            <a className="title-info" href="/account/changepassword" title="Đổi mật khẩu">Đổi mật khẩu</a>
                        </li>
                        <li>
                            <a className="title-info" href="/account/addresses" title="Sổ địa chỉ (1)">Sổ địa chỉ (1)</a>
                        </li>
                        <li>
                            <a className="title-info" href="/account/logout" title="Đăng xuất">Đăng xuất</a>
                        </li> */}
                    </ul>
                </div>
            </div>
        </>
    )
}