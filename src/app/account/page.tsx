'use client';

import Navbar from '../navbar/page';
import '../styles/order.css';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Author } from '../types/author';
import axios from 'axios';
import { updateUserAvatar } from '../lib/authorApi';

interface UserApiResponse {
    user: Author;
}

function getAvatarUrl(avatar: string | null | undefined) {
    if (!avatar) return '/default-avatar.png';
    if (avatar.startsWith('http')) return avatar;
    return `http://127.0.0.1:8000/storage/${avatar.replace(/^users[\\/]/, 'users/')}`;
}

export default function Account() {
    const [user, setUser] = useState<Author | null>(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const cookieData = Cookies.get("author");
        if (cookieData) {
            try {
                const parsed = JSON.parse(cookieData);
                setUser(parsed.user);
                setForm({
                    name: parsed.user.name || '',
                    email: parsed.user.email || '',
                    phone: parsed.user.phone || '',
                    address: parsed.user.address || ''
                });
            } catch (error) {
                console.error("Không thể parse cookie:", error);
            }
        }
    }, []);

    if (!user) return <div>Đang tải thông tin tài khoản...</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const cookieData = Cookies.get("author");
            if (!cookieData) throw new Error("Không có token");
            const parsed = JSON.parse(cookieData);
            const token = parsed.token;
            const res = await axios.patch(
                "http://127.0.0.1:8000/api/v1/user/profile",
                {
                    name: form.name,
                    phone: form.phone,
                    address: form.address
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                }
            );
            // Update user state and cookie
            const updatedUser = { ...user, ...(res.data as UserApiResponse).user };
            setUser(updatedUser);
            Cookies.set("author", JSON.stringify({ ...parsed, user: updatedUser }));
            setMessage('Cập nhật thành công!');
        } catch {
            setMessage('Cập nhật thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !user) return;
        const file = e.target.files[0];
        setLoading(true);
        setMessage('');
        try {
            const res = await updateUserAvatar(file);
            // API trả về user mới có avatar mới
            const cookieData = Cookies.get("author");
            if (!cookieData) throw new Error("Không có token");
            const parsed = JSON.parse(cookieData);
            const updatedUser = { ...user, avatar: (res as UserApiResponse).user.avatar };
            setUser(updatedUser);
            Cookies.set("author", JSON.stringify({ ...parsed, user: updatedUser }));
            setMessage('Cập nhật avatar thành công!');
        } catch {
            setMessage('Cập nhật avatar thất bại!');
        } finally {
            setLoading(false);
        }
    };

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
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-info">
                                                    <label htmlFor="name">Tên đăng nhập *</label>
                                                    <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
                                                </div>
                                                <div className="form-info">
                                                    <label htmlFor="email">Email *</label>
                                                    <input id="email" name="email" type="email" value={form.email} readOnly />
                                                </div>
                                                <div className="form-info">
                                                    <label htmlFor="phone">Số điện thoại *</label>
                                                    <input id="phone" name="phone" type="text" value={form.phone} onChange={handleChange} required />
                                                </div>
                                                <div className="form-info">
                                                    <label htmlFor="address">Địa chỉ*</label>
                                                    <input id="address" name="address" type="text" value={form.address} onChange={handleChange} required />
                                                </div>
                                                <button type="submit" className="primary btn-cart btn-views add_to_cart btn btn-primary" style={{maxWidth: "100%", width: "100%"}} disabled={loading}>{loading ? 'Đang cập nhật...' : 'Cập nhật'}</button>
                                                {message && <div style={{marginTop:8, color: message.includes('thành công') ? 'green' : 'red'}}>{message}</div>}
                                            </form>
                                        </div>
                                        <div className="form-image">
                                            <form action="" method="post" onSubmit={e => e.preventDefault()}>
                                                <div className="image">
                                                    <img
                                                        alt="avatar"
                                                        src={getAvatarUrl(user.avatar) + `?v=${Date.now()}`}
                                                        onError={e => { e.currentTarget.src = '/default-avatar.png'; }}
                                                    />
                                                </div>
                                            <label className="btn-image" htmlFor="avatar-upload">Tải ảnh lên</label>
                                            <input id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
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