"use client";

import { useState } from "react";
import useSWR from "swr";
// import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCategories, postCategory, putCategory } from "../lib/cartegory";
import { Category } from "../types/cartegory";
import axios from "axios";
import '../style/adminCategory.css'
import Cookies from "js-cookie";
import { fetchProductsByCategoryWithPage } from "../lib/product";
import { Product, PaginatedProducts } from "../types/product";

export default function CategoryPage() {
  const [searchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<{ name: string; slug: string }>({ name: "", slug: "" });
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showProductModal, setShowProductModal] = useState(false);

  const { data: categoriesData, isLoading, mutate } = useSWR("categories", getCategories);
  const categories: Category[] = Array.isArray(categoriesData?.data) ? categoriesData.data : [];
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const { data: productsData, isLoading: loadingProducts } = useSWR<PaginatedProducts>(
    selectedCategoryId !== null ? ["products", selectedCategoryId, currentPage] : null,
    () => fetchProductsByCategoryWithPage(selectedCategoryId!, currentPage) as Promise<PaginatedProducts>
  );

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Token không tồn tại");
      await axios.delete(`http://127.0.0.1:8000/api/v1/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      await mutate();
    } catch (err) {
      console.error("Xoá thất bại", err);
      alert("Xoá thất bại");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await putCategory(editingCategory.id, formData);
      } else {
        await postCategory(formData);
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: "", slug: "" });
      await mutate();
    } catch (err) {
      console.error("Lỗi submit", err);
      alert("Đã xảy ra lỗi khi lưu dữ liệu");
    }
  };

  const openProductModal = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedCategoryId(null);
  };

  return (
    <>
      <style>{`
        .modal-content {
          border-radius: 12px;
          box-shadow: 0 4px 32px #6366f133;
          border: none;
        }
        .modal-header {
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
        }
        .modal-title, .modal-header, .modal-body, .modal-footer, label, input, button, h5, .form-control {
          color: #222 !important;
        }
        .modal-title {
          font-weight: 700;
        }
        .modal-body {
          background: #f9fafb;
        }
        .form-control {
          border-radius: 7px;
          border: 1.5px solid #e5e7eb;
          margin-bottom: 12px;
          color: #222;
        }
        .form-control:focus {
          border: 1.5px solid #2563eb;
          outline: none;
        }
        .btn-close {
          background: #e0e7ff;
          border-radius: 50%;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          color: #2563eb;
          border: none;
          margin-left: 8px;
        }
        .btn-close:hover {
          background: #2563eb;
          color: #fff;
        }
        .btn-primary {
          background: #2563eb;
          border: none;
          font-weight: 600;
        }
        .btn-primary:hover {
          background: #1d4ed8;
        }
        @media (max-width: 600px) {
          .modal-dialog {
            max-width: 98vw;
            margin: 0;
          }
        }
      `}</style>
      <div className="main_content_iner">
        <div className="container-fluid p-0">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="QA_section">
                <div className="white_box_tittle list_header">
                  <h4>Categories</h4>
                  <div className="add_button ms-2">
                    <button className="btn_1" onClick={() => { setShowModal(true); setEditingCategory(null); setFormData({ name: "", slug: "" }); }}>
                      Add New
                    </button>
                  </div>
                </div>

                <div className="QA_table mb_30">
                  <table className="table lms_table_active">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Tên danh mục</th>
                        <th>Slug</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="text-center">Loading...</td>
                        </tr>
                      ) : (
                        filteredCategories.map(category => (
                          <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>{category.slug}</td>
                            <td>
                              <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-info" onClick={() => openProductModal(category.id)}>Xem</button>
                                <button className="btn btn-sm btn-warning" onClick={() => handleEdit(category)}>Sửa</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(category.id)}>Xoá</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {showProductModal && selectedCategoryId && (
                  <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                      <div className="modal-content p-3">
                        <div className="modal-header">
                          <h5 className="modal-title">Sản phẩm của danh mục ID: {selectedCategoryId}</h5>
                          <button type="button" className="btn-close" onClick={closeProductModal}>X</button>
                        </div>
                        <div className="modal-body">
                          {loadingProducts ? (
                            <div>Đang tải sản phẩm...</div>
                          ) : productsData && productsData.data.length > 0 ? (
                            <>
                              <div style={{fontWeight:600, color:'#2563eb', marginBottom:4}}>
                                Số lượng sản phẩm: {productsData.data.length}
                              </div>
                              <div style={{fontWeight:600, color:'#2563eb', marginBottom:12}}>
                                Tổng tồn kho: {productsData.data.reduce((sum, p) => sum + (p.stock_quantity || 0), 0)} sản phẩm
                              </div>
                              <div className="product-grid">
                                {productsData.data.map((product: Product) => (
                                  <div className="product-card" key={product.id}>
                                    <img src={product.image} alt={product.name} className="product-image" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} />
                                    <div className="product-name">{product.name}</div>
                                    <div style={{ color: '#2563eb', fontWeight: 500, fontSize: 14 }}>
                                      Tồn kho: {product.stock_quantity}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="pagination mt-3">
                                <button className="btn btn-outline-primary me-2" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                                  Trang trước
                                </button>
                                <span>Trang {productsData.meta.current_page} / {productsData.meta.last_page}</span>
                                <button className="btn btn-outline-primary ms-2" disabled={currentPage === productsData.meta.last_page} onClick={() => setCurrentPage(p => Math.min(productsData.meta.last_page, p + 1))}>
                                  Trang sau
                                </button>
                              </div>
                            </>
                          ) : (
                            <div>Không có sản phẩm nào cho danh mục này.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content p-3">
                <div className="modal-header">
                  <h5 className="modal-title">{editingCategory ? "Sửa danh mục" : "Thêm danh mục"}</h5>
                  <button type="button" className="btn-close" onClick={() => { setShowModal(false); setEditingCategory(null); }}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <label>Tên danh mục:</label>
                    <input type="text" name="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-control mb-2" />
                    <label>Slug:</label>
                    <input type="text" name="slug" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="form-control mb-2" />
                    <button type="submit" className="btn btn-primary mt-3">
                      {editingCategory ? "Cập nhật" : "Tạo danh mục"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
