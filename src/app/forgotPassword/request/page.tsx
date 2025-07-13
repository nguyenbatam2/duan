"use client";
import { useState } from 'react';
import Link from 'next/link';
import { requestOtp } from '@/app/lib/authorApi';
import { useRouter } from 'next/navigation';
import "../../styles/login.css"

export default function RequestOtpPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await requestOtp(email);
            router.push(`/forgotPassword/verify?email=${email}`); // Chuyển hướng đến trang xác minh OTP
            setMessage(data.message);
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Lỗi gửi OTP");
        }
    };

    return (
<div className="bg-gray">
            <section className="section">
                <div className="container">
                    <div className="page_login">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-sm-12 col-xl-4 offset-0 offset-xl-4 offset-lg-4 offset-md-3 offset-xl-3 col-12">
                                <div className="page-login pagecustome clearfix">
                                    <div className="wpx">
                                        <h1 className="title_heads a-center"><span>Gửi OTP</span></h1>
                                        <div id="login" className="section">
                                            <form onSubmit={handleSubmit} id="customer_login" acceptCharset="UTF-8">
                                                <input name="FormType" type="hidden" defaultValue="customer_login" />
                                                <input name="utf8" type="hidden" defaultValue="true" />
                                                <span className="form-signup" style={{ color: 'red' }}>
                                                </span>
                                                <div className="form-signup clearfix">
                                                    <fieldset className="form-group">
                                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                                                    </fieldset>
                                                    {message && <p>{message}</p>}
                                                    <div className="pull-xs-left">
                                                        <button type="submit" defaultValue="Đăng nhập" className="btn btn-primary btn-style">Gửi OTP</button>
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
                                                className="social-login--facebook">
                                                <img
                                                    width="129px"
                                                    height="37px"
                                                    alt="facebook-login-button"
                                                    src="//bizweb.dktcdn.net/assets/admin/images/login/fb-btn.svg"
                                                />
                                            </Link>
                                            <Link
                                                href="#"
                                                className="social-login--google">
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
    );
}
