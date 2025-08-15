'use client';

interface PaymentMethodSelectorProps {
  selected: string;
  onSelect: (method: string) => void;
}
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


// <div className="col-lg-12 col-md-12 col-sm-12 col-12">
//   <p>Phương thức thanh toán</p>
//   <div className="d-flex flex-column">

//     {payMethods.map((method) => (
//       <div key={method.id}
//         className="col-lg-12 col-md-12 col-sm-12 col-12 mb-3 d-flex align-items-center">
//         <label className="form-check-label d-flex align-items-center ms-2 w-100"
//           htmlFor={method.id} style={{
//             cursor: "pointer",
//             justifyContent: "space-between"
//           }}>
//           <span className="d-flex align-items-center">
//             {method.icon}
//             {method.label}
//           </span>
//           <input className="form-check-input ms-2" type="radio" name="paymentMethod"
//             id={method.id} value={method.value}
//             checked={paymentMethod === method.value} onChange={() =>
//               setPaymentMethod(method.value)}
//             style={{ margin: "15px 20px" }}
//           />
//         </label>
//       </div>
//     ))}


//   </div>
// </div>


export default function PaymentMethodSelector({ selected, onSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="payment-methods">
      <p>Chọn phương thức thanh toán</p>
      
      <div className="payment-option" onClick={() => onSelect('cod')}>
        <div className="option-content">
          <span className="icon">💰</span>
          <div>
            <p>Thanh toán khi nhận hàng (COD)</p>
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
            <p>Thanh toán online (VNPay)</p>
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
