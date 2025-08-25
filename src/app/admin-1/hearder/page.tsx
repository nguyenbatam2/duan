"use client";
import "../style/login.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DataTablePage() {
  return (
    <div className="container-fluid g-0">
      <div className="row">
        <div className="col-lg-12 p-0">
          <div className="header_iner d-flex justify-content-between align-items-center">
            <div className="sidebar_icon d-lg-none">
              <i className="ti-menu"></i>
            </div>

            <div className="serach_field-area">
              <div className="search_inner">
                <form action="#">
                  <div className="search_field">
                    <input type="text" placeholder="Search here..." />
                  </div>
                  <button type="submit">
                    <img src="/img/icon_search.svg" alt="" />
                  </button>
                </form>
              </div>
            </div>

            <div className="header_right d-flex justify-content-between align-items-center">
              <ul className="header_notification_warp d-flex align-items-center">
                <li>
                  <a className="bell_notification_clicker" href="#">
                    <img src="/img/bell.svg" alt="" />
                    <span>04</span>
                  </a>
                  <div className="Menu_NOtification_Wrap">
                    <div className="notification_Header">
                      <h4>Notifications</h4>
                    </div>
                    <div className="Notification_body">
                      {[
                        {img: "/img/staf/2.png", title: "Cool Directory"},
                        {img: "/img/staf/4.png", title: "Awesome packages"},
                        {img: "/img/staf/3.png", title: "what a packages"},
                        {img: "/img/staf/2.png", title: "Cool Directory"},
                        {img: "/img/staf/4.png", title: "Awesome packages"},
                        {img: "/img/staf/3.png", title: "what a packages"},
                      ].map((item, i) => (
                        <div key={i} className="single_notify d-flex align-items-center">
                          <div className="notify_thumb">
                            <a href="#"><img src={item.img} alt="" /></a>
                          </div>
                          <div className="notify_content">
                            <a href="#"><h5>{item.title}</h5></a>
                            <p>Lorem ipsum dolor sit amet</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="nofity_footer">
                      <div className="submit_button text-center pt_20">
                        <a href="#" className="btn_1">See More</a>
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <a className="CHATBOX_open" href="#">
                    <img src="/img/msg.svg" alt="" /> <span>01</span>
                  </a>
                </li>
              </ul>

              <div className="profile_info">
                <img src="/img/client_img.png" alt="#" />
                <div className="profile_info_iner">
                  <div className="profile_author_name">
                    <p>Neurologist</p>
                    <h5>Dr. Robar Smith</h5>
                  </div>
                  <div className="profile_info_details">
                    <a href="#">My Profile</a>
                    <a href="#">Settings</a>
                    <a href="#">Log Out</a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
