'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { resetPassword } from '@/app/lib/authorApi';
import Link from 'next/link';
import "../../styles/login.css";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const otp = searchParams.get("otp") || "";
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await resetPassword(email, otp, newPassword, confirmPassword);
            setMessage(data.message);
            router.push("/login");
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Lỗi đặt lại mật khẩu");
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
                                        <h1 className="title_heads a-center"><span>Đặt lại mật khẩu</span></h1>
                                        <div id="login" className="section">
                                            <form onSubmit={handleSubmit} id="customer_login" acceptCharset="UTF-8">
                                                <input name="FormType" type="hidden" defaultValue="customer_login" />
                                                <input name="utf8" type="hidden" defaultValue="true" />
                                                <span className="form-signup" style={{ color: 'red' }}>
                                                </span>
                                                <div className="form-signup clearfix">
                                                    <fieldset className="form-group">
                                                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mật khẩu mới" required />
                                                    </fieldset>
                                                    <fieldset className="form-group">
                                                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Xác nhận mật khẩu" required />
                                                    </fieldset>
                                                    <div className="pull-xs-left">
                                                        <button type="submit" defaultValue="Đăng nhập" className="btn btn-primary btn-style">Gửi OTP</button>
                                                    </div>
                                                    {message && <p>{message}</p>}
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

export default function ResetPasswordPage() {
  return <ResetPasswordContent />;
}
