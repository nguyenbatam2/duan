
'use client';

export const dynamic = 'force-dynamic';
import "../styles/checkout.css";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { getCart } from "../lib/addCart";
import { applyCoupon, placeOrder, } from '../lib/orderApi';
import { getUserAddresses } from '../lib/authorApi';
// import { updateUserAddressById } from '@/app/lib/authorApi'
import { OrderItem, Product } from '../types/product';

import { useRouter } from 'next/navigation';
import { UserAddress } from '@/app/types/author'
import Cookies from 'js-cookie';
import { useSearchParams } from "next/navigation";

function CheckoutContent() {
    const searchParams = useSearchParams();

  const [cart, setCart] = useState<Product[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");


  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  const router = useRouter();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = 30000;
  const tax = 5000;
  const discount = appliedCoupon ? 50000 : 0; // hoặc từ API response nếu trả về giá trị discount
  const total = subtotal + shippingFee + tax - discount;
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
  });
  const [note, setNote] = useState('');
  const payMethods = [
    {
      id: 'cod',
      label: 'Thanh toán khi nhận hàng',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="7" width="18" height="10" rx="2" fill="#c8e6c9" stroke="#388e3c" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2.5" fill="#388e3c" />
          <path d="M7 12h.01M17 12h.01" stroke="#388e3c" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      value: 'cod'
    },
    {
      id: 'bank',
      label: 'Chuyển khoản ngân hàng',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10L12 4L21 10" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" />
          <rect x="5" y="10" width="14" height="8" rx="2" fill="#e3f2fd" stroke="#1976d2" strokeWidth="1.5" />
          <rect x="9" y="14" width="6" height="2" rx="1" fill="#1976d2" />
        </svg>
      ),
      value: 'bankTransfer'
    },
    // Thêm phương thức khác nếu cần
  ];


  // Load tỉnh/thành khi component mount
  useEffect(() => {
    fetch("https://vapi.vnappmob.com/api/v2/province/")
      .then(res => res.json())
      .then(data => setProvinces(data.results))
      .catch(err => console.error(err));
  }, []);

  // Load quận/huyện khi chọn tỉnh
  useEffect(() => {
    if (selectedProvince) {
      const provinceCode = Number(selectedProvince);
      axios
        .get(`https://vapi.vnappmob.com/api/v2/province/district/${provinceCode}`)
        .then((res) => {
          setDistricts(res.data.results || []);
        })
        .catch((err) => console.error("Lỗi load quận/huyện:", err));
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);



  useEffect(() => {
    getUserAddresses().then(setAddresses);
    const cookieData = Cookies.get('author');
    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        const user = parsed.user;

        if (user) {
          setUserInfo({
            name: user.name || '',
            phone: user.phone || '',
            address: user.address || '',
            email: user.email || '',
          });
        }
      } catch (err) {
        console.error("Lỗi khi parse cookie:", err);
      }
    }
  }, []);



  useEffect(() => {
    const fetchCart = async () => {
      const cartData = await getCart();
      setCart(cartData);
    };

    fetchCart();
  }, []);
