'use client';

import '@/app/styles/order.css';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Author } from "@/app/types/author";
import Navbar from '@/app/navbar/page';

export default function RegisterPassword() {
    const [user, setUser] = useState<Author | null>(null);

    useEffect(() => {
        const cookieData = Cookies.get("author");
        if (cookieData) {
            try {
                const parsed = JSON.parse(cookieData);
                setUser(parsed.user); // Lưu user vào state
            } catch (error) {
                console.error("Không thể parse cookie:", error);
            }
        }
    }, []);

    if (!user) return <div>Đang tải thông tin tài khoản...</div>;
    return (
        <>
          <section className="signup page_customer_account">
            <div className="container">
                <div className="row">
                    <Navbar />
                    <div className="col-xs-12 col-sm-12 col-lg-9 col-right-ac">
                            <div className="bg-shadow">
                                <h1 className="title-head margin-top-0">Đổi mật khẩu</h1>
                                <div className="row">
                                    <div className="col-md-6 col-12">
                                        <div className="page-login">
                                            <form method="post" action="/account/changepassword" id="change_customer_password" acceptCharset="UTF-8">
                                                <input name="FormType" type="hidden" value="change_customer_password" />
                                                <input name="utf8" type="hidden" value="true" />

                                                <p>Để đảm bảo tính bảo mật bạn vui lòng đặt lại mật khẩu với ít nhất 8 kí tự</p>

                                                <div className="form-signup clearfix">
                                                    <fieldset className="form-group">
                                                        <label htmlFor="OldPass">Mật khẩu cũ <span className="error">*</span></label>
                                                        <input type="password" name="OldPassword" id="OldPass" required className="form-control form-control-lg" />
                                                    </fieldset>
                                                    <fieldset className="form-group">
                                                        <label htmlFor="changePass">Mật khẩu mới <span className="error">*</span></label>
                                                        <input type="password" name="Password" id="changePass" required className="form-control form-control-lg" />
                                                    </fieldset>
                                                    <fieldset className="form-group">
                                                        <label htmlFor="confirmPass">Xác nhận lại mật khẩu <span className="error">*</span></label>
                                                        <input type="password" name="ConfirmPassword" id="confirmPass" required className="form-control form-control-lg" />
                                                    </fieldset>
                                                    <button
                                                        className="button btn-edit-addr btn btn-primary btn-more"
                                                        type="submit"
                                                        onClick={() => window.location.reload()}
                                                    >
                                                        <i className="hoverButton"></i>Đặt lại mật khẩu
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </section>
        </>
    )
}