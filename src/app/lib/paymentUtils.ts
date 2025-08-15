// Payment Error Handling Utilities

export interface PaymentError {
  code: string;
  message: string;
  details?: any;
}

export const handlePaymentError = (error: PaymentError): string => {
  switch (error.code) {
    case 'INSUFFICIENT_STOCK':
      return 'Sản phẩm không đủ số lượng trong kho';
    
    case 'INVALID_COUPON':
      return 'Mã giảm giá không hợp lệ hoặc đã hết hạn';
    
    case 'PAYMENT_FAILED':
      return 'Thanh toán thất bại. Vui lòng thử lại';
    
    case 'ORDER_NOT_FOUND':
      return 'Không tìm thấy đơn hàng';
    
    case 'PAYMENT_ALREADY_PROCESSED':
      return 'Đơn hàng đã được thanh toán';
    
    case 'INVALID_PAYMENT_METHOD':
      return 'Phương thức thanh toán không hợp lệ';
    
    case 'AMOUNT_MISMATCH':
      return 'Số tiền thanh toán không khớp với đơn hàng';
    
    case 'VNPAY_ERROR':
      return error.details?.message || 'Lỗi từ cổng thanh toán VNPay';
    
    case 'NETWORK_ERROR':
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra lại';
    
    case 'TIMEOUT_ERROR':
      return 'Hết thời gian xử lý. Vui lòng thử lại';
    
    default:
      return 'Có lỗi xảy ra. Vui lòng thử lại sau';
  }
};

export const getPaymentStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Chờ xác nhận';
    case 'processing':
      return 'Đang xử lý thanh toán';
    case 'paid':
      return 'Đã thanh toán';
    case 'payment_failed':
      return 'Thanh toán thất bại';
    case 'confirmed':
      return 'Đã xác nhận';
    case 'shipped':
      return 'Đã gửi hàng';
    case 'delivered':
      return 'Đã giao hàng';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return 'Không xác định';
  }
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'processing':
      return 'text-blue-600 bg-blue-100';
    case 'paid':
      return 'text-green-600 bg-green-100';
    case 'payment_failed':
      return 'text-red-600 bg-red-100';
    case 'confirmed':
      return 'text-blue-600 bg-blue-100';
    case 'shipped':
      return 'text-purple-600 bg-purple-100';
    case 'delivered':
      return 'text-green-600 bg-green-100';
    case 'cancelled':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const validatePaymentData = (data: any): boolean => {
  const requiredFields = ['items', 'name', 'phone', 'address', 'email', 'payment_method', 'total'];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      return false;
    }
  }
  
  // Validate items
  if (!Array.isArray(data.items) || data.items.length === 0) {
    return false;
  }
  
  // Validate total amount
  if (typeof data.total !== 'number' || data.total <= 0) {
    return false;
  }
  
  return true;
};

export const getPaymentMethodInfo = (method: string) => {
  const methods = {
    cod: {
      label: 'Thanh toán khi nhận hàng',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      icon: '💵',
      color: 'green'
    },
    online_payment: {
      label: 'Thanh toán online (VNPay)',
      description: 'Thanh toán qua cổng VNPay an toàn',
      icon: '💳',
      color: 'blue'
    }
  };
  
  return methods[method as keyof typeof methods] || methods.cod;
};
