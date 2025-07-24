'use client';
import styled from 'styled-components';

import { useEffect, useState } from 'react';
import '../styles/checkout.css';
import { getCart } from '../lib/addCart';
import { applyCoupon, placeOrder, OrderItem } from '../lib/orderApi';
import { Product } from '../types/product';
import { useRouter } from 'next/navigation';
import { getUserAddresses, UserAddress } from '../lib/authorApi';
import Cookies from 'js-cookie';

function formatCurrency(value: number | null): string {
    if (typeof value !== 'number' || isNaN(value)) return '...';
    return `${value.toLocaleString('en-US')} VND`;
}
const Container = styled.div`
display: flex;
gap: 2rem;
padding: 2rem;
max-width: 1200px;
margin: auto;
`;

const Left = styled.section`
flex: 1;
background-color: #f9f9f9;
padding: 2rem;
border-radius: 8px;
box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;
const Right = styled.section`
flex: 1;
background-color: #fff;
padding: 2rem;
border-radius: 8px;
box-shadow: 0 2px 6px rgba(0, 0,
    0, 0.05);
    `;
// Thêm type cho kết quả applyCoupon
interface CouponResult {
  product_discount?: string;
  total?: string;
}

// Thêm type cho error đặt hàng
interface PlaceOrderError {
  response?: { data?: unknown };
}

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [finalTotal, setFinalTotal] = useState<number | null>(null);
    const [note, setNote] = useState('');
    const router = useRouter();

    const shippingFee = 30000;
    const tax = 5000;

    useEffect(() => {
        const cart = getCart();
        setCartItems(cart);
        const sub = cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
        setSubtotal(sub);
        setFinalTotal(sub + shippingFee + tax);
    }, []);

    const [userInfo, setUserInfo] = useState({
        name: '',
        phone: '',
        address: '',
        email: '',
    });
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    // Lấy danh sách địa chỉ khi load trang
    useEffect(() => {
      getUserAddresses().then(setAddresses);
      // Lấy email từ cookie user
      const cookieData = Cookies.get('author');
      if (cookieData) {
        try {
          const parsed = JSON.parse(cookieData);
          if (parsed.user?.email) {
            setUserInfo(ui => ({ ...ui, email: parsed.user.email }));
          }
        } catch {}
      }
    }, []);

    // Khi chọn địa chỉ, tự động điền vào form
    useEffect(() => {
      if (selectedAddressId) {
        const addr = addresses.find(a => a.id === selectedAddressId);
        if (addr) {
          setUserInfo(ui => ({
            ...ui,
            name: addr.name,
            phone: addr.phone,
            address: addr.address,
          }));
        }
      }
      // eslint-disable-next-line
    }, [selectedAddressId]);

    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const items = cartItems.map((item) => {
                const base = {
                    product_id: item.id,
                    quantity: item.quantity,
                    price: Number(item.price),
                };
                if (item.product_type === 'variable' && item.variant_id) {
                    return { ...base, variant_id: item.variant_id };
                }
                return base;
            });

            const result = await applyCoupon(
                couponCode,
                items,
                subtotal,
                shippingFee,
                tax,
                'cod'
            ) as CouponResult;

            const productDiscount = parseFloat(result.product_discount || '0');
            const total = parseFloat(result.total || '0');

            setDiscount(productDiscount);
            setFinalTotal(total);
            alert('Áp dụng mã giảm giá thành công!');
        } catch (err: unknown) {
            console.error('Apply coupon error:', err);
            alert('Không áp dụng được mã giảm giá!');
        }
    };
    

    const handlePlaceOrder = async () => {
        const items: OrderItem[] = cartItems.map((item) => {
            const base = {
                product_id: item.id,
                quantity: item.quantity,
                price: Number(item.price),
            };
            if (item.product_type === 'variable' && item.variant_id) {
                return { ...base, variant_id: item.variant_id };
            }
            return base;
        });

        try {
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            const total = subtotal + shippingFee + tax - discount;

            const order = await placeOrder(
                items,
                userInfo.name,
                userInfo.phone,
                userInfo.address,
                userInfo.email,
                'cod',
                couponCode || null,
                note,
                subtotal,
                shippingFee,
                tax,
                discount,
                total
            );

            alert('Đặt hàng thành công!');
            console.log(order);

            localStorage.removeItem('cart');
            setCartItems([]);

            // ✅ Chuyển hướng về trang chủ
            router.push('/');

        } catch (err: unknown) {
            if (typeof err === 'object' && err && 'response' in err) {
                const errorObj = err as PlaceOrderError;
                console.error('🚨 Lỗi đặt hàng từ server:', errorObj.response?.data);
                console.error('📦 Dữ liệu gửi:', {
                    items,
                    name: userInfo.name,
                    phone: userInfo.phone,
                    address: userInfo.address,
                    email: userInfo.email,
                    payment_method: 'cod',
                    coupon_code: couponCode || null,
                    notes: note,
                    subtotal,
                    shipping_fee: shippingFee,
                    tax,
                    discount,
                    total: subtotal + shippingFee + tax - discount
                });
            } else {
                console.error('❌ Lỗi không phản hồi:', err);
            }

            alert('❌ Đặt hàng thất bại!');
        }
    };
    
    return (
        <Container>
            <Left>

                <h3>Chọn địa chỉ giao hàng</h3>
                {addresses.length === 0 && <div>Bạn chưa có địa chỉ nào.</div>}
                {addresses.map(addr => (
                  <div key={addr.id} style={{marginBottom: 8}}>
                    <label>
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                      />
                      {addr.name} - {addr.phone} - {addr.address}
                      {addr.is_default ? <span style={{color: 'green', marginLeft: 8}}>(Mặc định)</span> : null}
                    </label>
                  </div>
                ))}
                <h2>Thông tin giao hàng</h2>
                <input
                    type="text"
                    placeholder="Họ và tên"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Địa chỉ"
                    value={userInfo.address}
                    onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={userInfo.email}
                    disabled
                />

                <h2 style={{ marginTop: '2rem' }}>Ghi chú</h2>
                <textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ví dụ: Giao hàng buổi chiều"
                />


                <button className="primary btn-cart btn-views add_to_cart btn btn-primary" onClick={handlePlaceOrder}>
                    ĐẶT HÀNG 
                </button>
            </Left>

            <Right>
                <h2>Đơn hàng của bạn</h2>
                <ul className="order-list">
                    {cartItems.map((item) => (
                        <li key={`${item.id}-${item.variant_id ?? 'no-variant'}`} className="order-item">
                            <img src={item.image} alt={item.name} />
                            <div className="order-item-info">
                                <p>{item.name}</p>
                                <p>{item.quantity} x {formatCurrency(Number(item.price))}</p>
                            </div>
                            <div className="order-item-price">
                                {formatCurrency(Number(item.price) * item.quantity)}
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="summary-row"><span>Tạm tính</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="summary-row"><span>Phí giao hàng</span><span>{formatCurrency(shippingFee)}</span></div>
                <div className="summary-row"><span>Thuế</span><span>{formatCurrency(tax)}</span></div>
                <div className="summary-row"><span>Giảm giá</span><span>-{formatCurrency(discount)}</span></div>
                <div className="summary-row total"><span>Tổng cộng</span><span>{formatCurrency(finalTotal)}</span></div>
                <form onSubmit={handleApplyCoupon} style={{ marginTop: '2rem', display: "flex" }}>
                    <input
                        id="discountCode"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. SAVE10"
                    />
                    <button type="submit" className="btn-cart btn-views add_to_cart btn btn-primary">Áp dụng</button>
                </form>
            </Right>
            
        </Container>
    );
}
