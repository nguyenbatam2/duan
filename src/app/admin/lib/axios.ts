import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../lib/config';

// Tạo axios instance cho admin
const adminAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Tăng timeout lên 30 giây
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor - tự động thêm token
adminAxios.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Không thêm token cho request login
    if (config.url === '/admin/auth/login') {
      console.log('🔐 Admin login request - skipping token');
      return config;
    }
    
    const token = Cookies.get('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request');
    } else {
      console.log('⚠️ No token found for request');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi 401
adminAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log chi tiết lỗi để debug
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code
    });
    
    // Không xử lý logout cho request login
    if (error.config?.url === '/admin/auth/login') {
      console.log('🔐 Admin login request failed - not logging out');
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      console.log('Token hết hạn, đang đăng xuất...');
      
      // Xóa token và user data
      Cookies.remove('token');
      Cookies.remove('author');
      localStorage.removeItem('admin_user');
      sessionStorage.clear();
      
      // Chỉ redirect khi không phải ở trang login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    
    // Xử lý lỗi network
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network Error - Kiểm tra kết nối mạng hoặc server');
    }
    
    // Xử lý lỗi timeout
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout - Server phản hồi chậm');
    }
    
    return Promise.reject(error);
  }
);

export default adminAxios; 