# 🔄 VNPay Payment Flow Documentation

## 📋 **Tổng quan hệ thống**

Hệ thống thanh toán VNPay được tích hợp hoàn chỉnh với luồng đặt hàng, bao gồm:
- **Tạo đơn hàng** → **Tạo payment URL** → **Chuyển hướng VNPay** → **Xử lý callback** → **Cập nhật trạng thái**

## 🚀 **Luồng thanh toán chi tiết**

### **Bước 1: Đặt hàng (place-order)**

#### **API Endpoint:**
```bash
POST /api/v1/user/orders/place-order
```

#### **Request Body:**
```json
{
    "name": "Trịnh Xuân Sơn",
    "email": "strinh741@gmail.com",
    "phone": "0394072191",
    "address": "21313, Quận Sơn Trà, Đà Nẵng",
    "payment_method": "online_payment",
    "subtotal": 209962,
    "shipping_fee": 30000,
    "tax": 5000,
    "discount": 0,
    "total": 244962,
    "notes": "Giao hàng giờ hành chính",
    "coupon_code": "SALE10",
    "items": [
        {
            "product_id": 2,
            "variant_id": null,
            "quantity": 1,
            "price": 209962
        }
    ]
}
```

#### **Response (Success):**
```json
{
    "success": true,
    "message": "Đặt hàng thành công",
    "data": {
        "order_id": 1,
        "order_number": "ORD202412150001",
        "total": 244962,
        "status": "pending",
        "payment_method": "vnpay",
        "payment_url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
        "payment_reference": "ORD202412150001"
    }
}
```

#### **Database Changes:**
- ✅ **Orders table**: Tạo đơn hàng mới với `status = 'pending'`
- ✅ **Order_items table**: Tạo các items của đơn hàng
- ✅ **Products/Product_variants**: Giảm stock quantity
- ✅ **Coupon_users**: Ghi nhận sử dụng coupon (nếu có)

---

### **Bước 2: Tạo Payment URL (create-payment)**

#### **API Endpoint:**
```bash
POST /api/v1/create-payment
```

#### **Request Body:**
```json
{
    "order_id": 1,
    "amount": 244962,
    "order_info": "Thanh toan don hang #ORD202412150001",
    "bank_code": "NCB",
    "expire_date": "20241215235959",
    "billing": {
        "mobile": "0394072191",
        "email": "strinh741@gmail.com",
        "fullname": "Trịnh Xuân Sơn",
        "address": "21313, Quận Sơn Trà, Đà Nẵng",
        "city": "Đà Nẵng",
        "country": "VN"
    },
    "invoice": {
        "phone": "0394072191",
        "email": "strinh741@gmail.com",
        "customer": "Trịnh Xuân Sơn",
        "address": "21313, Quận Sơn Trà, Đà Nẵng",
        "company": "Functional Food",
        "taxcode": "123456789",
        "type": "I"
    }
}
```

#### **Response:**
```json
{
    "success": true,
    "message": "Payment URL created successfully",
    "data": {
        "payment_url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
        "txn_ref": "ORD202412150001",
        "amount": 244962,
        "hash_data": "vnp_Amount=24496200&vnp_Command=pay&...",
        "secure_hash": "abc123..."
    }
}
```

---

### **Bước 3: Chuyển hướng đến VNPay**

#### **Frontend Action:**
```javascript
// Sau khi nhận payment_url từ API
if (response.data.payment_url) {
    window.location.href = response.data.payment_url;
}
```

#### **VNPay Payment Page:**
- User nhập thông tin thẻ/ngân hàng
- Xác thực OTP
- Hoàn tất thanh toán

---

### **Bước 4: VNPay Return (User redirect)**

#### **URL:**
```
GET /payment/return?vnp_Amount=24496200&vnp_BankCode=NCB&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%23ORD202412150001&vnp_ResponseCode=00&vnp_TxnRef=ORD202412150001&vnp_TransactionNo=12345678&vnp_SecureHash=abc123...
```

