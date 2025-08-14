# Bird's Nest E-commerce

## Cấu hình API

### Biến môi trường

Dự án sử dụng biến môi trường để quản lý URL API. Tạo file `.env.local` trong thư mục gốc với nội dung:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### Thay đổi URL API khi deploy

Khi deploy lên production, chỉ cần thay đổi giá trị `NEXT_PUBLIC_API_BASE_URL` trong file `.env.local`:

```env
# Development
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1

# Production
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api/v1
```

### Cấu trúc API Endpoints

Dự án đã được tổ chức với các endpoint được định nghĩa trong `src/app/lib/config.ts`:

- **Public API**: Cho trang chủ và người dùng
- **Admin API**: Cho quản trị viên
- **User API**: Cho người dùng đã đăng nhập

### Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Chạy production
npm start
```

## Tính năng

- ✅ Quản lý sản phẩm và danh mục
- ✅ Hệ thống sự kiện khuyến mãi
- ✅ Quản lý mã giảm giá
- ✅ Giỏ hàng và thanh toán
- ✅ Hệ thống đánh giá sản phẩm
- ✅ Quản lý đơn hàng
- ✅ Dashboard thống kê
- ✅ Responsive design
