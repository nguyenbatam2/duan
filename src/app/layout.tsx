"use client";
import { usePathname } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import Header from "@/app/Component/header";
import Slider from '@/app/Component/slider';
import Footer from "@/app/Component/footer";
import "../app/styles/index.css";
import "../app/styles/main.css";

// app/layout.tsx hoặc app/fonts.ts
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
        />
        <link
          rel="shortcut icon"
          href="/img/logo-web.png"
          type="image/x-icon"
        />
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        <Header />
        {isHomePage && <Slider />}
        <div className="bodywrap">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
