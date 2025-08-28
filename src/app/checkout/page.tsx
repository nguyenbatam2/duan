"use client";

export const dynamic = "force-dynamic";
import "../styles/checkout.css";
import "../styles/payment.css";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { getCart, clearCart } from "../lib/addCart";
import { applyCoupon, placeOrder } from "../lib/orderApi";
import { getUserAddresses } from "../lib/authorApi";
import { OrderItem, Product } from "../types/product";
import { useRouter } from "next/navigation";
import { UserAddress } from "@/app/types/author";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import PaymentMethodSelector from "../Component/PaymentMethodSelector";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State management
  const [cart, setCart] = useState<Product[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponResp, setCouponResp] = useState<any | null>(null); // response from applyCoupon
  const [error, setError] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User info state
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });
  const [note, setNote] = useState("");

  // Calculate order totals (use couponResp when available)
  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0);
  const shippingFee = 30000;
  const tax = 5000;
  // couponResp returned values (from backend) use server-calculated discounts when available
  const discount = couponResp ? Number(couponResp.total_discount ?? 0) : 0;
  const total = couponResp
    ? Number(couponResp.total ?? subtotal + shippingFee + tax - discount)
    : subtotal + shippingFee + tax - discount;

  // Load provinces on mount
  useEffect(() => {
    fetch("https://vapi.vnappmob.com/api/v2/province/")
      .then((res) => res.json())
      .then((data) => setProvinces(data.results))
      .catch((err) => console.error("Load provinces error:", err));
  }, []);

  // Load districts when province changes
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

  // Load user data and addresses
  useEffect(() => {
    getUserAddresses()
      .then((data) => {
        if (Array.isArray(data)) setAddresses(data);
      })
      .catch((err) => {
        // not critical
        console.error("getUserAddresses error:", err);
      });

    const cookieData = Cookies.get("author");
    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        const user = parsed.user;
        if (user) {
          setUserInfo({
            name: user.name || "",
            phone: user.phone || "",
            address: user.address || "",
            email: user.email || "",
          });
        }
      } catch (err) {
        console.error("Lỗi khi parse cookie:", err);
      }
    }
  }, []);

  // Load cart data
  useEffect(() => {
    const fetchCart = async () => {
      const cartData = await getCart();
      setCart(cartData);
    };
    fetchCart();
  }, []);

  // Auto-fill coupon code from URL
  useEffect(() => {
    const code = searchParams.get("coupon_code");
    if (code) {
      setCouponCode(code);
      console.log("Mã giảm giá đã được điền sẵn:", code);
    }
  }, [searchParams]);

  // Apply coupon function
  const handleApplyCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setError("Vui lòng nhập mã giảm giá");
      return;
    }
    if (cart.length === 0) {
      setError("Giỏ hàng trống!");
      return;
    }

    try {
      setError("");
      const items = cart.map((item) => ({
        product_id: item.id,
        price: item.price,
        quantity: item.quantity,
      }));

      // call applyCoupon API (server returns discount + total calculation)
      const response = await applyCoupon(couponCode, items, subtotal, shippingFee, tax, paymentMethod);

      // response expected: product_discount, shipping_discount, total_discount, final_shipping_fee, total, coupon_id, ...
      if (response && (response.total !== undefined || response.total_discount !== undefined)) {
        setCouponResp(response);
        setAppliedCoupon(couponCode);
        setCouponCode("");
        setError("");
        toast.success("Áp mã thành công");
      } else {
        setCouponResp(null);
        setAppliedCoupon(null);
        setError("Mã không hợp lệ hoặc đã hết hạn.");
      }
    } catch (err: any) {
      console.error("Lỗi applyCoupon:", err?.response?.data ?? err?.message ?? err);
      setCouponResp(null);
      setAppliedCoupon(null);
      setError("Đã xảy ra lỗi khi áp dụng mã.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponResp(null);
    setError("");
  };

  // Place order function
  const handlePlaceOrder = async () => {
    try {
      setIsSubmitting(true);

      // basic client-side validation
      const { name, phone, email } = userInfo;
      if (!name || !phone || !specificAddress || !selectedProvince || !selectedDistrict || !email) {
        toast.error("Vui lòng điền đầy đủ thông tin giao hàng.");
        return;
      }

      if (cart.length === 0) {
        toast.error("Giỏ hàng trống!");
        return;
      }

      const province = provinces.find((p) => String(p.province_id) === String(selectedProvince));
      const district = districts.find((d) => String(d.district_id) === String(selectedDistrict));

      if (!province || !district) {
        toast.error("Không tìm thấy thông tin tỉnh hoặc quận.");
        return;
      }

      const address = `${specificAddress}, ${district.district_name}, ${province.province_name}`;

      const items: OrderItem[] = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        product_name: item.name, // keep product_name to avoid SQL errors if backend expects it
      }));

      // Use server-calculated discount/total when available; otherwise calculate locally
      const discountToSend = couponResp ? Number(couponResp.total_discount ?? 0) : 0;
      const totalToSend = couponResp
        ? Number(couponResp.total ?? subtotal + shippingFee + tax - discountToSend)
        : subtotal + shippingFee + tax - discountToSend;

      // Add coupon info to notes instead of sending coupon_code (workaround for backend schema mismatch)
      const noteWithCoupon = note + (appliedCoupon ? `\n[AppliedCoupon:${appliedCoupon}]` : "");

      // Do not send coupon_code to placeOrder to avoid backend error caused by coupon lookup
      const result = await placeOrder(
        items,
        userInfo.name,
        userInfo.phone,
        address,
        userInfo.email,
        paymentMethod,
        null, // intentionally not sending coupon_code (backend has schema mismatch that causes 500)
        noteWithCoupon,
        subtotal,
        shippingFee,
        tax,
        discountToSend,
        totalToSend
      );

      // handle response
      if (paymentMethod === "online_payment") {
        clearCart();
        setCart([]);
        toast.success("Đang chuyển hướng đến trang thanh toán...");
        // placeOrder might return a redirect url in result.data.checkout_url — handled by placeOrder or you can handle here
      } else {
        toast.success("Đặt hàng thành công!");
        clearCart();
        setCart([]);
        router.push("/");
      }

      console.log("Place order result:", result?.data ?? result);
    } catch (error: any) {
      const resp = error?.response?.data;
      console.error("Place order error:", resp ?? error?.message ?? error);

      if (error?.response?.status === 422) {
        if (resp?.errors && typeof resp.errors === "object") {
          const fieldErrors = Object.entries(resp.errors).map(([field, msgs]) => {
            const msgText = Array.isArray(msgs) ? msgs.join(", ") : String(msgs);
            return `${field}: ${msgText}`;
          });
          console.warn("Validation errors from backend:", fieldErrors);
          toast.error(fieldErrors.join(". "));
          return;
        }

        if (typeof resp?.message === "string") {
          const msg = resp.message;
          if (msg.includes("không đủ số lượng") || msg.includes("chỉ còn")) {
            toast.error("Sản phẩm không đủ số lượng trong kho. Vui lòng kiểm tra lại giỏ hàng!");
            return;
          }
          toast.error(msg);
          return;
        }
      }

      // Fallback
      toast.error("Đặt hàng thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="bread-crumb">
        <div className="container">
          <ul className="breadcrumb">
            <li className="home">
              <Link href="/cart" title="Trang chủ">
                <span>Giỏ hàng</span>
              </Link>
              <span className="mr_lr">
                &nbsp;
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="chevron-right"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  className="svg-inline--fa fa-chevron-right fa-w-10"
                >
                  <path
                    fill="currentColor"
                    d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
                    className=""
                  ></path>
                </svg>
                &nbsp;
              </span>
            </li>
            <li>
              <strong>
                <span>Thanh toán</span>
              </strong>
            </li>
          </ul>
        </div>
      </section>

      <div className="layout-contact">
        <div className="container">
          <div className="bg-shadow">
            <div className="row">
              <div className="col-lg-7 col-12">
                <div className="form-contact">
                  <h4>Thông tin giao hàng</h4>
                  <div id="pagelogin">
                    <div id="contact">
                      <div className="group_contact">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                            <input
                              placeholder="Họ và tên"
                              type="text"
                              className="form-control form-control-lg"
                              value={userInfo.name}
                              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                              required
                            />
                          </div>

                          <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                            <input
                              placeholder="Email"
                              type="email"
                              className="form-control form-control-lg"
                              value={userInfo.email}
                              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                              required
                            />
                          </div>

                          <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                            <input
                              type="text"
                              placeholder="Điện thoại"
                              className="form-control form-control-lg"
                              value={userInfo.phone}
                              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                              required
                            />
                          </div>

                          <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-5">
                            <select
                              className="form-control form-control-lg"
                              value={selectedProvince}
                              onChange={(e) => setSelectedProvince(e.target.value)}
                              required
                            >
                              <option value="">Chọn tỉnh/thành</option>
                              {provinces.map((prov) => (
                                <option key={prov.province_id} value={prov.province_id}>
                                  {prov.province_name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                            <select
                              className="form-control form-control-lg"
                              value={selectedDistrict}
                              onChange={(e) => setSelectedDistrict(e.target.value)}
                              required
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
                            <input
                              placeholder="Số địa chỉ nhà"
                              type="text"
                              className="form-control form-control-lg"
                              value={specificAddress}
                              onChange={(e) => setSpecificAddress(e.target.value)}
                              required
                            />
                          </div>

                          <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                            <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
                          </div>

                          <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                            <p>Ghi chú đơn hàng</p>
                            <textarea
                              placeholder="Nhập ghi chú của bạn ở đây..."
                              className="form-control content-area form-control-lg"
                              rows={5}
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                            />
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handlePlaceOrder}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Đang xử lý..." : "Đặt Hàng"}
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
                    <h4 style={{ marginBottom: "1rem" }}>Tổng đơn hàng ({cart.length} sản phẩm)</h4>

                    <ul className="order-list" role="list">
                      {cart.map((item) => (
                        <li className="order-item" role="listitem" key={item.id}>
                          <img src={item.image} alt={item.name} width="70" height="70" loading="lazy" />
                          <div className="order-item-info">
                            <span className="product__description__name">{item.name}</span>
                            <p className="order-item-details">
                              {Number(item.base_price).toLocaleString()}đ{" "}
                              <span style={{ color: "red" }}>x{item.quantity}</span>
                            </p>
                          </div>
                          <div className="order-item-price">
                            {Number(item.base_price * item.quantity).toLocaleString()}đ
                          </div>
                        </li>
                      ))}
                    </ul>

                    <form onSubmit={handleApplyCoupon} style={{ marginTop: "2rem", display: "flex", gap: 8 }}>
                      <input
                        id="discountCode"
                        type="text"
                        placeholder="Nhập mã giảm giá..."
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button type="submit" className="btn-cart btn-views add_to_cart btn btn-primary">
                        Áp dụng
                      </button>
                    </form>

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {appliedCoupon && (
                      <div className="row" style={{ marginTop: 12 }}>
                        <div className="field">
                          <div className="discount-code">
                            <div className="ui-tag">
                              <span className="ui-tag__label">
                                <span className="discount-tag">
                                  <span className="discount-icon">
                                    <i className="fa fa-tag"></i>
                                  </span>
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
                      <span>{shippingFee.toLocaleString()} VND</span>
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
                      <span className="font-weight-bold">{total.toLocaleString()} VND</span>
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
