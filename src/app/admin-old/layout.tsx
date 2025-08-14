"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from './component/navbar';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Sử dụng hook để lấy pathname hiện tại
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';
  const router = useRouter();
  const [showNavbar, setShowNavbar] = useState(true);

  // Kiểm tra token ở client, nếu chưa đăng nhập thì chuyển hướng sang /login
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('token');
      if (!token && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  // Đảm bảo SSR/CSR đều hoạt động
  // Nếu không dùng được window, fallback sang client component
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <section className="main_content dashboard_part">
          {/* Nút ☰ chỉ hiện khi sidebar ẩn */}
          {!isLogin && !showNavbar && (
            <button
              onClick={() => setShowNavbar(true)}
              style={{
                position: 'fixed',
                top: 18,
                left: 18,
                zIndex: 2000,
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 12px',
                fontSize: 22,
                boxShadow: '0 2px 8px #0001',
                cursor: 'pointer',
              }}
              aria-label="Hiện menu"
            >
              ☰
            </button>
          )}
          {/* Navbar truyền onToggle để ẩn */}
          {!isLogin && showNavbar && (
            <Navbar showNavbar={showNavbar} onToggle={() => setShowNavbar(false)} />
          )}
          <div style={{ flex: 1, marginLeft: !isLogin && showNavbar ? 270 : 0, transition: 'margin-left 0.2s' }}>
            {children}
          </div>
        </section>
      </body>
    </html>
  );
}
