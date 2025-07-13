"use client";
import Link from 'next/link';
import "../styles/login.css";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../lib/authorApi';
import { useAuth } from '../context/authContext';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();
        try {
            const data = await loginUser({ email, password });
            if (data) {
                login(data);
                router.push("/");   // chuyển về trang chủ
                console.log(data)
            }
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
        }
    }

    return (
        <>
            <div className="bg-gray">
                <section className="bread-crumb">
                    <div className="container">
                        <ul className="breadcrumb">
                            <li className="home">
                                <Link href="/" title="Trang chủ"><span>Trang chủ</span></Link>
                                <span className="mr_lr">&nbsp;<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-chevron-right fa-w-10"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" className=""></path></svg>&nbsp;</span>
                            </li>

                            <li><strong><span>Đăng nhập tài khoản</span></strong></li>

                        </ul>
                    </div>
                </section>
                <section className="section">
                    <div className="container">
                        <div className="page_login">
                            <div className="row">
                                <div className="col-lg-4 col-md-6 col-sm-12 col-xl-4 offset-0 offset-xl-4 offset-lg-4 offset-md-3 offset-xl-3 col-12">
                                    <div className="page-login pagecustome clearfix">
                                        <div className="wpx">
                                            <h1 className="title_heads a-center"><span>Đăng nhập</span></h1>
                                            <div id="login" className="section">
                                                <form onSubmit={handleSubmit} id="customer_login" acceptCharset="UTF-8">
                                                    <input name="FormType" type="hidden" defaultValue="customer_login" />
                                                    <input name="utf8" type="hidden" defaultValue="true" />
                                                    <span className="form-signup" style={{ color: 'red' }}>
                                                    </span>
                                                    <div className="form-signup clearfix">
                                                        <fieldset className="form-group">
                                                            <input
                                                                type="email"
                                                                title="Email không hợp lệ"
                                                                required
                                                                value={email}
                                                                onChange={e => setEmail(e.target.value)}
                                                            />
                                                        </fieldset>
                                                        <fieldset className="form-group">
                                                            <input type="password" className="form-control form-control-lg" value={password} onChange={e => setPassword(e.target.value)} name="password" id="customer_password" placeholder="Mật khẩu" />
                                                        </fieldset>
                                                        <div className="pull-xs-left">
                                                            <button type="submit" defaultValue="Đăng nhập" className="btn btn-primary btn-style">Đăng nhập</button>
                                                        </div>
                                                        <div className="btn_boz_khac">
                                                            <div className="btn_khac">
                                                                <span>
                                                                    <Link href="../forgotPassword/request" className="quenmk" >Quên mật khẩu?</Link>
                                                                </span>
                                                                <Link href="/register" className="btn-link-style btn-register" title="Đăng ký tại đây">Đăng ký tại đây</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                                        <div className="block social-login--facebooks">
                                                            <div className="line-break">
                                                                <span>hoặc đăng nhập qua</span>
                                                            </div>
                                                            {/* Social Login Buttons */}
                                                            <Link
                                                                href="#"
                                                                className="social-login--facebook"
                                                                // onClick={(e) => {
                                                                //     e.preventDefault();
                                                                //     const params = {
                                                                //         client_id: "947410958642584",
                                                                //         redirect_uri: "https://store.mysapo.net/account/facebook_account_callback",
                                                                //         state: JSON.stringify({ redirect_url: window.location.href }),
                                                                //         scope: "email",
                                                                //         response_type: "code",
                                                                //     };
                                                                //     const query = Object.entries(params)
                                                                //         .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
                                                                //         .join("&");
                                                                //     window.location.href = `https://www.facebook.com/v3.2/dialog/oauth?${query}`;
                                                                // }}
                                                            >
                                                                <img
                                                                    width="129px"
                                                                    height="37px"
                                                                    alt="facebook-login-button"
                                                                    src="//bizweb.dktcdn.net/assets/admin/images/login/fb-btn.svg"
                                                                />
                                                            </Link>
                                                            <Link
                                                                href="#"
                                                                className="social-login--google"
                                                                // onClick={(e) => {
                                                                //     e.preventDefault();
                                                                //     const params = {
                                                                //         client_id: "997675985899-pu3vhvc2rngfcuqgh5ddgt7mpibgrasr.apps.googleusercontent.com",
                                                                //         redirect_uri: "https://store.mysapo.net/account/google_account_callback",
                                                                //         scope: "email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
                                                                //         access_type: "online",
                                                                //         state: JSON.stringify({ redirect_url: window.location.href }),
                                                                //         response_type: "code",
                                                                //     };
                                                                //     const query = Object.entries(params)
                                                                //         .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
                                                                //         .join("&");
                                                                //     window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${query}`;
                                                                // }}
                                                            >
                                                                <img
                                                                    width="129px"
                                                                    height="37px"
                                                                    alt="google-login-button"
                                                                    src="//bizweb.dktcdn.net/assets/admin/images/login/gp-btn.svg"
                                                                />
                                                            </Link>
                                                        </div>
                                                    </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                    </div>
                        </section>
                    </div>
        </>
    )
}
