"use client";

import { useAuth } from "../lib/useAuth";

interface LogoutButtonProps {
  variant?: "default" | "compact";
}

export default function LogoutButton({ variant = "default" }: LogoutButtonProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
    }
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handleLogout}
        style={{
          background: 'none',
          border: 'none',
          color: '#6b7280',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f3f4f6';
          e.currentTarget.style.color = '#ef4444';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'none';
          e.currentTarget.style.color = '#6b7280';
        }}
        title="Đăng xuất"
      >
        🚪
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: '#ef4444',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#dc2626';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#ef4444';
      }}
    >
      Đăng xuất
    </button>
  );
} 