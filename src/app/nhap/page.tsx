
<main className="home-main">
    <div className="home__container two">
        <div className="home__container--title"
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center", // marginBottom: "20px"
            }}
        >
            <a href="#">Danh sách sản phẩm</a>
            <div
                className="row"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                }}
            >

                <button type="button" className="col"
                    onClick={() => setIsAddformOpen((prev) => !prev)}
                    style={{
                        padding: "8px 8px",
                        cursor: "pointer",
                        margin: "10px 10px 0 0",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                    }}
                >
                    {isAddformOpen ? "Đóng form" : "+ Thêm sản phẩm"}
                </button>
            </div>
        </div>

        <div className="home__container--content">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ảnh</th>
                        <th>Tên</th>
                        <th>Danh mục</th>
                        <th>Loại</th>
                        <th>Giá</th>
                        <th>Giảm giá</th>
                        <th>Tồn kho</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item, index) => (
                        <tr key={item.id}>
                            <td>{(page - 1) * 10 + index + 1}</td>
                            <td>
                                <img
                                    src={item.image || ""}
                                    alt={item.name}
                                    width="50"
                                />
                            </td>
                            <td>{item.name}</td>
                            <td>
                                {item.category.name}
                            </td>
                            <td>{item.product_type}</td>
                            <td>{Number(item.base_price).toLocaleString()} đ</td>
                            <td>{Number(item.display_price).toLocaleString()} đ</td>
                            <td>{item.stock_quantity}</td>
                            <td className="action-buttons">
                                <button
                                    className="view"
                                    onClick={() => handleViews(item.id)}
                                >
                                    View
                                </button>
                                <button
                                    className="edit"
                                    onClick={() => handleEdit(item.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: "10px", textAlign: "center" }}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                    Trang trước
                </button>
                <span style={{ margin: "0 10px" }}>
                    Trang {page} / {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                    Trang sau
                </button>
            </div>


        </div>
    </div>
</main>



value = { search }
onChange = {(e) => setSearch(e.target.value)}

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