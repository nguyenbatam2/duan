"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const menu = [
  { label: "Thống kê", href: "/admin/Statistic" },
  { label: "Quản lý Sản phẩm", href: "/admin/product" },
  { label: "Quản lý Danh Mục", href: "/admin/category" },
  { label: "Quản lý Đơn Hàng", href: "/admin/Oder" },
  { label: "Quản lý Khách Hàng", href: "/admin/user" },
  { label: "Quản lý Sự Kiện", href: "/admin/Event" },
  { label: "Quản lý Mã Giảm Giá", href: "/admin/CouponPage" },
  { label: "Quản lý bình luận", href: "/admin/reviews" },
  { label: "Quản lý Bài viết", href: "/admin/posts" },
];

interface NavbarProps {
  showNavbar?: boolean;
  onToggle?: () => void;
}

export default function Navbar({ showNavbar = true, onToggle }: NavbarProps) {
  const pathname = usePathname();
  if (!showNavbar) return null;

  return (
    <nav className="navbar-modern">
      {onToggle && (
        <button
          onClick={onToggle}
          className="toggle-button"
          aria-label="Ẩn menu"
        >
          ←
        </button>
      )}
      <div className="navbar-logo">
        <img src="/img/logo.png" alt="Logo" height={36} />
      </div>
      <ul className="navbar-menu">
        {menu.map(item => (
          <li key={item.href} className={pathname.startsWith(item.href) ? "active" : ""}>
            <Link href={item.href} className="navbar-link">
              <span className="navbar-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="navbar-user">
        <div className="avatar" title="Tài khoản">N</div>
        <LogoutButton variant="compact" />
      </div>
      <style>{`
        .navbar-modern {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          border-right: 1px solid #e5e7eb;
          min-height: 100vh;
          width: 270px;
          display: flex;
          flex-direction: column;
          padding: 18px 0;
          position: fixed;
          left: 0; top: 0; bottom: 0;
          z-index: 100;
          transition: background 0.2s;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          margin-bottom: 28px;
          padding-left: 22px;
        }
        .navbar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 100%;
        }
        .navbar-menu li {
          margin-bottom: 7px;
          border-radius: 8px 0 0 8px;
          transition: background 0.15s, box-shadow 0.15s;
        }
        .navbar-link {
          display: flex;
          align-items: center;
          padding: 9px 20px;
          color: #444;
          text-decoration: none;
          font-size: 0.97rem;
          border-radius: 8px 0 0 8px;
          transition: background 0.15s, color 0.15s;
        }
        .navbar-menu li.active, .navbar-link:hover {
          background: linear-gradient(90deg, #e0e7ff 0%, #f0f4ff 100%);
          color: #2563eb;
        }
        .navbar-user {
          margin-top: auto;
          display: flex;
          justify-content: center;
          padding-bottom: 18px;
        }
        .avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #2563eb 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          cursor: pointer;
        }
        .toggle-button {
          position: absolute;
          top: 700px;
          right: 18px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 20px;
          cursor: pointer;
          z-index: 1001;
        }
        @media (max-width: 900px) {
          .navbar-modern { width: 54px; }
          .navbar-logo { padding-left: 0; }
        }
        @media (max-width: 600px) {
          .navbar-modern { display: none; }
        }
      `}</style>
    </nav>
  );
}
