"use client";
import { useEffect, useState } from "react";
import {
  getProductsPage,
  createProductForm,
  updateProduct,
  deleteProduct,
  searchProducts
} from "../lib/product";
import toast from "react-hot-toast";
import { getCategories } from "../lib/cartegory";
import { Product } from "@/app/types/product";
import { Category } from "../types/cartegory";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // ✅ tổng số trang
  const [query, setQuery] = useState(""); // ✅ từ khóa tìm kiếm


  const [isAddformOpen, setIsAddformOpen] = useState(false);
  const [isEditformOpen, setIsEditformOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productType, setProductType] = useState<string>("");
  const [sortType, setSortType] = useState<string>("name-asc");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<any>({
    name: "",
    description: "",
    status: 1,
    product_type: "simple",
    base_price: "",
    display_price: "",
    stock_quantity: "",
    category_id: "",
    images: [],
  });
  const [editProduct, setEditProduct] = useState<any>(null);

  // 📌 Load sản phẩm & danh mục
  useEffect(() => {
    loadProducts();
    getCategories().then((res) => setCategories(res.data || []));
  }, [page, query]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadProducts();
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounce);
  }, [page, query]);

  const loadProducts = async () => {
    try {
      let res;
      if (query.trim()) {
        res = await searchProducts(query, page); // ✅ tìm kiếm có phân trang
      } else {
        res = await getProductsPage(page); // ✅ load mặc định
      }

      setProducts(res.data || []);
      setTotalPages(res.meta?.last_page || 1);
    } catch (error) {
      console.error("Lỗi load sản phẩm:", error);
    }
  };



  // 📌 Xem chi tiết
  const handleViews = (id: number) => {
    const p = products.find((p) => p.id === id);
    setSelectedProduct(p || null);
    setIsModalOpen(true);
  };

  // 📌 Thêm sản phẩm
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // bắt buộc
      formData.append("name", newProduct.name || "");
      formData.append("status", String(newProduct.status ?? 1));
      formData.append("product_type", newProduct.product_type || "simple");
      formData.append("price", String(newProduct.price || 0));
      formData.append("category_id", String(newProduct.category_id || 0));

      // optional
      if (newProduct.description) {
        formData.append("description", newProduct.description);
      }
      if (newProduct.discount) {
        formData.append("discount", String(newProduct.discount));
      }
      if (newProduct.stock_quantity) {
        formData.append("stock_quantity", String(newProduct.stock_quantity));
      }

      // images[]
      (newProduct.images || []).forEach((img: File) => {
        formData.append("images[]", img);
      });

      // variants[]
      (newProduct.variants || []).forEach((variant: any, i: number) => {
        formData.append(`variants[${i}][name]`, variant.name);
        formData.append(`variants[${i}][price]`, String(variant.price));
        formData.append(`variants[${i}][stock]`, String(variant.stock));
        formData.append(`variants[${i}][sku]`, variant.sku);
        if (variant.image) {
          formData.append(`variants[${i}][image]`, variant.image);
        }
      });

      // Debug log trước khi gửi
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await createProductForm(formData);

      setIsAddformOpen(false);
      setNewProduct({
        name: "",
        description: "",
        status: 1,
        product_type: "simple",
        price: "",
        discount: "",
        stock_quantity: "",
        category_id: "",
        images: [],
        variants: [],
      });

      toast.success("Thêm sản phẩm thành công");
      loadProducts();
    } catch (error: any) {
      console.error("Lỗi thêm sản phẩm:", error.response?.data || error.message);
      toast.error("Thêm sản phẩm thất bại");
    }
  };



  // 📌 Edit
  const handleEdit = (id: number) => {
    const p = products.find((p) => p.id === id);
    if (!p) return;
    setEditProduct(p);
    setIsEditformOpen(true);
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    try {
      const formData = new FormData();
      Object.keys(editProduct).forEach((key) => {
        if (key === "images") {
          (editProduct.images || []).forEach((img: File) =>
            formData.append("images[]", img)
          );
        } else {
          formData.append(key, editProduct[key]);
        }
      });

      await updateProduct(editProduct.id, formData);
      setIsEditformOpen(false);
      loadProducts();
      toast.success("Chỉnh sửa sản phẩm thành công");
    } catch (error) {
      toast.error("Lỗi sửa sản phẩm");
      console.error("Lỗi sửa sản phẩm:", error);
    }
  };

  // 📌 Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      toast.error("Lỗi xoá sản phẩm");
      console.error("Lỗi xoá sản phẩm:", error);
    }
  };

  return (
    <section className="home">
      <header className="home-header">
        <div className="text">Xin chào Admin</div>
        <div className="search">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            style={{ padding: "5px" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="home-main">
        <div
          className="home__container two">
          <div
            className="home__container--title"
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
              <div className="col">
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  style={{
                    padding: "5px",
                    borderRadius: "4px",
                    marginRight: "10px",
                    width: "350px"
                  }}
                >
                  <option value="">Tất cả</option>
                  <option value="simple">Sản phẩm đơn giản</option>
                  <option value="configurable">Sản phẩm có thể cấu hình</option>
                </select>
              </div>
              <div className="col" style={{ display: "flex", alignItems: "center", gap: "10px", width: "350px" }}>
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  style={{
                    padding: "5px",
                    borderRadius: "4px",
                  }}
                >
                  <option value="name-asc">A-Z</option>
                  <option value="name-desc">Z-A</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                </select>
              </div>
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
                {products
                  .filter(item => !productType || item.product_type === productType)
                  .slice()
                  .sort((a, b) => {
                    switch (sortType) {
                      case "name-asc":
                        return a.name.localeCompare(b.name);
                      case "name-desc":
                        return b.name.localeCompare(a.name);
                      case "price-asc":
                        return Number(a.base_price) - Number(b.base_price);
                      case "price-desc":
                        return Number(b.base_price) - Number(a.base_price);
                      default:
                        return b.id - a.id;
                    }
                  })
                  .map((item, index) => (
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


      {/* Modal xem chi tiết */}
      {isModalOpen && selectedProduct && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Chi tiết sản phẩm</h2>
            <img
              src={selectedProduct.image || ""}
              alt={selectedProduct.name}
              width="100"
            />
            <p>
              <strong>Tên:</strong> {selectedProduct.name}
            </p>
            <p>
              <strong>Giá:</strong> {selectedProduct.base_price} VND
            </p>
            <p>
              <strong>Giảm giá:</strong>{" "}
              {Number(selectedProduct.display_price).toLocaleString()} đ
            </p>
            <p>
              <strong>Tồn kho:</strong> {selectedProduct.stock_quantity}
            </p>
            <p>
              <strong>Danh mục:</strong>{" "}
              {selectedProduct.category.name}
            </p>
            <p>
              <strong>Mô tả:</strong>{" "}
              {selectedProduct.description || "Không có mô tả"}
            </p>
            <div className="action-buttons">
              <button className="delete" onClick={() => setIsModalOpen(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Form thêm */}
      {isAddformOpen && (
        <form className="add-product-form" onSubmit={handleAddProduct}>
          <h3>Thêm sản phẩm mới</h3>
          <input
            type="text"
            placeholder="Tên sản phẩm"
            required
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Giá"
            required
            value={newProduct.base_price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, base_price: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Giảm giá"
            value={newProduct.display_price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, display_price: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Tồn kho"
            required
            value={newProduct.stock_quantity}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock_quantity: e.target.value })
            }
          />
          <select
            required
            value={newProduct.category_id}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category_id: e.target.value })
            }
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Mô tả"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                images: e.target.files ? Array.from(e.target.files) : [],
              })
            }
          />
          <div className="action-buttons">
            <button type="submit" className="view">Lưu sản phẩm</button>
            <button type="button" className="delete" onClick={() => setIsAddformOpen(false)}>
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Form sửa */}
      {isEditformOpen && editProduct && (
        <form className="add-product-form" onSubmit={handleEditProduct}>
          <h3>Sửa sản phẩm</h3>
          <input
            type="text"
            placeholder="Tên"
            required
            value={editProduct.name}
            onChange={(e) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Giá"
            required
            value={editProduct.price}
            onChange={(e) =>
              setEditProduct({ ...editProduct, price: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Giảm giá"
            value={editProduct.discount}
            onChange={(e) =>
              setEditProduct({ ...editProduct, discount: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Tồn kho"
            required
            value={editProduct.stock_quantity}
            onChange={(e) =>
              setEditProduct({
                ...editProduct,
                stock_quantity: e.target.value,
              })
            }
          />
          <select
            required
            value={editProduct.category_id}
            onChange={(e) =>
              setEditProduct({ ...editProduct, category_id: e.target.value })
            }
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              console.log(cat),
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Mô tả"
            value={editProduct.description}
            onChange={(e) =>
              setEditProduct({ ...editProduct, description: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setEditProduct({
                ...editProduct,
                images: e.target.files ? Array.from(e.target.files) : [],
              })
            }
          />
          <div className="action-buttons">
            <button type="submit" className="view">Lưu sản phẩm</button>
            <button type="button" className="delete" onClick={() => setIsEditformOpen(false)}>
              Hủy
            </button>
          </div>
        </form>
      )}

    </section>

  );
};
