// Payment Flow Testing Utilities

export interface PaymentTestData {
  orderId: string;
  amount: number;
  paymentMethod: 'cod' | 'online_payment';
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
}

export const testPaymentScenarios = {
  // Test case 1: COD payment
  codPayment: {
    orderId: 'TEST_COD_001',
    amount: 150000,
    paymentMethod: 'cod' as const,
    items: [
      { product_id: 1, quantity: 2, price: 75000 }
    ],
    customerInfo: {
      name: 'Nguyễn Văn Test',
      phone: '0123456789',
      email: 'test@example.com',
      address: '123 Test Street, District 1, HCMC'
    }
  },

  // Test case 2: VNPay payment
  vnpayPayment: {
    orderId: 'TEST_VNPAY_001',
    amount: 250000,
    paymentMethod: 'online_payment' as const,
    items: [
      { product_id: 2, quantity: 1, price: 250000 }
    ],
    customerInfo: {
      name: 'Trần Thị Test',
      phone: '0987654321',
      email: 'test2@example.com',
      address: '456 Test Avenue, District 3, HCMC'
    }
  },

  // Test case 3: Large amount payment
  largeAmountPayment: {
    orderId: 'TEST_LARGE_001',
    amount: 1500000,
    paymentMethod: 'online_payment' as const,
    items: [
      { product_id: 3, quantity: 3, price: 500000 }
    ],
    customerInfo: {
      name: 'Lê Văn Test',
      phone: '0555666777',
      email: 'test3@example.com',
      address: '789 Test Road, District 7, HCMC'
    }
  }
};

// Mock VNPay return responses
export const mockVNPayResponses = {
  success: {
    vnp_ResponseCode: '00',
    vnp_TxnRef: 'TEST_1234567890',
    vnp_Amount: '25000000', // Amount in VND (250,000 * 100)
    vnp_BankCode: 'NCB',
    vnp_PayDate: '20250101100000',
    vnp_TransactionNo: '12345678',
    vnp_OrderInfo: 'Thanh toan don hang TEST_VNPAY_001'
  },
  
  failed: {
    vnp_ResponseCode: '09',
    vnp_TxnRef: 'TEST_1234567890',
    vnp_Amount: '25000000',
    vnp_OrderInfo: 'Thanh toan don hang TEST_VNPAY_001'
  },
  
  cancelled: {
    vnp_ResponseCode: '24',
    vnp_TxnRef: 'TEST_1234567890',
    vnp_Amount: '25000000',
    vnp_OrderInfo: 'Thanh toan don hang TEST_VNPAY_001'
  }
};

// Test payment validation
export const validatePaymentData = (data: PaymentTestData): boolean => {
  const requiredFields = ['orderId', 'amount', 'paymentMethod', 'items', 'customerInfo'];
  
  for (const field of requiredFields) {
    if (!data[field as keyof PaymentTestData]) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  if (data.amount <= 0) {
    console.error('Amount must be greater than 0');
    return false;
  }
  
  if (data.items.length === 0) {
    console.error('Order must have at least one item');
    return false;
  }
  
  const { name, phone, email, address } = data.customerInfo;
  if (!name || !phone || !email || !address) {
    console.error('Customer information is incomplete');
    return false;
  }
  
  return true;
};

// Test payment flow
export const testPaymentFlow = async (testData: PaymentTestData) => {
  console.log('🧪 Testing payment flow:', testData.orderId);
  
  // Validate test data
  if (!validatePaymentData(testData)) {
    throw new Error('Invalid test data');
  }
  
  try {
    // Step 1: Place order
    console.log('📦 Step 1: Placing order...');
    const orderResponse = await placeTestOrder(testData);
    console.log('✅ Order placed:', orderResponse);
    
    // Step 2: Handle payment based on method
    if (testData.paymentMethod === 'online_payment') {
      console.log('💳 Step 2: Processing online payment...');
      const paymentResponse = await processOnlinePayment(orderResponse);
      console.log('✅ Payment processed:', paymentResponse);
      
      // Step 3: Simulate VNPay return
      console.log('🔄 Step 3: Simulating VNPay return...');
      const returnResponse = await simulateVNPayReturn(orderResponse.order_id);
      console.log('✅ VNPay return processed:', returnResponse);
    } else {
      console.log('💵 Step 2: COD payment - no further processing needed');
    }
    
    console.log('🎉 Payment flow test completed successfully!');
    return { success: true, data: orderResponse };
    
  } catch (error) {
    console.error('❌ Payment flow test failed:', error);
    return { success: false, error };
  }
};

// Mock functions for testing
const placeTestOrder = async (testData: PaymentTestData) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        order_id: testData.orderId,
        order_number: `ORD${Date.now()}`,
        status: 'pending',
        total: testData.amount,
        payment_method: testData.paymentMethod
      });
    }, 1000);
  });
};

const processOnlinePayment = async (orderResponse: any) => {
  // Simulate VNPay payment processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        payment_url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?test=1',
        transaction_ref: `TXN${Date.now()}`
      });
    }, 500);
  });
};

const simulateVNPayReturn = async (orderId: string) => {
  // Simulate VNPay return with success response
  const mockResponse = mockVNPayResponses.success;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        order_id: orderId,
        transaction_id: mockResponse.vnp_TransactionNo,
        amount: parseInt(mockResponse.vnp_Amount) / 100,
        status: 'paid'
      });
    }, 1000);
  });
};

// Run all test scenarios
export const runAllPaymentTests = async () => {
  console.log('🚀 Starting payment flow tests...\n');
  
  const testResults = [];
  
  for (const [testName, testData] of Object.entries(testPaymentScenarios)) {
    console.log(`\n📋 Running test: ${testName}`);
    const result = await testPaymentFlow(testData);
    testResults.push({ testName, result });
  }
  
  console.log('\n📊 Test Results Summary:');
  testResults.forEach(({ testName, result }) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}`);
  });
  
  return testResults;
};
