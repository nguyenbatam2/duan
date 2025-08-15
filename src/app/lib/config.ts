// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

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

// Payment Configuration
export const PAYMENT_CONFIG = {
  RETURN_URL: process.env.NEXT_PUBLIC_PAYMENT_RETURN_URL || 'http://localhost:3000/payment/return',
  VNPAY_URL: process.env.NEXT_PUBLIC_VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
};
