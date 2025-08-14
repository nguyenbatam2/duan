/* eslint-disable @typescript-eslint/no-unused-vars */
import { Author, LoginData } from './../types/auth.d';
import adminAxios from './axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export const loginUser = async (data: LoginData) => {
  try {
    console.log('Attempting admin login with:', { email: data.email });
    // Sử dụng endpoint riêng cho admin
    const response = await adminAxios.post('/admin/auth/login', data);
    console.log('Admin login successful:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Login error:', error);
    
    // Xử lý các loại lỗi khác nhau
    const axiosError = error as { response?: { status: number; data?: { message?: string; error?: string } }; request?: unknown };
    if (axiosError.response) {
      // Server trả về lỗi
      const status = axiosError.response.status;
      const message = axiosError.response.data?.message || axiosError.response.data?.error;
      
      if (status === 401) {
        throw new Error('Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại!');
      } else if (status === 422) {
        throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin!');
      } else if (status === 500) {
        throw new Error('Lỗi server. Vui lòng thử lại sau!');
      } else {
        throw new Error(message || `Lỗi ${status}: Vui lòng thử lại!`);
      }
    } else if (axiosError.request) {
      // Không thể kết nối đến server
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!');
    } else {
      // Lỗi khác
      throw new Error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  }
};

export const logout = () => {
  // Xóa token khỏi cookies
  Cookies.remove('token');
  Cookies.remove('user');
  
  // Xóa các dữ liệu khác nếu có
  localStorage.removeItem('admin_user');
  sessionStorage.clear();
  
  // Redirect về trang login
  window.location.href = '/admin/login';
};

export const useLogout = () => {
  const router = useRouter();
  
  const handleLogout = () => {
    // Xóa token khỏi cookies
    Cookies.remove('token');
    Cookies.remove('user');
    
    // Xóa các dữ liệu khác nếu có
    localStorage.removeItem('admin_user');
    sessionStorage.clear();
    
    // Redirect về trang login
    router.push('/admin/login');
  };
  
  return { handleLogout };
};
