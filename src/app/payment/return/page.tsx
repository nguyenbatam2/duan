'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../lib/config';
import '../../styles/payment.css';

function PaymentReturnContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  useEffect(() => {
    const handlePaymentReturn = async () => {
      try {
        setLoading(true);
        const queryString = window.location.search;
        
        console.log('🔄 Processing VNPay return:', queryString);
        
        // Gọi API vnpay-return theo VNPAY_PAYMENT_FLOW.md
        const response = await fetch(`${API_BASE_URL}/vnpay-return${queryString}`);
        const result = await response.json();
        
        console.log('📋 VNPay return result:', result);
        setPaymentResult(result);
        
        if (result.success) {
          toast.success('Thanh toán thành công!');
          // Redirect đến trang order detail theo VNPAY_PAYMENT_FLOW.md
          setTimeout(() => {
            router.push(`/account/order?order_id=${result.data.order_id}`);
          }, 3000);
        } else {
          toast.error(result.data?.error_message || 'Thanh toán thất bại');
          setTimeout(() => {
            router.push('/checkout');
          }, 3000);
        }
      } catch (error: any) {
        console.error('❌ Payment return error:', error);
        toast.error('Lỗi xử lý thanh toán');
        setTimeout(() => {
          router.push('/checkout');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };
    
    handlePaymentReturn();
  }, [router]);

  if (loading) {
    return (
      <div className="payment-return-container">
        <div className="payment-loading">
          <div className="spinner"></div>
          <h2>Đang xử lý thanh toán...</h2>
          <p>Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-return-container">
      <div className="payment-result">
        {paymentResult?.success ? (
          <>
            <div className="success-icon">✅</div>
            <h2>Thanh toán thành công!</h2>
            <div className="payment-details">
              <p><strong>Mã đơn hàng:</strong> {paymentResult.data?.order_id}</p>
              <p><strong>Mã giao dịch:</strong> {paymentResult.data?.transaction_id}</p>
              <p><strong>Số tiền:</strong> {paymentResult.data?.amount?.toLocaleString()} VND</p>
              <p><strong>Ngân hàng:</strong> {paymentResult.data?.bank_code}</p>
              <p><strong>Thời gian:</strong> {paymentResult.data?.payment_time}</p>
            </div>
            <div className="payment-actions">
              <Link href="/account/order" className="btn btn-primary">
                Xem đơn hàng
              </Link>
              <Link href="/" className="btn btn-secondary">
                Về trang chủ
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="error-icon">❌</div>
            <h2>Thanh toán thất bại</h2>
            <div className="payment-details">
              <p><strong>Lỗi:</strong> {paymentResult?.data?.error_message || 'Không xác định'}</p>
              <p><strong>Mã lỗi:</strong> {paymentResult?.data?.error_code || 'N/A'}</p>
            </div>
            <div className="payment-actions">
              <Link href="/checkout" className="btn btn-primary">
                Thử lại
              </Link>
              <Link href="/" className="btn btn-secondary">
                Về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return <PaymentReturnContent />;
}
