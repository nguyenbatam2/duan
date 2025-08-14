"use client";

import { useEffect, useState, useMemo } from "react";

import { getUsers, getRanks } from "../lib/use";
import { User, CustomerRank } from "../types/user";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [ranks, setRanks] = useState<CustomerRank[]>([]);
  const [loadingRanks, setLoadingRanks] = useState(false);
  const [selectedRankId, setSelectedRankId] = useState<string>("");

  // Load users khi component mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Lỗi load users", err);
      }
    })();
  }, []);

  // Load ranks khi component mount
  useEffect(() => {
    (async () => {
      setLoadingRanks(true);
      try {
        const data = await getRanks();
        setRanks(data);
      } catch (err) {
        console.error("Lỗi load ranks:", err);
      } finally {
        setLoadingRanks(false);
      }
    })();
  }, []);

  // ⚡ Dùng useMemo để chỉ lọc lại khi selectedRankId hoặc users thay đổi
  const filteredUsers = useMemo(() => {
    if (!selectedRankId) return users;
    return users.filter(user => user.rank_id === selectedRankId);
  }, [users, selectedRankId]);

  return (
    <>
      <style>{`
        .user-modern-container {
          background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
          min-height: 100vh;
          padding: 40px 0 0 0;
        }
        .user-modern-table {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 16px #0001;
          overflow: hidden;
          margin-bottom: 32px;
        }
        .user-modern-table th, .user-modern-table td {
          padding: 13px 20px;
          border-bottom: 1px solid rgb(233, 235, 237);
          font-size: 1.04rem;
        }
        .user-modern-table th {
          background: rgb(244, 241, 249);
          font-weight: 600;
          color: #2563eb;
          border-bottom: 2px solid #e0e7ff;
          font-size: 1.08rem;
        }
        .user-modern-table tr:last-child td {
          border-bottom: none;
        }
        .user-modern-select {
          border-radius: 7px;
          border: 1.5px solid #2563ebd9;
          padding: 9px 16px;
          font-size: 1.04rem;
          margin-left: 8px;
          background: #2563ebd9;
          color: #fff;
          transition: border 0.15s, background 0.15s;
        }
        .user-modern-select:focus {
          border: 1.5px solid #6366f1;
          outline: none;
          background: #2563eb;
        }
        .user-modern-select option {
          color: #22223b;
          background: #fff;
        }
        .user-modern-select option:checked {
          background: #2563eb !important;
          color: #fff !important;
        }
        .user-modern-header {
          font-size: 2.1rem;
          font-weight: 700;
          color: #22223b;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
        }
        @media (max-width: 900px) {
          .user-modern-table th, .user-modern-table td { padding: 8px 8px; font-size: 0.97rem; }
          .user-modern-header { font-size: 1.3rem; }
          .user-modern-select { padding: 7px 8px; font-size: 0.97rem; }
        }
      `}</style>
      <div className="user-modern-container">
        <div className="container mt-4">
          <div className="d-flex align-items-center mb-3">
            <h2 className="user-modern-header mb-0">Danh sách khách hàng</h2>
            <div className="ms-auto d-flex flex-column align-items-end">
              <label className="form-label fs-6 mb-1">Chọn Rank:</label>
              <select
                className="user-modern-select"
                value={selectedRankId}
                onChange={(e) => setSelectedRankId(e.target.value)}
                disabled={loadingRanks}
                style={{ width: "200px" }}
              >
                <option value="">
                  {loadingRanks ? "Đang tải danh sách Rank..." : "-- Chọn Rank --"}
                </option>
                {ranks.map((rank) => (
                  <option key={rank.id} value={rank.id}>
                    {rank.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="user-modern-table">
            <table className="table" style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Xác thực Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.email_verified_at ? "Đã xác thực" : "Chưa xác thực"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
