"use client";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import adminAxios from '../lib/axios';

export default function TestAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [author, setAuthor] = useState('');
  const [testResults, setTestResults] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tokenCookie = Cookies.get('token');
    const authorCookie = Cookies.get('author');
    
    setToken(tokenCookie || '');
    setAuthor(authorCookie || '');
    setIsAuthenticated(!!tokenCookie);
  }, []);

  const testEndpoint = async (name: string, endpoint: string, method: 'GET' | 'POST' = 'GET') => {
    setLoading(true);
    setTestResults(prev => ({ ...prev, [name]: 'Testing...' }));
    
    try {
      let response;
      if (method === 'GET') {
        response = await adminAxios.get(endpoint);
      } else {
        response = await adminAxios.post(endpoint, {});
      }
      
      setTestResults(prev => ({ 
        ...prev, 
        [name]: `✅ Success: ${JSON.stringify(response.data, null, 2).substring(0, 100)}...` 
      }));
    } catch (error: unknown) {
      const axiosError = error as { response?: { data: unknown }; message: string };
      const errorMessage = axiosError.response?.data || axiosError.message;
      setTestResults(prev => ({ 
        ...prev, 
        [name]: `❌ Error: ${JSON.stringify(errorMessage, null, 2).substring(0, 100)}...` 
      }));
    } finally {
      setLoading(false);
    }
  };

  const clearCookies = () => {
    Cookies.remove('token');
    Cookies.remove('author');
    setToken('');
    setAuthor('');
    setIsAuthenticated(false);
    setTestResults({});
  };

  return (
    <div className="admin-container" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-400) 100%)',
      padding: 'var(--spacing-lg)'
    }}>
      <div className="admin-card" style={{ 
        maxWidth: '800px', 
        width: '100%',
        margin: '0 auto',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div className="admin-card-header" style={{ textAlign: 'center' }}>
          <h1 className="admin-card-title">Test Authentication</h1>
          <p className="text-muted">Kiểm tra trạng thái xác thực và quyền truy cập</p>
        </div>
        
        <div className="admin-card-body">
          <h2 className="admin-card-title">Trạng thái Authentication</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label className="admin-label">isAuthenticated:</label>
            <span className={`admin-badge ${isAuthenticated ? 'badge-success' : 'badge-danger'}`}>
              {isAuthenticated ? 'True' : 'False'}
            </span>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label className="admin-label">Token Cookie:</label>
            <div style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '5px',
              wordBreak: 'break-all',
              fontSize: '12px'
            }}>
              {token || 'Không có token'}
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label className="admin-label">Author Cookie:</label>
            <div style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '5px',
              wordBreak: 'break-all',
              fontSize: '12px'
            }}>
              {author || 'Không có author'}
            </div>
          </div>

          <h3 className="admin-card-title">Test API Endpoints</h3>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <button 
              className="admin-button" 
              onClick={() => testEndpoint('Orders', '/admin/orders?page=1&per_page=5')}
              disabled={loading}
            >
              Test Orders API
            </button>
            <button 
              className="admin-button" 
              onClick={() => testEndpoint('Users', '/admin/users')}
              disabled={loading}
            >
              Test Users API
            </button>
            <button 
              className="admin-button" 
              onClick={() => testEndpoint('Statistics', '/admin/statistics/overview')}
              disabled={loading}
            >
              Test Statistics API
            </button>
            <button 
              className="admin-button" 
              onClick={() => testEndpoint('Events', '/admin/events')}
              disabled={loading}
            >
              Test Events API
            </button>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div>
              <h4>Kết quả test:</h4>
              {Object.entries(testResults).map(([name, result]) => (
                <div key={name} style={{ marginBottom: '15px' }}>
                  <strong>{name}:</strong>
                  <div style={{ 
                    background: '#f5f5f5', 
                    padding: '10px', 
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}>
                    {result}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="admin-button danger" onClick={clearCookies}>
              Clear Cookies
            </button>
            <a href="/admin/login" className="admin-button info">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 