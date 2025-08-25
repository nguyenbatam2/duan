"use client";
import { usePathname } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Header from "@/app/Component/header";
import Slider from '@/app/Component/slider';
import Footer from "@/app/Component/footer";
import { AuthProviderContext } from "@/app/context/authContext";
import { PopupProvider } from "@/app/context/PopupContext";
import { usePopup } from "@/app/context/PopupContext";
import { Toaster } from 'react-hot-toast';
import "@/app/styles/index.css";
import "@/app/styles/main.css";
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});
// 🟢 Di chuyển phần popup ra 1 component riêng để gọi usePopup() an toàn
function CouponPopup() {
  const { isOpen, setIsOpen, selectedCoupon } = usePopup();

  if (!isOpen) return null;

  return (
    <>
      <div className="backdrop__body-backdrop___1rvky active" onClick={() => setIsOpen(false)}></div>
      <div className="popup-coupon active">
        <div className="content">
          <div className="title">Thông tin voucher</div>
          <div className="close-popup-coupon" onClick={() => setIsOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512.001 512.001" xmlSpace="preserve"> <g> <g> <path d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717    L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859    c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287    l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285    L284.286,256.002z"></path> </g> </g> </svg>
          </div>
          <ul>
            <li><span>Mã giảm giá:</span> <span>{selectedCoupon?.code}</span></li>
            <li><span>HSD:</span> <span>{selectedCoupon?.end_at}</span></li>
            <li><span>Mô tả:</span> <span>{selectedCoupon?.description || 'Không có mô tả'}</span></li>
          </ul>
        </div>
      </div>
    </>
  );
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAdminPage = pathname.startsWith('/admin');
  return (
    <html lang="en">
      <head>
        <title>Thực Phẩm Chức Năng BMB</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Recursive&display=swap" rel="stylesheet" />
        <link rel="shortcut icon" href="/img/logo-web.png" type="image/x-icon" />
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        <AuthProviderContext>
          <PopupProvider>
            {!isAdminPage && <Header />}
            {isHomePage && <Slider />}
            <div className="bodywrap">{children}</div>
            <Toaster position="top-right" reverseOrder={false} />
            {!isAdminPage && <Footer />}
            <CouponPopup />
          </PopupProvider>
        </AuthProviderContext>
        
      </body>
    </html>
  );
}
