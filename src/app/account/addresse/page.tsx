'use client';

import Navbar from '@/app/navbar/page';
import '@/app/styles/order.css';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Author } from '@/app/types/author';
import {
  getUserAddresses,
  addUserAddress,
  updateUserAddressById,
  deleteUserAddress,
  UserAddress,
} from '@/app/lib/authorApi';

function validateForm(form: { name: string; phone: string; address: string }) {
    if (!form.name.trim()) return 'Tên không được để trống';
    if (!form.address.trim()) return 'Địa chỉ không được để trống';
    if (!/^[\p{L}0-9 .'-]+$/u.test(form.name)) return 'Tên không hợp lệ';
    if (!/^\d{9,12}$/.test(form.phone)) return 'Số điện thoại phải là 9-12 chữ số';
    return '';
}

export default function Addresses() {
    const [user, setUser] = useState<Author | null>(null);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState<number | null>(null);
    const [form, setForm] = useState({ name: '', phone: '', address: '', is_default: 0 });
    const [message, setMessage] = useState('');
    // Thêm state cho spinner
    const [spinner, setSpinner] = useState(false);

    // Load user
    useEffect(() => {
        const cookieData = Cookies.get("author");
        if (cookieData) {
            try {
                const parsed = JSON.parse(cookieData);
                setUser(parsed.user);
            } catch (error) {
                console.error("Không thể parse cookie:", error);
            }
        }
    }, []);

    // Load addresses
    useEffect(() => {
        if (user) fetchAddresses();
        // eslint-disable-next-line
    }, [user]);

    const fetchAddresses = async () => {
        setLoading(true); setSpinner(true);
        try {
            const data = await getUserAddresses();
            setAddresses(data);
        } catch {
            setMessage('Không thể tải địa chỉ!');
        } finally {
            setLoading(false); setSpinner(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validateForm(form);
        if (err) { setMessage(err); return; }
        setLoading(true); setSpinner(true);
        try {
            await addUserAddress(form);
            setShowAdd(false);
            setForm({ name: '', phone: '', address: '', is_default: 0 });
            fetchAddresses();
        } catch {
            setMessage('Thêm địa chỉ thất bại!');
        } finally {
            setLoading(false); setSpinner(false);
        }
    };

    const handleEdit = (addr: UserAddress) => {
        setShowEdit(addr.id);
        setForm({ name: addr.name, phone: addr.phone, address: addr.address, is_default: addr.is_default });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (showEdit == null) return;
        const err = validateForm(form);
        if (err) { setMessage(err); return; }
        setLoading(true); setSpinner(true);
        try {
            await updateUserAddressById(showEdit, form);
            setShowEdit(null);
            setForm({ name: '', phone: '', address: '', is_default: 0 });
            fetchAddresses();
        } catch {
            setMessage('Cập nhật địa chỉ thất bại!');
        } finally {
            setLoading(false); setSpinner(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa địa chỉ này?')) return;
        setLoading(true);
        try {
            await deleteUserAddress(id);
            fetchAddresses();
        } catch {
            setMessage('Xóa địa chỉ thất bại!');
        } finally {
            setLoading(false);
        }
    };

    // Đặt làm mặc định
    const handleSetDefault = async (addr: UserAddress) => {
        setLoading(true); setSpinner(true);
        try {
            await updateUserAddressById(addr.id, { ...addr, is_default: 1 });
            fetchAddresses();
        } catch {
            setMessage('Không thể đặt làm mặc định!');
        } finally {
            setLoading(false); setSpinner(false);
        }
    };

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
                                    <button className="btn-edit-addr btn btn-primary btn-more" type="button" onClick={() => setShowAdd(true)}>
                                        Thêm địa chỉ
                                    </button>
                                </p>
                                {spinner && <div style={{textAlign:'center',margin:'10px'}}><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...</div>}
                                {message && <div style={{ color: 'red' }}>{message}</div>}
                                {/* Danh sách địa chỉ */}
                                <div className="row total_address">
                                    {addresses.map(addr => (
                                        <div key={addr.id} className="customer_address col-xs-12 col-lg-12 col-md-12 col-xl-12">
                                            <div className="address_info" style={{ borderTop: '1px #ebebeb solid', paddingTop: '16px', marginTop: '20px' }}>
                                                <div className="address-group">
                                                    <div className="address form-signup">
                                                        <p><strong>Họ tên: </strong>  {addr.name}
                                                            {addr.is_default ? <span className="address-default"><i className="far fa-check-circle"></i>Địa chỉ mặc định</span> : (
                                                                <button style={{marginLeft:8}} className="btn btn-sm btn-outline-primary" onClick={() => handleSetDefault(addr)} disabled={loading}>Đặt làm mặc định</button>
                                                            )}
                                                        </p>
                                                        <p>
                                                            <strong>Địa chỉ: </strong>
                                                            {addr.address}
                                                        </p>
                                                        <p><strong>Số điện thoại:</strong> {addr.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="btn-address">
                                                    <p className="btn-row">
                                                        <button className="btn-edit-addr btn btn-primary btn-edit" type="button" onClick={() => handleEdit(addr)}>
                                                            Sửa
                                                        </button>
                                                        <button className="btn btn-dark-address btn-edit-addr btn-delete" type="button" onClick={() => handleDelete(addr.id)}>
                                                            <span>Xóa</span>
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Form sửa địa chỉ */}
                                            {showEdit === addr.id && (
                                                <div className="form-list modal_address modal modal_edit_address" style={{ display: 'block' }}>
                                                    <div className="btn-close closed_pop" onClick={() => setShowEdit(null)}><span></span></div>
                                                    <h2 className="title_pop">Chỉnh sửa địa chỉ</h2>
                                                    <form onSubmit={handleUpdate}>
                                                        <div className="pop_bottom">
                                                            <div className="form_address">
                                                                <div className="field">
                                                                    <fieldset className="form-group">
                                                                        <input type="text" name="name" className="form-control" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoCapitalize="words" />
                                                                        <label>Họ tên*</label>
                                                                    </fieldset>
                                                                </div>
                                                                <div className="field">
                                                                    <fieldset className="form-group">
                                                                        <input type="text" className="form-control" required name="phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} maxLength={12} />
                                                                        <label>Số điện thoại*</label>
                                                                    </fieldset>
                                                                </div>
                                                                <div className="field">
                                                                    <fieldset className="form-group">
                                                                        <input type="text" className="form-control" required name="address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                                                                        <label>Địa chỉ*</label>
                                                                    </fieldset>
                                                                </div>
                                                            </div>
                                                            <div className="btn-row">
                                                                <button className="btn btn-dark-address btn-fix-addr btn-close" type="button" onClick={() => setShowEdit(null)}>
                                                                    Hủy
                                                                </button>
                                                                <button className="btn btn-primary btn-submit" type="submit">
                                                                    <span>Cập nhật địa chỉ</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {/* Form thêm địa chỉ */}
                                {showAdd && (
                                    <div className="form-list modal_address modal" style={{ display: 'block' }}>
                                        <div className="btn-close closed_pop" onClick={() => setShowAdd(false)}><span></span></div>
                                        <h2 className="title_pop">Thêm địa chỉ mới</h2>
                                        <form onSubmit={handleAdd}>
                                            <div className="pop_bottom">
                                                <div className="form_address">
                                                    <div className="field">
                                                        <fieldset className="form-group">
                                                            <input type="text" name="name" className="form-control" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoCapitalize="words" />
                                                            <label>Họ tên*</label>
                                                        </fieldset>
                                                    </div>
                                                    <div className="field">
                                                        <fieldset className="form-group">
                                                            <input type="text" className="form-control" required name="phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} maxLength={12} />
                                                            <label>Số điện thoại*</label>
                                                        </fieldset>
                                                    </div>
                                                    <div className="field">
                                                        <fieldset className="form-group">
                                                            <input type="text" className="form-control" required name="address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                                                            <label>Địa chỉ*</label>
                                                        </fieldset>
                                                    </div>
                                                </div>
                                                <div className="btn-row">
                                                    <button className="btn btn-lg btn-dark-address btn-outline" type="button" onClick={() => setShowAdd(false)}>
                                                        Hủy
                                                    </button>
                                                    <button className="btn btn-lg btn-primary btn-submit" type="submit">
                                                        Thêm địa chỉ
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