// auto coupon_code
  useEffect(() => {
    const code = searchParams.get("coupon_code");
    if (code) {
      setCouponCode(code);
      // Hoặc show toast ở đây
      console.log("Mã giảm giá đã được điền sẵn:", code);
    }
  }, [searchParams]);
  // btn giảm giá
  const handleApplyCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setError("Vui lòng nhập mã giảm giá");
      return;
    }
    try {
      const items = cart.map((item) => ({
        product_id: item.id,
        price: item.price,
        quantity: item.quantity,
      }));

      const response = await applyCoupon(
        couponCode,
        items,
        subtotal,
        shippingFee,
        tax,
        "cod" // hoặc paymentMethod nếu có
      );

      if (response && response.total) {
        setAppliedCoupon(couponCode);
        setCouponCode("");
        setError("");
      } else {
        setError("Mã không hợp lệ hoặc đã hết hạn.");
        setAppliedCoupon(null);
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setError("Đã xảy ra lỗi khi áp dụng mã.");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setError('');
  };

  const handlePlaceOrder = async () => {
    try {
      const { name, phone, email } = userInfo;

      // Kiểm tra thiếu thông tin
      if (!name || !phone || !specificAddress || !selectedProvince || !selectedDistrict || !email) {
        toast.error("Vui lòng điền đầy đủ thông tin giao hàng.");
        return;
      }

      // Tìm thông tin tỉnh và quận từ danh sách đã fetch
      const province = provinces.find(p => String(p.province_id) === String(selectedProvince));
      const district = districts.find(d => String(d.district_id) === String(selectedDistrict));

      if (!province || !district) {
        toast.error("Không tìm thấy thông tin tỉnh hoặc quận.");
        return;
      }

      // Gộp địa chỉ đầy đủ
      const address = `${specificAddress}, ${district.district_name}, ${province.province_name}`;

      // Map sản phẩm trong giỏ hàng thành OrderItem
      const items: OrderItem[] = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
      }));

      await placeOrder(
        items,
        name,
        phone,
        address,
        email,
        paymentMethod,
        appliedCoupon,
        note,
        subtotal,
        shippingFee,
        tax,
        discount,
        total
      );

      toast.success("Đặt hàng thành công!");
      setCart([]);
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Đặt hàng thất bại!");
    }
  };

  return (
    <>
      <section className="bread-crumb">
        <div className="container">
          <ul className="breadcrumb">
            <li className="home">
              <Link href="/cart" title="Trang chủ"><span>Giỏ hàng</span></Link>
              <span className="mr_lr">&nbsp;<svg aria-hidden="true" focusable="false" data-prefix="fas"
                data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512" className="svg-inline--fa fa-chevron-right fa-w-10">
                <path fill="currentColor"
                  d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
                  className=""></path>
              </svg>&nbsp;</span>
            </li>
            <li><strong><span>Thanh toán</span></strong></li>
          </ul>
        </div>
      </section>

      <div className="layout-contact">
        <div className="container">
          <div className="bg-shadow">
            <div className="row">
              <div className="col-lg-7 col-12">

                <div className="form-contact">
                  <h4>
                    Thông tin giao hàng
                  </h4>
                  <div id="pagelogin">
                    <div id="contact">
                      <div className="group_contact">

                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                            <input placeholder="Họ và tên" type="text"
                              className="form-control  form-control-lg" value={userInfo.name}
                              onChange={(e) =>
                                setUserInfo({
                                  ...userInfo, name: e.target.value
                                })}
                            />
                          </div>

                          <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                            <input placeholder="Email" type="email" className="form-control form-control-lg"
                              value={userInfo.email} onChange={(e) =>
                                setUserInfo({
                                  ...userInfo, email: e.target.value
                                })}
                            />
                          </div>

                          <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                            <input type="text" placeholder="Điện thoại" name="contact[phone]"
                              className="form-control form-control-lg" value={userInfo.phone}
                              onChange={(e) =>
                                setUserInfo({
                                  ...userInfo, phone: e.target.value
                                })} />
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-5">
                            <select className="form-control form-control-lg" value={selectedProvince}
                              onChange={(e) => setSelectedProvince(e.target.value)}>
                              <option value="">Chọn tỉnh/thành</option>
                              {provinces.map((prov) => (
                                <option key={prov.province_id} value={prov.province_id}>
                                  {prov.province_name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                            <select className="form-control form-control-lg" value={selectedDistrict}
                              onChange={(e) => setSelectedDistrict(e.target.value)}
                            >
                              <option value="">Chọn quận/huyện</option>
                              {districts.map((dist) => (
                                <option key={dist.district_id} value={dist.district_id}>
                                  {dist.district_name}
                                </option>
                                ))}
                            </select>
                          </div>

                          <div className="col-lg-12 col-md-6 col-sm-12 col-12">
                            <input placeholder="Số địa chỉ nhà" type="text"
                              className="form-control form-control-lg" value={specificAddress}
                              onChange={(e) => setSpecificAddress(e.target.value)}
                            />
                          </div>

                          <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                            <p>Phương thức thanh toán</p>
                            <div className="d-flex flex-column">

                              {payMethods.map((method) => (
                                <div key={method.id}
                                  className="col-lg-12 col-md-12 col-sm-12 col-12 mb-3 d-flex align-items-center">
                                  <label className="form-check-label d-flex align-items-center ms-2 w-100"
                                    htmlFor={method.id} style={{
                                      cursor: "pointer",
                                      justifyContent: "space-between"
                                    }}>
                                    <span className="d-flex align-items-center">
                                      {method.icon}
                                      {method.label}
                                    </span>
                                    <input className="form-check-input ms-2" type="radio" name="paymentMethod"
                                      id={method.id} value={method.value}
                                      checked={paymentMethod === method.value} onChange={() =>
                                        setPaymentMethod(method.value)}
                                      style={{ margin: "15px 20px" }}
                                    />
                                    </label>
                                  </div>
                                ))}


                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                            <p>Ghi chú đơn hàng</p>
                            <textarea placeholder="Nhập ghi chú của bạn ở đây..." name="contact[body]"
                              id="comment" className="form-control content-area form-control-lg" rows={5}
                              value={note} onChange={(e) => setNote(e.target.value)} ></textarea>
                            <button type="submit" className="btn btn-primary " onClick={handlePlaceOrder}>
                              Đặt Hàng
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5 col-12">
                <div className="coorder12 col-12">
                  <div className="order-summary">
                    <h4 style={{ marginBottom: "1rem" }}>Tổng đơn hàng (
                      {cart.length} sản phẩm )</h4>
                    <ul className="order-list" role="list">
                      {cart.map((item) => (
                        <li className="order-item" role="listitem" key={item.id}>
                          <img src={item.image} alt={item.name} width="70" height="70" loading="lazy" />
                          <div className="order-item-info">
                            <span className="product__description__name">{item.name}</span>
                            <p className="order-item-details">
                              {Number(item.price).toLocaleString()}đ <span style={{ color: 'red' }}>
                                x{item.quantity}</span></p>
                          </div>
                          <div className="order-item-price">{Number(item.price *
                            item.quantity).toLocaleString()}đ</div>
                        </li>
                      ))}
                    </ul>

                    <form onSubmit={handleApplyCoupon} style={{ marginTop: "2rem", display: "flex" }}>
                      <input id="discountCode" type="text" placeholder="Nhập mã giảm giá..."
                        value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                      <button type="submit" className="btn-cart btn-views add_to_cart btn btn-primary">Áp
                        dụng</button>
                    </form>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {/* Hiển thị mã đã áp dụng nếu có */}

                    {appliedCoupon && (
                      <div className="row">
                        <div className="field">
                          <div className="discount-code">
                            <div className="ui-tag">
                              <span className="ui-tag__label">
                                <span className="discount-tag">
                                  <span className="discount-icon"><i className="fa fa-tag"></i></span>
                                  <span className="discount-tag__name">{appliedCoupon}</span>
                                </span>
                              </span>
                              <button type="button" className="ui-tag__close" onClick={handleRemoveCoupon}>
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="summary-row">
                      <span>Tạm tính</span>
                      <span>{subtotal.toLocaleString()} VND</span>
                    </div>
                    <div className="summary-row">
                      <span>Phí giao hàng</span>
                      <span>{shippingFee} VND</span>
                    </div>
                    <div className="summary-row">
                      <span>Thuế</span>
                      <span>{tax.toLocaleString()} VND</span>
                    </div>
                    <div className="summary-row">
                      <span>Giảm giá</span>
                      <span>-{discount.toLocaleString()} VND</span>
                    </div>
                    <div className="summary-row total">
                      <span>Tổng cộng</span>
                      <span className="font-weight-bold">{total.toLocaleString()}
                        VND</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}