'use client';

import Navbar from '@/app/navbar/page';
import '@/app/styles/order.css';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Author } from '../types/author';

export default function Addresses() {
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
                        <div className="col-lg-9 col-12 col-right-ac">
                            <div className="bg-shadow">
                                <h1 className="title-head">Địa chỉ của bạn</h1>
                                <p className="btn-row">
                                    <button className="btn-edit-addr btn btn-primary btn-more" type="button" onClick={() => document.getElementById('add_address')?.classList.toggle('show')}>
                                        Thêm địa chỉ
                                    </button>
                                </p>
                                <div id="add_address" className="form-list modal_address modal" style={{ display: 'none' }}>
                                    <div className="btn-close closed_pop" onClick={() => document.getElementById('add_address')?.classList.remove('show')}><span></span></div>
                                    <h2 className="title_pop">Thêm địa chỉ mới</h2>
                                    <form method="post" action="/account/addresses" id="customer_address" acceptCharset="UTF-8">
                                        <input name="FormType" type="hidden" value="customer_address" />
                                        <input name="utf8" type="hidden" value="true" />
                                        <div className="pop_bottom">
                                            <div className="form_address">
                                                <div className="field">
                                                    <fieldset className="form-group">
                                                        <input type="text" name="FullName" className="form-control" required autoCapitalize="words" />
                                                        <label>Họ tên*</label>
                                                    </fieldset>
                                                </div>
                                                <div className="field">
                                                    <fieldset className="form-group">
                                                        <input type="number" className="form-control" id="Phone" name="Phone" required maxLength={12} />
                                                        <label>Số điện thoại*</label>
                                                    </fieldset>
                                                </div>
                                                <div className="field">
                                                    <fieldset className="form-group">
                                                        <input type="text" className="form-control" name="Company" />
                                                        <label>Công ty</label>
                                                    </fieldset>
                                                </div>
                                                <div className="field">
                                                    <fieldset className="form-group select-field">
                                                        <select name="Country" className="form-control" required>
                                                            <option value="Vietnam">Vietnam</option>
                                                            {/* Thêm các quốc gia khác nếu cần */}
                                                        </select>
                                                        <label>Quốc gia</label>
                                                    </fieldset>
                                                </div>
                                                <div className="field">
                                                    <fieldset className="form-group">
                                                        <input type="text" className="form-control" required name="Address1" />
                                                        <label>Địa chỉ*</label>
                                                    </fieldset>
                                                </div>
                                                <div className="field">
                                                    <fieldset className="form-group">
                                                        <input type="text" className="form-control" name="Zip" />
                                                        <label>Mã Zip</label>
                                                    </fieldset>
                                                </div>
                                            </div>
                                            <div className="btn-row">
                                                <button className="btn btn-lg btn-dark-address btn-outline" type="button" onClick={() => document.getElementById('add_address')?.classList.remove('show')}>
                                                    Hủy
                                                </button>
                                                <button className="btn btn-lg btn-primary btn-submit" type="submit">
                                                    Thêm địa chỉ
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="row total_address">
                                    <div id="view_address_27730392" className="customer_address col-xs-12 col-lg-12 col-md-12 col-xl-12">
                                        <div className="address_info" style={{ borderTop: '1px #ebebeb solid', paddingTop: '16px', marginTop: '20px' }}>
                                            <div className="address-group">
                                                <div className="address form-signup">
                                                    <p><strong>Họ tên: </strong>  {user.name}
                                                        <span className="address-default"><i className="far fa-check-circle"></i>Địa chỉ mặc định</span>
                                                    </p>
                                                    <p>
                                                        <strong>Địa chỉ: </strong>
                                                        {user.address || "Chưa cập nhật"}
                                                    </p>
                                                    <p><strong>Số điện thoại:</strong> {user.phone || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            <div id="tool_address_27730392" className="btn-address">
                                                <p className="btn-row">
                                                    <button className="btn-edit-addr btn btn-primary btn-edit" type="button" onClick={() => document.getElementById('')?.classList.toggle('show')}>
                                                        Sửa
                                                    </button>
                                                    <button className="btn btn-dark-address btn-edit-addr btn-delete" type="button" onClick={() => {/* Xóa địa chỉ */ }}>
                                                        <span>Xóa</span>
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="edit_address_27730392" className="form-list modal_address modal modal_edit_address" style={{ display: 'none' }}>
                                        <div className="btn-close closed_pop" onClick={() => document.getElementById('edit_address_27730392')?.classList.remove('show')}><span></span></div>
                                        <h2 className="title_pop">Chỉnh sửa địa chỉ</h2>
                                        <form method="post" action="/account/addresses/27730392" id="customer_address" acceptCharset="UTF-8">
                                            <input name="FormType" type="hidden" value="customer_address" />
                                            <input name="utf8" type="hidden" value="true" />
                                            <div className="pop_bottom">
                                                <div className="form_address">
                                                    <div className="field">
                                                        <fieldset className="form-group">
                                                            <input type="text" name="FullName" className="form-control" required defaultValue="Nguyễn Bá Tâm" autoCapitalize="words" />
                                                            <label>Họ tên*</label>
                                                        </fieldset>
                                                    </div>
                                                    <div className="field">
                                                        <fieldset className="form-group">
                                                            <input type="number" className="form-control" required id="Phone" name="Phone" maxLength={12} defaultValue="0917085061" />
                                                            <label>Số điện thoại*</label>
                                                        </fieldset>
                                                    </div>
                                                    <div className="field">
                                                        <fieldset className="form-group">
                                                            <input type="text" className="form-control" name="Company" />
                                                            <label>Công ty</label>
                                                        </fieldset>
                                                    </div>
                                                    <div className="field">
                                                        <fieldset className="form-group select-field">
                                                            <select name="Country" className="form-control" required defaultValue="Vietnam">
                                                                <option value="Vietnam">Vietnam</option>
                                                                {/* Thêm các quốc gia khác nếu cần */}
                                                            </select>
                                                            <label>Quốc gia</label>
                                                        </fieldset>
                                                    </div>
                                                    <div className="field">
                                                        <fieldset className="form-group">
                                                            <input type="text" className="form-control" required name="Address1" defaultValue="đội 9 thôn 1" />
                                                            <label>Địa chỉ*</label>
                                                        </fieldset>
                                                    </div>
                                                    <div className="field">
                                                        <fieldset className="form-group">
                                                            <input type="text" className="form-control" name="Zip" defaultValue="600000" />
                                                            <label>Mã Zip</label>
                                                        </fieldset>
                                                    </div>
                                                </div>
                                                <div className="btn-row">
                                                    <button className="btn btn-dark-address btn-fix-addr btn-close" type="button" onClick={() => document.getElementById('edit_address_27730392')?.classList.remove('show')}>
                                                        Hủy
                                                    </button>
                                                    <button className="btn btn-primary btn-submit" id="update" type="submit">
                                                        <span>Cập nhật địa chỉ</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
