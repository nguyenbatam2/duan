'use client';

import { Product } from '../types/product';

interface OrderSummaryProps {
  items: Product[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
}

const OrderSummary = ({ items, subtotal, shipping, tax, discount, total, paymentMethod }: OrderSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Thanh toán khi nhận hàng';
      case 'online_payment':
        return 'Thanh toán online (VNPay)';
      default:
        return 'Chưa chọn';
    }
  };

  return (
    <div className="order-summary bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h3>
      
      {/* Danh sách sản phẩm */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Sản phẩm ({items.length})</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatCurrency(Number(item.price) * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chi tiết giá */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Tạm tính:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Phí vận chuyển:</span>
          <span>{formatCurrency(shipping)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Thuế:</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Giảm giá:</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        
        <div className="border-t pt-2 flex justify-between text-lg font-semibold">
          <span>Tổng cộng:</span>
          <span className="text-blue-600">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Thông tin thanh toán */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Phương thức thanh toán</h4>
        <p className="text-sm text-gray-600">{getPaymentMethodLabel(paymentMethod)}</p>
        
        {paymentMethod === 'online_payment' && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
            <p>• Bạn sẽ được chuyển hướng đến trang thanh toán VNPay</p>
            <p>• Thanh toán an toàn với SSL encryption</p>
            <p>• Hỗ trợ thẻ ATM, thẻ quốc tế, QR Code</p>
          </div>
        )}
        
        {paymentMethod === 'cod' && (
          <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
            <p>• Thanh toán bằng tiền mặt khi nhận hàng</p>
            <p>• Kiểm tra hàng trước khi thanh toán</p>
          </div>
        )}
        

      </div>
    </div>
  );
};

export default OrderSummary;
