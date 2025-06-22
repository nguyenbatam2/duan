import React from "react";
// import x3094352 from "./3094352.png";
// import eyeSlashFill from "./eye-slash-fill.svg";
import "@/app/styles/login.css";

export default function LoginPage() {
    return (
        <div className="login-page">
            <div className="div">
                <img className="element" alt="Element" src="/img/3094352.jpg" />

                <div className="group">
                    <div className="text-wrapper">Đăng nhập</div>

                    <p className="p">
                        Chào mừng bạn trở lại! Vui lòng nhập thông tin của bạn.
                    </p>

                    {/* Email Input */}
                    <div className="frame">
                        <input
                            type="email"
                            placeholder="Email"
                            className="text-wrapper-2"
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '20px',
                                background: 'transparent',
                            }}
                        />
                    </div>

                    {/* Mật khẩu Input */}
                    <div className="frame-2">
                        <input
                            type="password"
                            placeholder="Mật Khẩu"
                            className="text-wrapper-2"
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '20px',
                                background: 'transparent',
                            }}
                        />
                        <i className="eye-slash-fill"></i>
                    </div>

                    {/* Ghi nhớ + Quên mật khẩu */}
                    <div className="group-2">
                        <div className="text-wrapper-4">Quên mật khẩu</div>
                        <div className="frame-3">
                            <input type="checkbox" id="remember" className="rectangle" />
                            <label htmlFor="remember" className="text-wrapper-5">Ghi nhớ</label>
                        </div>
                    </div>

                    {/* Nút Đăng nhập */}
                    <div className="div-wrapper">
                        <button type="submit" className="text-wrapper-3" style={{ background: 'none', border: 'none', color: '#fff' }}>
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
      
    );
};
