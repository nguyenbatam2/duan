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
        
        // Lấy tất cả query parameters từ URL
        const queryString = window.location.search;
        
        // Log VNPay return parameters
        console.log('🔍 VNPay Return Parameters:', {
          url: window.location.href,
          queryString: queryString,
          searchParams: Object.fromEntries(new URLSearchParams(queryString))
        });
        
        console.log('📡 Calling VNPay return API:', `${API_BASE_URL}/vnpay-return${queryString}`);
        
        // Gọi API để verify payment
        const response = await fetch(`${API_BASE_URL}/vnpay-return${queryString}`);
        
        // Log response details
        console.log('📥 VNPay Return Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        const result = await response.json();
        console.log('📋 VNPay Return Result:', result);
        
        setPaymentResult(result);
        
        if (result.success) {
          // Thanh toán thành công
          console.log('✅ Payment successful:', result.data);
          toast.success('Thanh toán thành công!');
          
          // Redirect đến trang order detail sau 3 giây
          setTimeout(() => {
            router.push(`/account/order?order_id=${result.data.order_id}`);
          }, 3000);
        } else {
          // Thanh toán thất bại
          console.error('❌ Payment failed:', result.data);
          toast.error(result.data?.error_message || 'Thanh toán thất bại');
          
          // Redirect về trang checkout sau 3 giây
          setTimeout(() => {
            router.push('/checkout');
          }, 3000);
        }
      } catch (error: any) {
        console.error('💥 Payment return error:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        toast.error('Lỗi xử lý thanh toán');
        
        // Redirect về trang checkout sau 3 giây
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        {paymentResult?.success ? (
          // Thanh toán thành công
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-4">
              Đơn hàng của bạn đã được thanh toán thành công.
            </p>
            
            {paymentResult.data && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Thông tin thanh toán:</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Mã đơn hàng:</span> {paymentResult.data.order_id}</p>
                  <p><span className="font-medium">Mã giao dịch:</span> {paymentResult.data.transaction_id}</p>
                  <p><span className="font-medium">Số tiền:</span> {paymentResult.data.amount?.toLocaleString()} VNĐ</p>
                  <p><span className="font-medium">Ngân hàng:</span> {paymentResult.data.bank_code}</p>
                  <p><span className="font-medium">Thời gian:</span> {paymentResult.data.payment_time}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Link 
                href={`/account/order?order_id=${paymentResult.data?.order_id}`}
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Xem chi tiết đơn hàng
              </Link>
              <Link 
                href="/"
                className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        ) : (
          // Thanh toán thất bại
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h2>
            <p className="text-gray-600 mb-4">
              {paymentResult?.data?.error_message || 'Có lỗi xảy ra trong quá trình thanh toán.'}
            </p>
            
            {paymentResult?.data && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Thông tin lỗi:</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Mã đơn hàng:</span> {paymentResult.data.order_id}</p>
                  <p><span className="font-medium">Mã lỗi:</span> {paymentResult.data.error_code}</p>
                  <p><span className="font-medium">Mô tả:</span> {paymentResult.data.error_message}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Link 
                href="/checkout"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Thử lại thanh toán
              </Link>
              <Link 
                href="/"
                className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return <PaymentReturnContent />;
}
