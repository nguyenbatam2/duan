"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const menu = [
  { label: "Thống kê", href: "/admin/Statistic", icon: "" },
  { label: "Quản lý Sản phẩm", href: "/admin/product", icon: "" },
  { label: "Quản lý Danh Mục", href: "/admin/category", icon: "" },
  { label: "Quản lý Đơn Hàng", href: "/admin/Oder", icon: "" },
  { label: "Quản lý Khách Hàng", href: "/admin/user", icon: "" },
  { label: "Quản lý Sự Kiện", href: "/admin/Event", icon: "" },
  { label: "Quản lý Mã Giảm Giá", href: "/admin/CouponPage", icon: "" },
  { label: "Quản lý bình luận", href: "/admin/reviews", icon: "" },
  { label: "Quản lý Bài viết", href: "/admin/posts", icon: "" },
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
          style={{
            position: 'absolute',
            top: 700,
            right: 18,
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: 20,
            cursor: 'pointer',
            zIndex: 1001,
          }}
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
              <span className="navbar-icon">{item.icon}</span>
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
          align-items: flex-start;
          padding: 18px 0 0 0;
          position: fixed;
          left: 0; top: 0; bottom: 0;
          z-index: 100;
          transition: background 0.2s;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          padding-left: 22px;
        }
        .navbar-title {
          font-size: 1.08rem;
          font-weight: bold;
          color: #3b3b3b;
          letter-spacing: 1px;
          background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .navbar-menu {
          list-style: none;
          padding: 0 0 0 2px;
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
          gap: 10px;
          padding: 9px 14px 9px 20px;
          color: #444;
          text-decoration: none;
          font-size: 0.97rem;
          font-weight: 500;
          border-radius: 8px 0 0 8px;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
          line-height: 1.13;
        }
        .navbar-menu li.active, .navbar-link:hover {
          background: linear-gradient(90deg, #e0e7ff 0%, #f0f4ff 100%);
          box-shadow: 2px 0 0 #6366f1;
        }
        .navbar-menu li.active .navbar-link, .navbar-link:hover {
          color: #2563eb;
          font-weight: 600;
        }
        .navbar-icon {
          font-size: 1.15em;
          width: 1.7em;
          text-align: center;
        }
        .navbar-label {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .navbar-user {
          margin-top: auto;
          width: 100%;
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
          font-size: 1.08rem;
          box-shadow: 0 2px 8px #0001;
          border: 2px solid #fff;
          transition: background 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .avatar:hover {
          background: #2563eb;
          box-shadow: 0 4px 16px #6366f133;
        }
        @media (max-width: 900px) {
          .navbar-modern { width: 54px; padding-left: 0; }
          .navbar-title { display: none; }
          .navbar-link span:not(.navbar-icon) { display: none; }
          .navbar-logo { padding-left: 0; }
        }
        @media (max-width: 600px) {
          .navbar-modern { display: none; }
        }
        body.dark .navbar-modern {
          background: #181a20;
          border-right: 1px solid #222;
        }
        body.dark .navbar-title { color: #fff; }
        body.dark .navbar-link { color: #bbb; }
        body.dark .navbar-menu li.active, body.dark .navbar-link:hover {
          background: linear-gradient(90deg, #334155 0%, #1e293b 100%);
          color: #60a5fa;
        }
        body.dark .avatar { background: #2563eb; }
      `}</style>
    </nav>
  );
}
