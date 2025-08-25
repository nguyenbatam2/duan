import Link from "next/link";

const menu = [
  { label: "Thống kê", href: "/admin/Statistic", icon: "fas fa-chart-line" },
  { label: "Quản lý Sản phẩm", href: "/admin/product", icon: "fas fa-list" },
  { label: "Quản lý Danh Mục", href: "/admin/category", icon: "fas fa-list-alt" },
  { label: "Quản lý Đơn Hàng", href: "/admin/Oder", icon: "fas fa-shopping-cart" },
  { label: "Quản lý Khách Hàng", href: "/admin/user", icon: "fas fa-user-friends" },
  { label: "Quản lý Sự Kiện", href: "/admin/Event", icon: "fas fa-calendar-alt" },
  { label: "Quản lý Mã Giảm Giá", href: "/admin/CouponPage", icon: "fas fa-tags" },
  { label: "Quản lý bình luận", href: "/admin/reviews", icon: "fas fa-star" },
  { label: "Quản lý Bài viết", href: "/admin/posts", icon: "fas fa-edit" },
];

export default function Navbar() {
  return (
    <>
      {/* Sidebar Left */}
      <nav className="sidebar-left close">
        <header>
          <div className="image-text">
            <span className="image">
              <img
                src="https://bizweb.dktcdn.net/thumb/medium/100/516/909/themes/959590/assets/shop_logo_image.png?1734935897344"
                alt="logo"
                className="logo"
                width="40"
                height="40"
              />
            </span>

            <div className="text logo-text">
              <span className="name">F1GEn</span>
            </div>
          </div>
        </header>

        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              {menu.map((item, index) => (
                <li key={index} className="nav-link">
                  <Link href={item.href}>
                    <i className={`${item.icon} icon`}></i>
                    <span className="text nav-text">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bottom-content">
            <li>
              <Link href="#">
                <span className="icon">VI</span>
              </Link>
            </li>
            <hr />
            <li>
              <Link href="#">
                <span className="icon">{">"}</span>
              </Link>
            </li>
          </div>
        </div>
      </nav>

      {/* Sidebar Right */}
      <nav className="sidebar-right close">
        <header>
          <div className="image-text">
            <span className="image">
              <img
                src="https://th.bing.com/th/id/OIP.5h0o8coBazU9OElxctg3ogHaFj?rs=1&pid=ImgDetMain"
                alt="avatar"
              />
            </span>

            <div className="text logo-text">
              <span className="name">F1GEn</span>
            </div>
          </div>
        </header>

        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              <li className="nav-link">
                <Link href="#">
                  <i className="fas fa-bell icon"></i>
                </Link>
              </li>

              <li className="nav-link">
                <Link href="#">
                  <i className="fas fa-comments icon"></i>
                </Link>
              </li>

              <li className="nav-link">
                <Link href="#">
                  <i className="fas fa-question-circle icon cl"></i>
                </Link>
              </li>

              <li className="nav-link">
                <Link href="#">
                  <i className="fas fa-globe icon cl"></i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
