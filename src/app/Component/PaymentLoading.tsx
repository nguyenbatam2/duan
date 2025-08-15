'use client';

export default function PaymentLoading() {
  return (
    <div className="payment-loading">
      <div className="spinner"></div>
      <h3>Đang chuyển hướng đến VNPay...</h3>
      <p>Vui lòng không đóng trình duyệt</p>
    </div>
  );
}
