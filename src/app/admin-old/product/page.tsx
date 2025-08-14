/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { getProductsPage, postProductsPage, postProductFormData, deleteProduct, updateProduct } from "../lib/product";
import { getCategories } from "../lib/cartegory";
import { Product } from "../types/product";
import { Category } from "../types/cartegory";
import Cookies from "js-cookie";

export default function DataTablePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  // Thêm state lưu preview ảnh cho từng biến thể
  const [variantImagePreviews, setVariantImagePreviews] = useState<(string | null)[]>([]);
  
  // Đổi categoryId thành category_id trong state
  const [formData, setFormData] = useState<{discount: string;
  category_id: number;
  id: number;
  name: string;
  slug: string;
  description: string;
  status: number;
  product_type: string;
  price: string;
  stock_quantity: number;
  images: File[];
  image: string;
  average_rating: number | null;
  views_count: number;
  quantity: number;
  variant_id?: number;}>(
  {
    discount: "",
    category_id: 0,
    id: 0,
    name: "",
    slug: "",
    description: "",
    status: 1,
    product_type: "",
    price: "",
    stock_quantity: 0,
    images: [],
    image: "",
    average_rating: null,
    views_count: 0,
    quantity: 0,
    variant_id: undefined
  }
);
  // Thêm state cho edit
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string>("");
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [variantErrors, setVariantErrors] = useState<string[][]>([]);
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const { data: productData, isLoading: loadingProducts, mutate } = useSWR(
    ["products", currentPage],
    () => getProductsPage(currentPage)
  );
  const { data: categoriesData } = useSWR("categories", getCategories);

  const categories: Category[] = Array.isArray(categoriesData?.data) ? categoriesData.data : [];
  const products: Product[] = productData?.data || [];

  const addVariant = () => {
    setVariants([...variants, { name: "", price: 0, stock_quantity: 0, sku: "", image: null }]);
  };

  // Sửa updateVariant để dùng controlled input
  const updateVariant = (index: number, field: string, value: any) => {
    setVariants(prev => {
      const newVariants = [...prev];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return newVariants;
    });
    if (field === "image") {
      if (value && value instanceof File) {
        const url = URL.createObjectURL(value);
        setVariantImagePreviews(prev => {
          const arr = [...prev];
          arr[index] = url;
          return arr;
        });
      } else {
        setVariantImagePreviews(prev => {
          const arr = [...prev];
          arr[index] = null;
          return arr;
        });
      }
    }
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setFormError("");
    setMessage(null);
    setVariantErrors([]);
    if (formData.product_type === "variable" && variants.length === 0) {
      setFormError("Bạn phải thêm ít nhất 1 biến thể cho sản phẩm có biến thể!");
      return;
    }
    // Validate từng dòng biến thể
    if (formData.product_type === "variable") {
      const errors: string[][] = variants.map(variant => {
        const errs: string[] = [];
        if (!variant.name) errs.push("Tên biến thể là bắt buộc");
        if (!variant.price) errs.push("Giá là bắt buộc");
        return errs;
      });
      setVariantErrors(errors);
      if (errors.some(errs => errs.length > 0)) {
        setFormError("Vui lòng kiểm tra lại các biến thể!");
        return;
      }
    }
    // Log formData debug trước khi tạo FormData
    console.log('formData debug', formData);

    const form = e.target;
    const formPayload = new FormData();

    // Append các trường cần thiết
    formPayload.append("name", formData.name);
    formPayload.append("slug", formData.slug);
    formPayload.append("description", formData.description);
    formPayload.append("status", String(formData.status));
    formPayload.append("product_type", formData.product_type);
    formPayload.append("price", formData.price);
    formPayload.append("discount_price", formData.discount);
    formPayload.append("stock_quantity", String(formData.stock_quantity));
    formPayload.append("category_id", String(formData.category_id));
    // Nếu có ảnh mới, append ảnh
    if (formData.images && Array.isArray(formData.images)) {
      formData.images.forEach(file => {
        formPayload.append("images[]", file);
      });
    }
    // Nếu có biến thể
    if (formData.product_type === "variable") {
      variants.forEach((variant, index) => {
        formPayload.append(`variants[${index}][name]`, variant.name);
        formPayload.append(`variants[${index}][price]`, variant.price);
        formPayload.append(`variants[${index}][stock_quantity]`, variant.stock_quantity);
        formPayload.append(`variants[${index}][sku]`, variant.sku);
        if (variant.image) {
          formPayload.append(`variants[${index}][image]`, variant.image);
        }
      });
    }

    // Log dữ liệu gửi đi
    console.log('--- Dữ liệu gửi lên API (FormData) ---');
    for (const [key, value] of formPayload.entries()) {
      console.log(key, value);
    }
    console.log('--- Hết dữ liệu gửi lên ---');

    // Lấy token từ cookie
    const token = Cookies.get("token");
    if (!token) {
      alert("Bạn cần đăng nhập với quyền admin!");
      return;
    }

    try {
      let res;
      if (editingProduct) {
        res = await updateProduct(editingProduct.id, formPayload);
      } else {
        res = await postProductFormData(formPayload);
      }
      setMessage({ type: 'success', text: editingProduct ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công!" });
      setTimeout(() => setMessage(null), 3000);
      handleCloseModal();
      mutate(); // reload lại danh sách sản phẩm
    } catch (err: any) {
      // Log lỗi chi tiết nếu có
      if (err.response) {
        console.error('API error:', err.response.data);
      }
      setMessage({ type: 'error', text: err?.message || "Có lỗi xảy ra!" });
      setTimeout(() => setMessage(null), 4000);
    }
  };

  // Hàm mở modal sửa sản phẩm
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
    // Khi mở modal sửa sản phẩm, setFormData đúng trường category_id
    setFormData({
      discount: product.discount || "",
      category_id: product.category_id || (product.category?.id ?? 0),
      id: product.id,
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      status: typeof product.status === "string"
        ? parseInt(product.status, 10)
        : (typeof product.status === "number" ? product.status : 1),
      product_type: product.product_type || "simple",
      price: product.price || "",
      stock_quantity: product.stock_quantity || 0,
      image: product.image || "",
      average_rating: product.average_rating || null,
      views_count: product.views_count || 0,
      quantity: product.quantity || 0,
      images: [], // Reset images for editing
      variant_id: product.variant_id
    });
  };

  // Hàm xoá sản phẩm
  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) return;
    try {
      await deleteProduct(id);
      setMessage({ type: 'success', text: "Đã xoá sản phẩm!" });
      setTimeout(() => setMessage(null), 3000);
      mutate(); // reload lại danh sách sản phẩm
    } catch (err: any) {
      alert(err?.message || "Lỗi xoá sản phẩm!");
    }
  };

  // Hàm reset toàn bộ form và state liên quan
  const resetProductForm = () => {
    setFormData({
      discount: "",
      category_id: 0,
      id: 0,
      name: "",
      slug: "",
      description: "",
      status: 1,
      product_type: "",
      price: "",
      stock_quantity: 0,
      images: [],
      image: "",
      average_rating: null,
      views_count: 0,
      quantity: 0,
      variant_id: undefined
    });
    setVariants([]);
    setEditingProduct(null);
    setFormError("");
  };

  // Sử dụng reset khi đóng modal hoặc thành công
  const handleCloseModal = () => {
    setShowModal(false);
    resetProductForm();
  };

  return (
    <div className="product-modern-bg">
      <div className="product-modern-container">
        {/* Header */}
        <div className="product-modern-header">
          <h2 className="product-modern-title gradient-text">Quản lý sản phẩm</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/" className="product-modern-btn product-modern-btn-light">Dashboard</Link>
            <button className="product-modern-btn" onClick={() => {
              setShowModal(true);
              setVariants([]);
              setFormData(f => ({ ...f, product_type: "simple" }));
            }}>
              <span style={{fontWeight:600, fontSize:'1.1em'}}>+</span> Thêm sản phẩm
            </button>
          </div>
        </div>
        {/* Table */}
        <div className="product-modern-table-wrap">
          <table className="product-modern-table product-modern-table-compact">
            <thead>
              <tr>
                <th className="center">ID</th>
                <th className="center">Ảnh</th>
                <th>Danh Mục</th>
                <th>Tên</th>
                <th className="center">Loại</th>
                <th>Giá</th>
                <th>Giảm Giá</th>
                <th className="center">Tồn Kho</th>
                <th className="center"></th>
              </tr>
            </thead>
            <tbody>
              {loadingProducts ? (
                <tr><td colSpan={9} className="text-center">Loading...</td></tr>
              ) : (
                products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(product => (
                    <tr key={product.id}>
                      <td className="center">{product.id}</td>
                      <td className="center"><img src={product.image || "https://via.placeholder.com/50"} className="product-modern-img product-modern-img-round" /></td>
                      <td>{product.category?.name || ""}</td>
                      <td>{product.name}</td>
                      <td className="center">{product.product_type}</td>
                      <td>{product.price}</td>
                      <td>{product.discount}</td>
                      <td className="center">{product.stock_quantity}</td>
                      <td className="center">
                        <button className="product-modern-btn product-modern-btn-warning product-modern-btn-icon" onClick={() => handleEditProduct(product)} title="Sửa"><span>sửa</span></button>
                        <button className="product-modern-btn product-modern-btn-danger product-modern-btn-icon" onClick={() => handleDeleteProduct(product.id)} title="Xoá"><span>Xoá</span></button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {productData && productData.meta && (
          <div className="product-modern-pagination product-modern-pagination-compact">
            <button
              className="product-modern-btn product-modern-btn-light product-modern-btn-page"
              disabled={!productData.links.prev}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              &lt;
            </button>
            {Array.from({ length: productData.meta.last_page }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                className={`product-modern-btn product-modern-btn-page${productData.meta.current_page === pageNum ? " active" : ""}`}
                onClick={() => setCurrentPage(pageNum)}
                disabled={productData.meta.current_page === pageNum}
              >
                {pageNum}
              </button>
            ))}
            <button
              className="product-modern-btn product-modern-btn-light product-modern-btn-page"
              disabled={!productData.links.next}
              onClick={() => setCurrentPage(p => Math.min(productData.meta.last_page, p + 1))}
            >
              &gt;
            </button>
          </div>
        )}
        {/* Modal Form */}
        {showModal && (
          <div className="product-modern-modal-bg">
            <div className="product-modern-modal">
              <div className="product-modern-modal-header">
                <h3>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
                <button className="product-modern-btn-close" onClick={handleCloseModal}>×</button>
              </div>
              <form onSubmit={handleFormSubmit} className="product-modern-form">
                <div className="product-modern-modal-body">
                  <label>Tên sản phẩm *</label>
                  <input name="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="product-modern-input" />
                  <label>Mô tả</label>
                  <textarea name="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="product-modern-input"></textarea>
                  <label>Trạng thái *</label>
                  <select name="status" value={formData.status} onChange={e => setFormData({ ...formData, status: parseInt(e.target.value, 10) })} className="product-modern-input" required>
                    <option value={1}>Hiển thị</option>
                    <option value={0}>Ẩn</option>
                  </select>
                  <label>Loại sản phẩm *</label>
                  <select name="product_type" value={formData.product_type} onChange={e => {
                    const value = e.target.value;
                    setFormData({ ...formData, product_type: value });
                    if (value === "simple") {
                      setVariants([]);
                      setVariantImagePreviews([]);
                      setVariantErrors([]);
                    }
                  }} className="product-modern-input" required>
                    <option value="simple">Đơn</option>
                    <option value="variable">Có biến thể</option>
                  </select>
                  <label>Giá *</label>
                  <input type="number" name="price" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} min="0" required className="product-modern-input" />
                  <label>Giảm giá</label>
                  <input type="number" name="discount" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} min="0" className="product-modern-input" />
                  <label>Tồn kho</label>
                  <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={e => setFormData({ ...formData, stock_quantity: parseInt(e.target.value, 10) })} min="0" className="product-modern-input" />
                  <label>ID danh mục *</label>
                  <select name="category_id" value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: parseInt(e.target.value, 10) })} className="product-modern-input" required>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <label>Ảnh sản phẩm</label>
                  <input
                    type="file"
                    name="images[]"
                    multiple
                    className="product-modern-input"
                    onChange={e => setFormData({ ...formData, images: Array.from(e.target.files || []) })}
                  />
                  {formData.images && formData.images.length > 0 && (
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      {formData.images.map((file, idx) => (
                        <img
                          key={idx}
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          style={{ maxWidth: 60, maxHeight: 60, border: "1px solid #ccc", borderRadius: 8 }}
                        />
                      ))}
                    </div>
                  )}
                  {/* Variants */}
                  {formData.product_type === "variable" && (
                    <div className="product-modern-variants">
                      <h6>Biến thể</h6>
                      <table className="product-modern-table product-modern-variant-table">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Tên biến thể *</th>
                            <th>Giá *</th>
                            <th>Tồn kho</th>
                            <th>SKU</th>
                            <th>Ảnh</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {variants.map((variant, index) => (
                            <tr key={index} className="align-middle">
                              <td>{index + 1}</td>
                              <td>
                                <input
                                  className="product-modern-input"
                                  placeholder="Tên biến thể"
                                  required
                                  value={variant.name}
                                  onChange={e => updateVariant(index, "name", e.target.value)}
                                />
                                {variantErrors[index] && variantErrors[index].includes("Tên biến thể là bắt buộc") && (
                                  <div className="product-modern-error">Tên biến thể là bắt buộc</div>
                                )}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="product-modern-input"
                                  placeholder="Giá"
                                  min="0"
                                  required
                                  value={variant.price}
                                  onChange={e => updateVariant(index, "price", e.target.value)}
                                />
                                {variantErrors[index] && variantErrors[index].includes("Giá là bắt buộc") && (
                                  <div className="product-modern-error">Giá là bắt buộc</div>
                                )}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="product-modern-input"
                                  placeholder="Tồn kho"
                                  min="0"
                                  value={variant.stock_quantity}
                                  onChange={e => updateVariant(index, "stock_quantity", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  className="product-modern-input"
                                  placeholder="SKU"
                                  value={variant.sku}
                                  onChange={e => updateVariant(index, "sku", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="product-modern-input"
                                  onChange={e => updateVariant(index, "image", e.target.files?.[0])}
                                />
                                {variantImagePreviews[index] && (
                                  <div className="mt-1">
                                    <img src={variantImagePreviews[index]!} alt="preview" style={{ maxWidth: 48, maxHeight: 48, borderRadius: 4, border: '1px solid #ccc' }} />
                                  </div>
                                )}
                                {!variantImagePreviews[index] && variant.image && typeof variant.image === 'string' && (
                                  <div className="mt-1 text-muted" style={{ fontSize: 12 }}>{variant.image}</div>
                                )}
                              </td>
                              <td>
                                <button type="button" className="product-modern-btn product-modern-btn-danger" onClick={() => removeVariant(index)}>
                                  Xoá
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button type="button" className="product-modern-btn product-modern-btn-success" onClick={addVariant}>+ Thêm biến thể</button>
                    </div>
                  )}
                </div>
                <div className="product-modern-modal-footer">
                  {formError && <div className="product-modern-alert product-modern-alert-danger">{formError}</div>}
                  {message && (
                    <div className={`product-modern-alert product-modern-alert-${message.type}`}>{message.text}</div>
                  )}
                  <button type="submit" className="product-modern-btn product-modern-btn-primary">Lưu sản phẩm</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .product-modern-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
          padding: 0 0 0 0px;
        }
        .product-modern-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 12px 32px 12px;
        }
        .product-modern-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .product-modern-title {
          font-size: 1.18rem;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.5px;
        }
        .product-modern-btn {
          background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 7px 18px;
          font-size: 0.97rem;
          font-weight: 500;
          margin-left: 8px;
          margin-bottom: 2px;
          box-shadow: 0 2px 8px #6366f122;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .product-modern-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, #2563eb 0%, #6366f1 100%);
          box-shadow: 0 4px 16px #6366f133;
        }
        .product-modern-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .product-modern-btn-light {
          background: #f1f5f9;
          color: #2563eb;
          border: 1.5px solid #e0e7ef;
        }
        .product-modern-table-wrap {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px #6366f111;
          padding: 18px 10px 10px 10px;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        .product-modern-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 0.97rem;
        }
        .product-modern-table th {
          background: linear-gradient(90deg, #e0e7ff 0%, #f1f5f9 100%);
          color: #2563eb;
          font-weight: 600;
          padding: 10px 8px;
          border-top: none;
          border-bottom: 2px solid #6366f1;
        }
        .product-modern-table td {
          background: #fff;
          padding: 8px 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        .product-modern-table tr {
          transition: background 0.13s;
        }
        .product-modern-table tr:hover {
          background: #f0f4ff;
        }
        .product-modern-img {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 8px;
          border: 1.5px solid #e0e7ef;
        }
        .product-modern-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin-bottom: 18px;
        }
        /* Modal */
        .product-modern-modal-bg {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.18);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-modern-modal {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 8px 32px #6366f133, 0 1.5px 8px #2563eb22;
          min-width: 380px;
          max-width: 98vw;
          width: 600px;
          padding: 0;
          overflow: hidden;
        }
        .product-modern-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%);
          color: #fff;
          padding: 18px 24px 12px 24px;
        }
        .product-modern-btn-close {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .product-modern-form {
          padding: 18px 24px 18px 24px;
        }
        .product-modern-modal-body label {
          font-size: 0.97em;
          color: #2563eb;
          font-weight: 500;
          margin-top: 8px;
        }
        .product-modern-input {
          width: 100%;
          border-radius: 8px;
          border: 1.5px solid #e0e7ef;
          padding: 8px 10px;
          font-size: 0.97em;
          margin-bottom: 8px;
          background: #f8fafc;
          color: #222;
          outline: none;
          transition: border 0.18s;
        }
        .product-modern-input:focus {
          border: 1.5px solid #6366f1;
          background: #fff;
        }
        .product-modern-modal-footer {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
          padding: 0 24px 18px 24px;
        }
        .product-modern-alert {
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 0.97em;
          margin-bottom: 2px;
        }
        .product-modern-alert-success {
          background: #e0fce6;
          color: #22c55e;
        }
        .product-modern-alert-danger {
          background: #fef2f2;
          color: #ef4444;
        }
        .product-modern-error {
          color: #ef4444;
          font-size: 0.93em;
          margin-top: 2px;
        }
        .product-modern-variants {
          margin-top: 18px;
        }
        .product-modern-variant-table th, .product-modern-variant-table td {
          font-size: 0.95em;
          padding: 6px 6px;
        }
        .gradient-text {
          background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .product-modern-table-compact th, .product-modern-table-compact td {
          font-size: 0.95em;
          padding: 8px 6px;
        }
        .product-modern-table-compact th {
          font-weight: 700;
          background: linear-gradient(90deg, #e0e7ff 0%, #f1f5f9 100%);
          color: #2563eb;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
        }
        .product-modern-table-compact td {
          font-size: 0.97em;
          color: #222;
          background: #fff;
          opacity: 1 !important;
          filter: none !important;
        }
        .product-modern-table-compact tr {
          opacity: 1 !important;
          filter: none !important;
        }
        .product-modern-table-compact tbody {
          opacity: 1 !important;
          filter: none !important;
        }
        .product-modern-table-compact .center {
          text-align: center;
          vertical-align: middle;
        }
        .product-modern-img-round {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border: 1.5px solid #e0e7ef;
          background: #f8fafc;
        }
        .product-modern-btn-icon {
          padding: 6px 10px;
          min-width: 0;
          font-size: 1.08em;
          margin-left: 4px;
          margin-right: 0;
        }
        .product-modern-btn-icon:first-child { margin-left: 0; }
        .product-modern-pagination-compact {
          gap: 2px;
          margin-bottom: 10px;
        }
        .product-modern-btn-page {
          min-width: 30px;
          min-height: 30px;
          font-size: 0.97em;
          padding: 0;
        }
        @media (max-width: 900px) {
          .product-modern-bg { padding-left: 54px; }
          .product-modern-container { padding: 8px 2vw; }
        }
        @media (max-width: 600px) {
          .product-modern-table-compact th, .product-modern-table-compact td { font-size: 0.91em; padding: 6px 2px; }
          .product-modern-header { flex-direction: column; gap: 8px; align-items: flex-start; }
          .product-modern-title { font-size: 1.05rem; }
        }
      `}</style>
    </div>
  );
}