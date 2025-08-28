"use client";

import { useEffect, useState } from "react";
import { getUsers, getRanks, toggleUserStatus } from "../lib/use";
import { User, CustomerRank } from "../types/user";
import "../style/user.css"

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [ranks, setRanks] = useState<CustomerRank[]>([]);
  const [loadingRanks, setLoadingRanks] = useState(false);
  const [selectedRankId, setSelectedRankId] = useState<string>("");
  const [loadingUserIds, setLoadingUserIds] = useState<number[]>([]);
  const [sortType, setSortType] = useState<"id" | "name">("id");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        let data;
        if (selectedRankId) {
          data = await getUsers({ customer_rank_id: selectedRankId });
        } else {
          data = await getUsers();
        }
        setUsers(data);
      } catch (err) {
        console.error("Lỗi load users", err);
      }
    })();
  }, [selectedRankId]);

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

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortType === "id") {
      return a.id - b.id;
    } else {
      return a.name.localeCompare(b.name, "vi", { sensitivity: "base" });
    }
  });

  return (
    <section className="home">
      <header className="home-header">
        <div className="text">Xin chào Admin</div>
        <div className="search">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            style={{ padding: "5px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main className="home-main">
        <div className="home__container two">
          <div className="home__container--title" style={{ display: "flex", justifyContent: "space-between", alignContent: "center" }}>
            <a href="#">Danh sách sản phẩm</a>
            <div className="row" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div className="user-modern-control-group">
                <label>Hạng khách hàng</label>
                <select
                  className="user-modern-select"
                  value={selectedRankId}
                  onChange={(e) => setSelectedRankId(e.target.value)}
                  disabled={loadingRanks}
                >
                  <option value="">Tất cả hạng</option>
                  {ranks.map((rank) => (
                    <option key={rank.id} value={rank.id}>
                      {rank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="user-modern-control-group">
                <label>Sắp xếp</label>
                <select
                  className="user-modern-select"
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value as "id" | "name")}
                >
                  <option value="id">ID tăng dần</option>
                  <option value="name">Tên A-Z</option>
                </select>
              </div>
            </div>
          </div>

          <div className="home__container--content">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên khách hàng</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Hạng</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  console.log(user),
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "N/A"}</td>
                    <td>
                      <span
                        className={`rank-badge   rank-${(
                          user.customer_rank?.name || "default"
                        ).toLowerCase()}`}
                      >
                        {user.customer_rank?.name || "Chưa phân hạng"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          user.is_locked ? "status-locked" : "status-active"
                        }`}
                      >
                        {user.is_locked ? "Đã khóa" : "Hoạt động"}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button
                        className={`action-button ${
                          user.is_locked ? "unlock" : ""
                        }`}
                        disabled={loadingUserIds.includes(user.id)}
                        onClick={async () => {
                          setLoadingUserIds((prev) => [...prev, user.id]);
                          try {
                            await toggleUserStatus(user.id);
                            setUsers((prev) =>
                              prev.map((u) =>
                                u.id === user.id
                                  ? { ...u, is_locked: !u.is_locked }
                                  : u
                              )
                            );
                          } catch {
                            alert("Lỗi thao tác!");
                          } finally {
                            setLoadingUserIds((prev) =>
                              prev.filter((id) => id !== user.id)
                            );
                          }
                        }}
                      >
                        {loadingUserIds.includes(user.id)
                          ? "Đang xử lý..."
                          : user.is_locked
                          ? "Mở khóa"
                          : "Khóa"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </section>
  );
}

