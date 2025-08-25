'use client';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function AdminDashboard() {
    const router = useRouter();

useEffect(() => {
    const token = Cookies.get('token');
    console.log(token);
if(!token){
    router.push('/admin/login');
}
},[router]);

const notify = () => toast.success("This is a success toast!");
    return (
        <>
        <button onClick={notify}>Show Toast</button>
        <Toaster />
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="admin-card-title">Bảng điều khiển Admin</h1>
                <p className="text-muted">Chào mừng bạn đến với hệ thống quản lý</p>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <h2 className="admin-card-title">Tổng quan hệ thống</h2>
                </div>
                <div className="admin-card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        <div className="admin-card bg-primary">
                            <h3 className="font-semibold text-primary">Quản lý Sản phẩm</h3>
                            <p className="text-muted">Quản lý danh sách sản phẩm, thêm, sửa, xóa</p>
                            <a href="/admin/product" className="admin-button">Xem chi tiết</a>
                        </div>
                        
                        <div className="admin-card bg-success">
                            <h3 className="font-semibold text-success">Quản lý Đơn hàng</h3>
                            <p className="text-muted">Theo dõi và xử lý đơn hàng</p>
                            <a href="/admin/Oder" className="admin-button success">Xem chi tiết</a>
                        </div>
                        
                        <div className="admin-card bg-warning">
                            <h3 className="font-semibold text-warning">Quản lý Khách hàng</h3>
                            <p className="text-muted">Quản lý thông tin khách hàng</p>
                            <a href="/admin/user" className="admin-button warning">Xem chi tiết</a>
                        </div>
                        
                        <div className="admin-card bg-danger">
                            <h3 className="font-semibold text-danger">Thống kê</h3>
                            <p className="text-muted">Xem báo cáo và thống kê</p>
                            <a href="/admin/Statistic" className="admin-button danger">Xem chi tiết</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <h2 className="admin-card-title">Truy cập nhanh</h2>
                </div>
                <div className="admin-card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                        <a href="/admin/category" className="admin-button info">📁 Danh mục</a>
                        <a href="/admin/Event" className="admin-button info">🎉 Sự kiện</a>
                        <a href="/admin/CouponPage" className="admin-button info">🏷️ Mã giảm giá</a>
                        <a href="/admin/reviews" className="admin-button info">💬 Bình luận</a>
                        <a href="/admin/posts" className="admin-button info">📝 Bài viết</a>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}