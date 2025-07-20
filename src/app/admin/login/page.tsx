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
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      if (data.token) {
        Cookies.set("token", data.token);
        router.push("/admin/Statistic");
      }
    } catch (error) {
      // setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!"); // This line was removed as per the edit hint.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modern-bg">
      <div className="login-modern-container">
        <div className="login-modern-logo">
          <img src="/img/logo.png" alt="Logo" height={48} />
                            </div>
        <h2 className="login-modern-title">Đăng nhập quản trị</h2>
        <form className="login-modern-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="login-modern-input-group">
            <span className="login-modern-input-icon">📧</span>
            <input
              type="email"
              className="login-modern-input"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
                        </div>
          <div className="login-modern-input-group">
            <span className="login-modern-input-icon">🔒</span>
            <input
              type="password"
              className="login-modern-input"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
                            </div>
          <button className="login-modern-btn" type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
                                        </form>
        <div className="login-modern-footer">
          <a href="#" className="login-modern-link">Quên mật khẩu?</a>
        </div>
      </div>
      <style>{`
        .login-modern-bg {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #6366f1 0%, #60a5fa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-modern-container {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 8px 32px #6366f133, 0 1.5px 8px #2563eb22;
          padding: 38px 32px 28px 32px;
          min-width: 340px;
          max-width: 94vw;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .login-modern-logo img {
          display: block;
          margin-bottom: 10px;
        }
        .login-modern-title {
          font-size: 1.18rem;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 22px;
          letter-spacing: 0.5px;
        }
        .login-modern-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .login-modern-input-group {
          display: flex;
          align-items: center;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 0 10px;
          border: 1.5px solid #e0e7ef;
          transition: border 0.2s;
        }
        .login-modern-input-group:focus-within {
          border: 1.5px solid #6366f1;
        }
        .login-modern-input-icon {
          font-size: 1.13em;
          color: #6366f1;
          margin-right: 7px;
        }
        .login-modern-input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.98rem;
          padding: 10px 0;
          width: 100%;
          color: #222;
        }
        .login-modern-btn {
          margin-top: 6px;
          width: 100%;
          padding: 10px 0;
          background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%);
          color: #fff;
          font-weight: 600;
          font-size: 1.01rem;
          border: none;
          border-radius: 8px;
          box-shadow: 0 2px 8px #6366f122;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s;
        }
        .login-modern-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, #2563eb 0%, #6366f1 100%);
          box-shadow: 0 4px 16px #6366f133;
        }
        .login-modern-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .login-modern-error {
          color: #ef4444;
          background: #fef2f2;
          border-radius: 6px;
          padding: 7px 10px;
          font-size: 0.97em;
          margin-bottom: -6px;
          text-align: center;
        }
        .login-modern-footer {
          margin-top: 18px;
          text-align: center;
        }
        .login-modern-link {
          color: #6366f1;
          font-size: 0.97em;
          text-decoration: underline;
          transition: color 0.18s;
        }
        .login-modern-link:hover {
          color: #2563eb;
        }
        @media (max-width: 600px) {
          .login-modern-container {
            min-width: 90vw;
            padding: 22px 6vw 18px 6vw;
          }
        }
      `}</style>
    </div>
  );
}
