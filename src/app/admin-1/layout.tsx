"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from './component/navbar';
import AuthGuard from './component/AuthGuard';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

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
  const [showNavbar, setShowNavbar] = useState(true);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {isLogin ? (
          children
        ) : (
          <AuthGuard>
            <section className="main_content dashboard_part">
              {!showNavbar && (
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
              {showNavbar && (
                <Navbar showNavbar={showNavbar} onToggle={() => setShowNavbar(false)} />
              )}
              <div style={{ flex: 1, marginLeft: showNavbar ? 270 : 0, transition: 'margin-left 0.2s' }}>
                {children}
              </div>
            </section>
          </AuthGuard>
        )}
      </body>
    </html>
  );
}
