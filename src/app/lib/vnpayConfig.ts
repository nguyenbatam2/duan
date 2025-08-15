// Cấu hình VNPay
export const VNPAY_CONFIG = {
  // Sandbox environment
  SANDBOX: {
    TMN_CODE: process.env.NEXT_PUBLIC_VNPAY_TMN_CODE || '6G13XPVC',
    HASH_SECRET: process.env.NEXT_PUBLIC_VNPAY_HASH_SECRET || '9V6K3BODZWC44VEQZYQ2QSPUE4MIQ9UV',
    URL: process.env.NEXT_PUBLIC_VNPAY_PAYMENT_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    QUERY_URL: process.env.NEXT_PUBLIC_VNPAY_QUERY_URL || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
    REFUND_URL: process.env.NEXT_PUBLIC_VNPAY_REFUND_URL || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
    RETURN_URL: process.env.NEXT_PUBLIC_PAYMENT_RETURN_URL || 'http://localhost:3000/payment/return',
    IPN_URL: process.env.NEXT_PUBLIC_VNPAY_IPN_URL || 'http://localhost:3000/api/vnpay-ipn',
  },
  
  // Production environment
  PRODUCTION: {
    TMN_CODE: process.env.NEXT_PUBLIC_VNPAY_TMN_CODE || '',
    HASH_SECRET: process.env.NEXT_PUBLIC_VNPAY_HASH_SECRET || '',
    URL: 'https://pay.vnpay.vn/vpcpay.html',
    RETURN_URL: process.env.NEXT_PUBLIC_PAYMENT_RETURN_URL || '',
    IPN_URL: process.env.NEXT_PUBLIC_VNPAY_IPN_URL || '',
  }
};

// Các tham số bắt buộc cho VNPay
export const VNPAY_REQUIRED_PARAMS = {
  vnp_Version: '2.1.0',
  vnp_Command: 'pay',
  vnp_TmnCode: VNPAY_CONFIG.SANDBOX.TMN_CODE,
  vnp_CurrCode: 'VND',
  vnp_Locale: 'vn',
  vnp_ReturnUrl: VNPAY_CONFIG.SANDBOX.RETURN_URL,
  vnp_IpnUrl: VNPAY_CONFIG.SANDBOX.IPN_URL,
};

// Kiểm tra cấu hình VNPay
export const validateVNPayConfig = () => {
  const config = VNPAY_CONFIG.SANDBOX;
  const errors = [];
  
  if (!config.TMN_CODE) errors.push('TMN_CODE is missing');
  if (!config.HASH_SECRET) errors.push('HASH_SECRET is missing');
  if (!config.RETURN_URL) errors.push('RETURN_URL is missing');
  if (!config.IPN_URL) errors.push('IPN_URL is missing');
  
  return {
    isValid: errors.length === 0,
    errors,
    config
  };
};

// Log cấu hình để debug
export const logVNPayConfig = () => {
  const validation = validateVNPayConfig();
  console.log('🔧 VNPay Configuration:', {
    isValid: validation.isValid,
    errors: validation.errors,
    config: {
      TMN_CODE: validation.config.TMN_CODE ? '***' + validation.config.TMN_CODE.slice(-4) : 'MISSING',
      HASH_SECRET: validation.config.HASH_SECRET ? '***' + validation.config.HASH_SECRET.slice(-4) : 'MISSING',
      URL: validation.config.URL,
      QUERY_URL: validation.config.QUERY_URL,
      REFUND_URL: validation.config.REFUND_URL,
      RETURN_URL: validation.config.RETURN_URL,
      IPN_URL: validation.config.IPN_URL,
    },
    envVars: {
      TMN_CODE: process.env.NEXT_PUBLIC_VNPAY_TMN_CODE || 'NOT_SET',
      HASH_SECRET: process.env.NEXT_PUBLIC_VNPAY_HASH_SECRET ? 'SET' : 'NOT_SET',
      PAYMENT_URL: process.env.NEXT_PUBLIC_VNPAY_PAYMENT_URL || 'NOT_SET',
      QUERY_URL: process.env.NEXT_PUBLIC_VNPAY_QUERY_URL || 'NOT_SET',
      REFUND_URL: process.env.NEXT_PUBLIC_VNPAY_REFUND_URL || 'NOT_SET',
    },
    // Thêm warning về TMN_CODE mismatch
    warning: process.env.NEXT_PUBLIC_VNPAY_TMN_CODE !== '6G13XPVC' ? 
      '⚠️ TMN_CODE mismatch! Expected: 6G13XPVC, Got: ' + (process.env.NEXT_PUBLIC_VNPAY_TMN_CODE || 'NOT_SET') : 
      '✅ TMN_CODE matches expected value'
  });
  
  return validation;
};
