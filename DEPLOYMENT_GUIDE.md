# Deployment Guide

## Tổng quan

Hướng dẫn chi tiết để deploy hệ thống thanh toán VNPay lên production.

## 1. Payment Flow Testing

### 1.1 Chạy Payment Tests

```bash
# Chạy tất cả payment tests
npm run test:payment

# Hoặc truy cập trang test
http://localhost:3000/test-payment
```

### 1.2 Test Scenarios

- **COD Payment**: Thanh toán khi nhận hàng
- **VNPay Payment**: Thanh toán online qua VNPay
- **Large Amount Payment**: Thanh toán số tiền lớn

### 1.3 Test Results

Kiểm tra kết quả test trong console và trang test để đảm bảo:
- ✅ Order placement hoạt động
- ✅ Payment URL generation thành công
- ✅ VNPay return handling đúng
- ✅ Error handling hoạt động

## 2. Frontend Integration

### 2.1 Cập nhật Components

Đã cập nhật các components để bỏ bank_transfer:
- `PaymentMethodSelector.tsx`
- `OrderSummary.tsx`
- `paymentUtils.ts`

### 2.2 Kiểm tra Integration

```bash
# Chạy development server
npm run dev

# Kiểm tra các trang:
# - http://localhost:3000/checkout
# - http://localhost:3000/payment/return
# - http://localhost:3000/admin/monitoring
```

### 2.3 Build Production

```bash
# Build ứng dụng
npm run build

# Kiểm tra build
npm run start
```

## 3. Production Deployment

### 3.1 Environment Configuration

Tạo file `.env.production`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1

# Payment Configuration
NEXT_PUBLIC_PAYMENT_RETURN_URL=https://yourdomain.com/payment/return
NEXT_PUBLIC_VNPAY_URL=https://pay.vnpay.vn/vpcpay.html

# Monitoring Configuration
NEXT_PUBLIC_MONITORING_API=https://yourdomain.com/api/monitoring
```

### 3.2 SSL Configuration

Đảm bảo SSL certificate được cài đặt:

```nginx
# Nginx configuration
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /payment/return {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3.3 Deployment Script

```bash
# Chạy deployment script
npm run deploy:production

# Hoặc chạy thủ công
chmod +x scripts/deploy.sh
./scripts/deploy.sh production
```

### 3.4 Post-Deployment Checklist

- [ ] Health check endpoints responding
- [ ] Payment gateway connectivity verified
- [ ] SSL certificate validation
- [ ] Performance monitoring active
- [ ] Error tracking configured
- [ ] Backup systems verified
- [ ] Security headers configured
- [ ] CDN configuration verified

## 4. Monitoring Setup

### 4.1 Monitoring Dashboard

Truy cập monitoring dashboard:
```
https://yourdomain.com/admin/monitoring
```

### 4.2 Key Metrics

- **Payment Success Rate**: Tỷ lệ thanh toán thành công
- **Average Response Time**: Thời gian phản hồi trung bình
- **Error Rate**: Tỷ lệ lỗi
- **Active Users**: Số người dùng đang hoạt động
- **Total Revenue**: Tổng doanh thu
- **Failed Payments**: Số thanh toán thất bại

### 4.3 Event Tracking

Hệ thống tự động track các events:
- Payment events (initiated, success, failed, cancelled)
- Performance metrics
- Error events
- User actions
- System health checks

### 4.4 Alert Configuration

Cấu hình alerts cho:
- Payment failure rate > 5%
- Response time > 5 seconds
- Error rate > 2%
- System downtime

## 5. Troubleshooting

### 5.1 Common Issues

#### Payment URL không tạo được
```bash
# Kiểm tra VNPay configuration
curl -X POST https://api.yourdomain.com/api/v1/user/orders/place-order \
  -H "Content-Type: application/json" \
  -d '{"payment_method": "online_payment", "total": 100000}'
```

#### Return page không load
```bash
# Kiểm tra route configuration
curl -f https://yourdomain.com/payment/return
```

#### SSL Certificate Issues
```bash
# Kiểm tra SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

### 5.2 Debug Commands

```bash
# Health check
npm run health-check

# Check environment variables
echo $NEXT_PUBLIC_API_BASE_URL
echo $NEXT_PUBLIC_PAYMENT_RETURN_URL

# Test API connectivity
curl -X GET $NEXT_PUBLIC_API_BASE_URL/health

# Check payment return
curl -X GET "https://yourdomain.com/payment/return?vnp_ResponseCode=00&vnp_TxnRef=test"
```

### 5.3 Log Analysis

```bash
# View application logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# View application logs (if using PM2)
pm2 logs

# View system logs
journalctl -u nginx -f
```

## 6. Security Considerations

### 6.1 Data Protection

- Sử dụng HTTPS cho tất cả communications
- Validate tất cả input từ user
- Sanitize data trước khi gửi API
- Implement rate limiting

### 6.2 Payment Security

- Validate payment response từ VNPay
- Implement signature verification
- Log tất cả payment events
- Monitor for suspicious activities

### 6.3 Environment Security

- Sử dụng environment variables cho sensitive data
- Implement proper access controls
- Regular security audits
- Keep dependencies updated

## 7. Performance Optimization

### 7.1 Frontend Optimization

- Image optimization enabled
- Compression enabled
- CDN configuration
- Caching strategies

### 7.2 Backend Optimization

- Database query optimization
- API response caching
- Load balancing
- Auto-scaling configuration

## 8. Backup and Recovery

### 8.1 Backup Strategy

- Database backups (daily)
- File system backups (weekly)
- Configuration backups (monthly)
- Test restore procedures

### 8.2 Disaster Recovery

- Document recovery procedures
- Test recovery scenarios
- Maintain backup copies off-site
- Regular recovery drills

## 9. Maintenance

### 9.1 Regular Maintenance

- Weekly security updates
- Monthly performance reviews
- Quarterly security audits
- Annual system upgrades

### 9.2 Monitoring Maintenance

- Review monitoring alerts
- Update monitoring thresholds
- Clean up old logs
- Optimize monitoring queries

## 10. Support and Contact

### 10.1 Emergency Contacts

- **Technical Support**: tech@yourdomain.com
- **Payment Issues**: payments@yourdomain.com
- **Security Issues**: security@yourdomain.com

### 10.2 Documentation

- API Documentation: `/api/docs`
- User Guide: `/docs/user-guide`
- Admin Guide: `/docs/admin-guide`
- Troubleshooting: `/docs/troubleshooting`

---

**Lưu ý**: Đảm bảo test kỹ lưỡng trước khi deploy lên production và có plan backup trong trường hợp có vấn đề.
