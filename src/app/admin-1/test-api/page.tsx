"use client";
import { useState } from 'react';
import adminAxios from '../lib/axios';

export default function TestAPI() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint: string) => {
    setLoading(true);
    setResult("");
    
    try {
      console.log(`Testing endpoint: ${endpoint}`);
      const response = await adminAxios.post(endpoint, { email, password });
      setResult(`✅ Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      console.error(`Error testing ${endpoint}:`, error);
      const errorMessage = error.response?.data || error.message;
      setResult(`❌ Error: ${JSON.stringify(errorMessage, null, 2)}`);
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
        maxWidth: '600px', 
        width: '100%',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div className="admin-card-header" style={{ textAlign: 'center' }}>
          <h2 className="admin-card-title">Test API Endpoints</h2>
          <p className="text-muted">Kiểm tra các endpoint khác nhau</p>
        </div>
        <div className="admin-card-body">
          <div style={{ marginBottom: '20px' }}>
            <label className="admin-label">Email:</label>
            <input
              type="email"
              className="admin-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Nhập email test"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label className="admin-label">Password:</label>
            <input
              type="password"
              className="admin-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nhập password test"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <button 
              className="admin-button" 
              onClick={() => testEndpoint('/auth/login')}
              disabled={loading}
            >
              Test /auth/login
            </button>
            <button 
              className="admin-button" 
              onClick={() => testEndpoint('/admin/auth/login')}
              disabled={loading}
            >
              Test /admin/auth/login
            </button>
            <button 
              className="admin-button" 
              onClick={() => testEndpoint('/admin/login')}
              disabled={loading}
            >
              Test /admin/login
            </button>
          </div>
          
          {loading && <p>Đang test...</p>}
          
          {result && (
            <div style={{ 
              background: '#f5f5f5', 
              padding: '15px', 
              borderRadius: '5px',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              {result}
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a href="/admin/login" className="text-primary">← Quay lại trang đăng nhập</a>
          </div>
        </div>
      </div>
    </div>
  );
} 