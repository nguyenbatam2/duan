"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import "bootstrap/dist/css/bootstrap.min.css";
import { getCategories, postCategory, putCategory } from "../lib/cartegory";
import { Category } from "../types/cartegory";
import axios from "axios";
import "../style/adminCategory.css";
import Cookies from "js-cookie";
import { ADMIN_API } from "../../lib/config";
import { fetchProductsByCategory } from "../lib/product"; // Thêm hàm này
import { Product } from "../types/product"; // Import type Product

export default function CategoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<{ name: string; slug: string }>({
    name: "",
    slug: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // gọi API lấy category có phân trang
  const {
    data: categoriesData,
    isLoading,
    mutate,
  } = useSWR(["categories", page], () => getCategories(page));

  const categories: Category[] = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : [];

  // cập nhật tổng số trang khi có dữ liệu
  useEffect(() => {
    if (categoriesData?.meta?.last_page) {
      setTotalPages(categoriesData.meta.last_page);
    }
  }, [categoriesData]);

  // lọc theo search
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Xem sản phẩm
  const [viewCategoryId, setViewCategoryId] = useState<number | null>(null);
  const [productsData, setProductsData] = useState<{ data: Product[] } | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const handleViewProducts = async (categoryId: number) => {
    setViewCategoryId(categoryId);
    setLoadingProducts(true);
    setShowViewModal(true);
    try {
      const res = await fetchProductsByCategory(categoryId);
      setProductsData(res);
    } catch (err) {
      setProductsData({ data: [] });
    }
    setLoadingProducts(false);
  };

  // Sửa
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug });
    setShowEditModal(true);
  };

  // Xóa
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const handleDelete = (id: number) => {
    setDeleteCategoryId(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (!deleteCategoryId) return;
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Token không tồn tại");
      await axios.delete(`${ADMIN_API.CATEGORIES}/${deleteCategoryId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      await mutate();
      setShowDeleteModal(false);
      setDeleteCategoryId(null);
    } catch (err) {
      console.error("Xoá thất bại", err);
      alert("Xoá thất bại");
    }
  };

  // Thêm/sửa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await putCategory(editingCategory.id, formData);
      } else {
        await postCategory(formData);
      }
      setShowEditModal(false);
      setEditingCategory(null);
      setFormData({ name: "", slug: "" });
      await mutate();
    } catch (err) {
      console.error("Lỗi submit", err);
      alert("Đã xảy ra lỗi khi lưu dữ liệu");
    }
  };

  return (
    <>
      <section className="home">
        <header className="home-header">
          <div className="text">Xin chào Admin</div>
          <div className="search">
            <input
              type="text"
              placeholder="Tìm kiếm danh mục"
              style={{ padding: "5px" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <main className="home-main">
          <div className="home__container two">
            <div
              className="home__container--title"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
              }}
            >
              
              <a href="#">Danh mục sản phẩm</a>
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                style={{
                  padding: "8px 8px",
                  cursor: "pointer",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                + Thêm danh mục
              </button>
            </div>

            <div className="home__container--content">
              {isLoading ? (
                <p>Đang tải...</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên danh mục</th>
                        <th>Slug</th>
                        <th>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.map((category, index) => (
                        <tr key={category.id}>
                          <td>{index + 1}</td>
                          <td>{category.name}</td>
                          <td>{category.slug}</td>
                          
                          <td className="action-buttons">
                            <button
                              className="view"
                              onClick={() => handleViewProducts(category.id)}
                            >
                              Xem
                            </button>
                            <button
                              className="edit"
                              onClick={() => handleEdit(category)}
                            >
                              Sửa
                            </button>
                            <button
                              className="delete"
                              onClick={() => handleDelete(category.id)}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              )}
            </div>
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
        </main>

        {/* Modal Xem sản phẩm */}
        {showViewModal && viewCategoryId !== null && (
          <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 800 }}>
              <h2>Thông tin sản phẩm của danh mục</h2>
              {loadingProducts ? (
                <div>Đang tải sản phẩm...</div>
              ) : productsData && productsData.data.length > 0 ? (
                <>
                    <div style={{ fontWeight: 600, color: '#2563eb', marginBottom: 4 }}>
                      Số lượng sản phẩm: {productsData.data.length}
                    </div>
                    <div style={{ fontWeight: 600, color: '#2563eb', marginBottom: 12 }}>
                      Tổng tồn kho: {productsData.data.reduce((sum, p) => sum + (p.stock_quantity || 0), 0)} sản phẩm
                    </div>
                    <div className="product-grid" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}> 
                      {productsData.data.map((product: Product) => (
                        <div className="product-card" key={product.id} style={{
                          width: 180,
                          border: "1px solid #eee",
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 12,
                          background: "#fff"
                        }}>
                          <img src={product.image} alt={product.name} className="product-image"
                            style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} />
                          <div className="product-name" style={{ fontWeight: 500, marginTop: 8 }}>{product.name}</div>
                          <div style={{ color: '#2563eb', fontWeight: 500, fontSize: 14 }}>
                            Tồn kho: {product.stock_quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                <div>Không có sản phẩm nào trong danh mục này.</div>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: 16 }}
                onClick={() => setShowViewModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Modal Sửa/Thêm danh mục */}
        {showEditModal && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingCategory ? "Sửa danh mục" : "Thêm danh mục"}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Tên danh mục"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
        
                <div className="action-buttons">
                  <button type="submit" className="green" onClick={handleSubmit} style={{ marginRight: 8 }}>Lưu danh mục</button>
                  <button type="button" className="delete" onClick={() => setShowEditModal(false)}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Xác nhận Xóa */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>Xác nhận xóa danh mục</h2>
              <p>Bạn có chắc muốn xóa danh mục này?</p>
              <button className="btn btn-danger" onClick={confirmDelete}>Xóa</button>
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Hủy</button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
