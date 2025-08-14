"use client";

import { useEffect, useState } from "react";

import  {getAdmins}  from "../lib/Admin";
import { Admin } from "../types/Admin";

export default function AdminList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getAdmins();
        setAdmins(data);
      } catch (err) {
        console.error("Lỗi load admins", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <style>{`
        .admin-modern-container {
          background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
          min-height: 100vh;
          padding: 40px 0 0 0;
          font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
        }
        .admin-modern-table {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 16px #0001;
          overflow: hidden;
          margin-bottom: 32px;
        }
        .admin-modern-table th, .admin-modern-table td {
          padding: 13px 20px;
          border-bottom: 1px solid #e9ebed;
          font-size: 1.04rem;
          color: #22223b;
          font-family: inherit;
        }
        .admin-modern-table th {
          background: #f1f5f9;
          font-weight: 700;
          color: #2563eb;
          border-bottom: 2px solid #e0e7ff;
          font-size: 1.08rem;
          letter-spacing: 0.2px;
        }
        .admin-modern-table td {
          font-weight: 500;
          color: #23272f;
        }
        .admin-modern-table tr:last-child td {
          border-bottom: none;
        }
        .admin-modern-btn {
          border: none;
          border-radius: 6px;
          padding: 6px 16px;
          font-size: 0.97rem;
          font-weight: 600;
          margin-right: 6px;
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
          font-family: inherit;
        }
        .admin-modern-btn.edit { background: #e0e7ff; color: #2563eb; }
        .admin-modern-btn.edit:hover { background: #2563eb; color: #fff; }
        .admin-modern-btn.delete { background: #fee2e2; color: #dc2626; }
        .admin-modern-btn.delete:hover { background: #dc2626; color: #fff; }
        .admin-modern-header {
          font-size: 2.1rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
          font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
        }
        @media (max-width: 900px) {
          .admin-modern-table th, .admin-modern-table td { padding: 8px 8px; font-size: 0.97rem; }
          .admin-modern-header { font-size: 1.3rem; }
          .admin-modern-btn { padding: 7px 8px; font-size: 0.97rem; }
        }
      `}</style>
      <div className="admin-modern-container">
        <h2 className="admin-modern-header">Danh sách Quản trị viên</h2>
        <table className="admin-modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Role</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
                <td>{admin.status === "active" ? "Hoạt động" : "Không hoạt động"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div>Đang tải...</div>}
      </div>
    </>
  );
}
