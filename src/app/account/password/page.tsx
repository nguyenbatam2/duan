'use client';

import '@/app/styles/order.css';
import { useState } from 'react';
import Navbar from '@/app/navbar/page';
import { changePassword } from '@/app/lib/authorApi';

export default function RegisterPassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword.length < 8) {
            setError('Mật khẩu mới phải có ít nhất 8 ký tự.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            await changePassword(
                oldPassword,
                newPassword,
                confirmPassword
            );
            setSuccess('Đổi mật khẩu thành công!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || 'Đổi mật khẩu thất bại.');
        }
    };

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
                                            <form id="change_customer_password" onSubmit={handleSubmit}>
                                                <p>Để đảm bảo tính bảo mật bạn vui lòng đặt lại mật khẩu với ít nhất 8 kí tự</p>
                                                <div className="form-signup clearfix">
                                                    <fieldset className="form-group">
                                                        <label htmlFor="OldPass">Mật khẩu cũ <span className="error">*</span></label>
                                                        <input
                                                            type="password"
                                                            name="OldPassword"
                                                            id="OldPass"
                                                            required
                                                            className="form-control form-control-lg"
                                                            value={oldPassword}
                                                            onChange={e => setOldPassword(e.target.value)}
                                                        />
                                                    </fieldset>
                                                    <fieldset className="form-group">
                                                        <label htmlFor="changePass">Mật khẩu mới <span className="error">*</span></label>
                                                        <input
                                                            type="password"
                                                            name="Password"
                                                            id="changePass"
                                                            required
                                                            className="form-control form-control-lg"
                                                            value={newPassword}
                                                            onChange={e => setNewPassword(e.target.value)}
                                                        />
                                                    </fieldset>
                                                    <fieldset className="form-group">
                                                        <label htmlFor="confirmPass">Xác nhận lại mật khẩu <span className="error">*</span></label>
                                                        <input
                                                            type="password"
                                                            name="ConfirmPassword"
                                                            id="confirmPass"
                                                            required
                                                            className="form-control form-control-lg"
                                                            value={confirmPassword}
                                                            onChange={e => setConfirmPassword(e.target.value)}
                                                        />
                                                    </fieldset>
                                                    {error && <div className="text-danger">{error}</div>}
                                                    {success && <div className="text-success">{success}</div>}
                                                    <button
                                                        className="button btn-edit-addr btn btn-primary btn-more"
                                                        type="submit"
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
    );
}