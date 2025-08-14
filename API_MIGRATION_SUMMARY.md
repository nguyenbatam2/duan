# Tóm tắt chuyển đổi API Endpoints

## ✅ Đã hoàn thành

### 1. Tạo file cấu hình
- **`.env.local`**: Chứa biến môi trường `NEXT_PUBLIC_API_BASE_URL`
- **`.env.example`**: File mẫu cho biến môi trường
- **`src/app/lib/config.ts`**: File config quản lý tất cả API endpoints

### 2. Cập nhật các file chính

#### ✅ Public API (Frontend)
- `src/app/page.tsx` - Sử dụng `PUBLIC_API.PRODUCTS`
- `src/app/lib/category.ts` - Sử dụng `PUBLIC_API.CATEGORIES`
- `src/app/lib/event.ts` - Sử dụng `PUBLIC_API.EVENTS`
- `src/app/lib/Coupon.ts` - Sử dụng `API_BASE_URL` và `USER_API.COUPONS`
- `src/app/lib/product.ts` - Sử dụng `PUBLIC_API.PRODUCTS` và `USER_API`
- `src/app/lib/posts.ts` - Sử dụng `API_BASE_URL`
- `src/app/events/page.tsx` - Sử dụng `API_BASE_URL` cho banner images và hiển thị sản phẩm giống trang chủ (đã sửa để sử dụng event.products, bỏ phần lọc, CSS giống trang chủ)
- `src/app/product/[id]/page.tsx` - Cập nhật để sử dụng cấu trúc API mới với event pricing (display_price, original_price, event_info, has_active_event)
- `src/app/product/page.tsx` - Cập nhật để hiển thị giá sự kiện và badge event trên trang danh sách sản phẩm
- `src/app/types/product.d.ts` - Thêm các trường mới cho event pricing theo document.md
- `src/app/events/[id]/page.tsx` - Sử dụng `API_BASE_URL` cho images và CSS giống trang chủ

#### ✅ User API (Frontend)
- `src/app/lib/authorApi.ts` - Sử dụng `API_BASE_URL` và `USER_API`
- `src/app/lib/orderApi.ts` - Sử dụng `USER_API.ORDERS`
- `src/app/lib/wishlist.ts` - Sử dụng `USER_API.WISHLIST`
- `src/app/account/page.tsx` - Sử dụng `API_BASE_URL`
- `src/app/product/[id]/page.tsx` - Sử dụng `API_BASE_URL` cho avatar và images

#### ✅ Admin API (Admin Panel)
- `src/app/admin/lib/axios.ts` - Sử dụng `API_BASE_URL`
- `src/app/admin/lib/cartegory.ts` - Sử dụng `PUBLIC_API.CATEGORIES` và `ADMIN_API.CATEGORIES`
- `src/app/admin/lib/product.ts` - Sử dụng `PUBLIC_API.PRODUCTS` và `ADMIN_API.PRODUCTS`
- `src/app/admin/lib/reviews.ts` - Sử dụng `ADMIN_API.REVIEWS`
- `src/app/admin/lib/oder.ts` - Sử dụng `ADMIN_API.ORDERS`
- `src/app/admin/lib/useCoupon.ts` - Sử dụng `ADMIN_API.COUPONS`
- `src/app/admin/category/page.tsx` - Sử dụng `ADMIN_API.CATEGORIES`
- `src/app/lib/adminPosts.ts` - Sử dụng `ADMIN_API.POSTS`

## 🔄 Cần cập nhật thêm

### Files còn sử dụng hardcode URL:

#### Admin Old (có thể bỏ qua):
- `src/app/admin-old/` (toàn bộ thư mục)

## 📝 Cách sử dụng

### Development:
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### Production:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api/v1
```

## 🏗️ Cấu trúc API Endpoints

```typescript
// Public API endpoints
export const PUBLIC_API = {
  PRODUCTS: `${API_BASE_URL}/public/products`,
  CATEGORIES: `${API_BASE_URL}/public/public-categories`,
  EVENTS: `${API_BASE_URL}/public/events`,
  COUPONS: `${API_BASE_URL}/public/coupons`,
};

// Admin API endpoints
export const ADMIN_API = {
  EVENTS: `${API_BASE_URL}/admin/events`,
  CATEGORIES: `${API_BASE_URL}/admin/categories`,
  PRODUCTS: `${API_BASE_URL}/admin/products`,
  USERS: `${API_BASE_URL}/admin/users`,
  ORDERS: `${API_BASE_URL}/admin/orders`,
  COUPONS: `${API_BASE_URL}/admin/coupons`,
  REVIEWS: `${API_BASE_URL}/admin/reviews`,
  STATISTICS: `${API_BASE_URL}/admin/statistics`,
  POSTS: `${API_BASE_URL}/admin/posts`,
};

// User API endpoints
export const USER_API = {
  WISHLIST: `${API_BASE_URL}/user/wishlist`,
  CART: `${API_BASE_URL}/user/cart`,
  ORDERS: `${API_BASE_URL}/user/orders`,
  PROFILE: `${API_BASE_URL}/user/profile`,
  COUPONS: `${API_BASE_URL}/user/coupons`,
  REVIEWS: `${API_BASE_URL}/user/reviews`,
  PRODUCTS: `${API_BASE_URL}/user/products`,
  ADDRESSES: `${API_BASE_URL}/user/addresses`,
  ADDRESS: `${API_BASE_URL}/user/address`,
};
```

## 🎯 Lợi ích đạt được

1. **Dễ dàng thay đổi**: Chỉ cần sửa 1 biến môi trường
2. **Bảo mật**: Không hardcode URL trong code
3. **Linh hoạt**: Có thể có nhiều môi trường khác nhau
4. **Quản lý tập trung**: Tất cả API endpoints được định nghĩa ở một nơi
5. **Dễ bảo trì**: Khi thay đổi API, chỉ cần sửa file config
6. **Giao diện nhất quán**: Trang event sử dụng CSS giống trang chủ
7. **Hiển thị sản phẩm**: Trang danh sách events hiển thị sản phẩm của từng event với giao diện giống trang chủ
8. **Debug và sửa lỗi**: Đã thêm console.log để debug cấu trúc dữ liệu event
9. **Giao diện đơn giản**: Bỏ phần lọc, sử dụng cấu trúc section giống trang chủ với CSS nhất quán

## ⚠️ Lưu ý

- Các file trong thư mục `admin-old` có thể bỏ qua vì đây là phiên bản cũ
- Một số file còn lỗi TypeScript cần được sửa sau
- Khi deploy, nhớ thay đổi giá trị `NEXT_PUBLIC_API_BASE_URL` trong file `.env.local`
- Tất cả các file admin panel chính đã được cập nhật thành công
- Trang danh sách events và trang chi tiết event đã được cập nhật để sử dụng biến môi trường và hiển thị sản phẩm
- Trang danh sách events giờ hiển thị sản phẩm của từng event với giao diện giống trang chủ (swiper, add to cart, wishlist)
- Đã sửa để sử dụng `event.products` thay vì `event.eventProducts` để phù hợp với API response
- Đã bỏ phần lọc và sử dụng cấu trúc section giống trang chủ với CSS nhất quán
