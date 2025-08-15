'use client';

interface PaymentMethodSelectorProps {
  selected: string;
  onSelect: (method: string) => void;
}

export default function PaymentMethodSelector({ selected, onSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="payment-methods">
      <h3>Chọn phương thức thanh toán</h3>
      
      <div className="payment-option" onClick={() => onSelect('cod')}>
        <div className="option-content">
          <span className="icon">💰</span>
          <div>
            <h4>Thanh toán khi nhận hàng (COD)</h4>
            <input 
              type="radio" 
              name="payment" 
              value="cod" 
              checked={selected === 'cod'}
              onChange={() => onSelect('cod')}
            />
            <p>Thanh toán bằng tiền mặt khi nhận hàng</p>
          </div>
        </div>
      </div>
      
      <div className="payment-option" onClick={() => onSelect('online_payment')}>
        <div className="option-content">
          <span className="icon">💳</span>
          <div>
            <h4>Thanh toán online (VNPay)</h4>
            <input 
              type="radio" 
              name="payment" 
              value="online_payment" 
              checked={selected === 'online_payment'}
              onChange={() => onSelect('online_payment')}
            />
            <p>Thanh toán qua thẻ ATM, thẻ quốc tế, ví điện tử</p>
          </div>
        </div>
      </div>
    </div>
  );
}
