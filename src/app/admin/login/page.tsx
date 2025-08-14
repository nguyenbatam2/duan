"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../lib/auth';
import Cookies from 'js-cookie';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Bắt đầu đăng nhập admin...");
    console.log("Email:", email);
    console.log("Password length:", password.length);
    setLoading(true);
    
    // Xóa token cũ nếu có để tránh xung đột
    Cookies.remove('token');
    Cookies.remove('author');
    
    try {
      const response = await loginUser({ email, password });
      console.log("Response từ API admin:", response);
      const data = response as { token: string; user: { id: number; name: string; email: string } };
      if (data && data.token) {
        // Lưu token
        Cookies.set("token", data.token, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        });
        
        // Lưu thông tin user
        if (data.user) {
          const authData = {
            id: data.user.id.toString(),
            name: data.user.name,
            email: data.user.email
          };
          Cookies.set("author", JSON.stringify(authData), {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
          });
          console.log("Đã lưu thông tin admin:", authData);
        }
        
        console.log("Đang chuyển hướng đến /admin/Statistic...");
        router.push("/admin/Statistic");
      } else {
        console.error("Response không có token:", data);
        alert("Đăng nhập thất bại: Response không hợp lệ!");
      }
    } catch (error) {
      console.error("Đăng nhập admin thất bại:", error);
      const errorMessage = error instanceof Error ? error.message : "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-400) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-lg)'
    }}>
      <div className="admin-card" style={{ 
        maxWidth: '400px', 
        width: '100%',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div className="admin-card-header" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <img src="/img/logo.png" alt="Logo" height={48} />
          </div>
          <h2 className="admin-card-title">Đăng nhập quản trị</h2>
          <p className="text-muted">Vui lòng nhập thông tin đăng nhập</p>
        </div>
        <div className="admin-card-body">
          <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div className="admin-control-group">
              <label className="admin-label">📧 Email</label>
              <input
                type="email"
                className="admin-input"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="admin-control-group">
              <label className="admin-label">🔒 Mật khẩu</label>
              <input
                type="password"
                className="admin-input"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="admin-button" type="submit" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
            <a href="#" className="text-primary">Quên mật khẩu?</a>
            
          </div>
        </div>
      </div>
    </div>
  );
}