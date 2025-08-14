import axios from 'axios';
import Cookies from 'js-cookie';

// Tạo axios instance cho admin
const adminAxios = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  timeout: 10000,
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
    
    return Promise.reject(error);
  }
);

export default adminAxios; 