#### **Xử lý:**
1. **Verify payment response** - Kiểm tra hash
2. **Find order** - Tìm đơn hàng theo `vnp_TxnRef`
3. **Update order status**:
   - **Success** (`vnp_ResponseCode=00`): `status = 'paid'`
   - **Failed**: `status = 'payment_failed'`
4. **Show result page** - Success/Error view

#### **Database Changes:**
- ✅ **Orders table**: Cập nhật `status`, `paid_at`, `payment_transaction_id`

---

### **Bước 5: VNPay IPN (Server callback)**

#### **URL:**
```
GET /api/v1/vnpay-ipn?vnp_Amount=24496200&vnp_BankCode=NCB&vnp_OrderInfo=Thanh%20toan%20don%20hang%20%23ORD202412150001&vnp_ResponseCode=00&vnp_TxnRef=ORD202412150001&vnp_TransactionNo=12345678&vnp_SecureHash=abc123...
```

#### **Xử lý:**
1. **Verify payment response** - Kiểm tra hash
2. **Find order** - Tìm đơn hàng theo `vnp_TxnRef`
3. **Update order status** - Tương tự Return URL
4. **Return response** - `200 OK` hoặc `400 Bad Request`

---

## 📊 **Trạng thái đơn hàng**

| Status | Mô tả | Hành động |
|--------|-------|-----------|
| `pending` | Đơn hàng mới tạo | Chờ thanh toán |
| `processing` | Đang xử lý thanh toán | Chờ VNPay callback |
| `paid` | Thanh toán thành công | Giao hàng |
| `payment_failed` | Thanh toán thất bại | Thông báo lỗi |
| `cancelled` | Đơn hàng bị hủy | Hoàn tiền (nếu cần) |
| `shipped` | Đã giao hàng | Tracking |
| `delivered` | Giao hàng thành công | Hoàn tất |
| `refunded` | Đã hoàn tiền | Kết thúc |

---

## 🔧 **Cấu hình VNPay**

### **Environment Variables:**
```env
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_PAYMENT_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
APP_URL=https://yourdomain.com
```

### **VNPay Merchant Portal:**
- **Return URL**: `https://yourdomain.com/payment/return`
- **IPN URL**: `https://yourdomain.com/api/v1/vnpay-ipn`

---

## 🧪 **Test Payment Flow**

### **1. Test Order Creation:**
```bash
curl -X POST https://yourdomain.com/api/v1/user/orders/place-order \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "0123456789",
    "address": "Test Address",
    "payment_method": "online_payment",
    "subtotal": 100000,
    "shipping_fee": 30000,
    "tax": 5000,
    "discount": 0,
    "total": 135000,
    "items": [
      {
        "product_id": 1,
        "quantity": 1,
        "price": 100000
      }
    ]
  }'
```

### **2. Test Payment URL Creation:**
```bash
curl -X POST https://yourdomain.com/api/v1/test-vnpay-payment \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 135000,
    "order_info": "Test payment",
    "bank_code": "NCB"
  }'
```

---

## 📝 **Logging & Monitoring**

### **Payment Logs:**
- **Payment URL creation**: `storage/logs/laravel.log`
- **Return URL processing**: `storage/logs/laravel.log`
- **IPN processing**: `storage/logs/laravel.log`

### **Database Tables:**
- **orders**: Lưu thông tin đơn hàng và payment
- **order_items**: Lưu chi tiết sản phẩm
- **coupon_users**: Lưu sử dụng coupon

---

## ⚠️ **Lưu ý quan trọng**

1. **Security**: Luôn verify hash từ VNPay
2. **Stock Management**: Giảm stock khi tạo đơn hàng
3. **Error Handling**: Xử lý lỗi thanh toán gracefully
4. **Logging**: Log đầy đủ để debug
5. **Testing**: Test kỹ trước khi deploy production

---

## 🚀 **Deployment Checklist**

- [ ] Cấu hình VNPay credentials
- [ ] Set up Return URL và IPN URL
- [ ] Test payment flow end-to-end
- [ ] Monitor logs và transactions
- [ ] Backup database regularly
- [ ] Set up error notifications
