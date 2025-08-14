"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const author = Cookies.get('author');
      const token = Cookies.get('token');
      console.log('Checking auth cookie:', author);
      console.log('Checking token cookie:', token);
      
      if (!author || !token) {
        console.log('Missing author or token cookie');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Kiểm tra thông tin user từ cookie author
        const userData = JSON.parse(author);
        console.log('Parsed user data:', userData);
        if (userData && userData.id && token) {
          console.log('User authenticated successfully with token');
          setIsAuthenticated(true);
        } else {
          console.log('Invalid user data structure or missing token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    Cookies.remove('author');
    Cookies.remove('token');
    localStorage.removeItem('admin_user');
    sessionStorage.clear();
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  return {
    isAuthenticated,
    isLoading,
    logout
  };
}; 