'use client';

interface PaymentErrorProps {
  error: string;
  onRetry: () => void;
  onCancel: () => void;
}

export default function PaymentError({ error, onRetry, onCancel }: PaymentErrorProps) {
  const getErrorMessage = (errorCode: string) => {
    const errorMessages: { [key: string]: string } = {
      '99': 'Giao dịch thất bại trong quá trình xử lý',
      '01': 'Giao dịch chưa hoàn tất',
      '02': 'Giao dịch bị lỗi',
      '04': 'Giao dịch đảo (Khách hàng đã bị trừ tiền nhưng GD chưa thành công)',
      '05': 'VNPAY đang xử lý',
      '06': 'VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng',
      '07': 'Giao dịch bị nghi ngờ gian lận',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản bị khóa'
    };
    
    return errorMessages[errorCode] || 'Lỗi không xác định';
  };

  return (
    <div className="payment-error">
      <div className="error-icon">❌</div>
      <h3>Thanh toán thất bại</h3>
      <p>{getErrorMessage(error)}</p>
      
      <div className="error-actions">
        <button onClick={onRetry} className="btn btn-primary">
          Thử lại
        </button>
        <button onClick={onCancel} className="btn btn-secondary">
          Hủy bỏ
        </button>
      </div>
    </div>
  );
}
