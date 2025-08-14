"use client";


interface HeaderProps {
  title?: string;
  showLogout?: boolean;
}

export default function Header({ title = "Admin Dashboard", showLogout = true }: HeaderProps) {
  return (
    <>
      <header className="admin-header-component">
        <div className="header-content">
          <h1 className="header-title">{title}</h1>
          {showLogout && (
            <div className="header-actions">
              <LogoutButton variant="default" />
            </div>
          )}
        </div>
      </header>
      <style>{`
        .admin-header-component {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 1.5rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .header-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        
        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        @media (max-width: 768px) {
          .admin-header-component {
            padding: 0.75rem 1rem;
          }
          
          .header-title {
            font-size: 1.25rem;
          }
          
          .header-actions {
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
} 