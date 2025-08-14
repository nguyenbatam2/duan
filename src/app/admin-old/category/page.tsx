"use client"; // Chỉ thị này đánh dấu đây là một Client Component trong Next.js 13+, nghĩa là nó sẽ được render ở phía trình duyệt để xử lý tương tác người dùng.

import { useState } from "react"; // Import hook 'useState' từ React để quản lý trạng thái trong component.
import useSWR from "swr"; // Import hook 'useSWR' để fetching (lấy) dữ liệu, quản lý cache và revalidation (kiểm tra lại dữ liệu).
import Link from "next/link"; // Import component 'Link' từ Next.js để điều hướng giữa các trang mà không cần tải lại toàn bộ trang.
 // Import file CSS tùy chỉnh cho giao diện.
import 'bootstrap/dist/css/bootstrap.min.css'; // Import toàn bộ thư viện Bootstrap CSS để định kiểu giao diện.
import { getCategories, postCategory, putCategory } from "../lib/cartegory"; // Import các hàm API để lấy, tạo và cập nhật danh mục từ file local.
import { Category } from "../types/cartegory"; // Import định nghĩa kiểu dữ liệu 'Category' từ TypeScript để đảm bảo an toàn kiểu dữ liệu.
import axios from "axios"; // Import thư viện Axios để thực hiện các yêu cầu HTTP (API calls).
import Cookies from "js-cookie"; // Import thư viện 'js-cookie' để làm việc dễ dàng với cookies của trình duyệt.

export default function CategoryPage() { // Định nghĩa component React chức năng 'CategoryPage'.
  // --- Quản lý trạng thái của Component ---
  const [searchQuery, setSearchQuery] = useState<string>(""); // Trạng thái cho chuỗi tìm kiếm, ban đầu là rỗng.
  const [showModal, setShowModal] = useState(false); // Trạng thái điều khiển việc hiển thị modal (pop-up), ban đầu là ẩn.
  const [editingCategory, setEditingCategory] = useState<Category | null>(null); // Trạng thái lưu trữ danh mục đang được chỉnh sửa (nếu có), ban đầu là null.
  const [formData, setFormData] = useState<{ name: string; slug: string }>({ name: "", slug: "" }); // Trạng thái lưu trữ dữ liệu của form (tên và slug), ban đầu là rỗng.

  // --- Lấy dữ liệu danh mục với useSWR ---
  const { data: categoriesData, isLoading, mutate } = useSWR("categories", getCategories); // Sử dụng useSWR để lấy dữ liệu danh mục.
  // "categories": key (khóa) để SWR nhận diện và quản lý cache cho dữ liệu này.
  // getCategories: hàm sẽ được gọi để fetching dữ liệu.
  // data: categoriesData: dữ liệu trả về từ API.
  // isLoading: trạng thái cho biết dữ liệu có đang được tải hay không.
  // mutate: hàm dùng để yêu cầu SWR re-fetch (tải lại) dữ liệu một cách thủ công.
  
  const categories: Category[] = Array.isArray(categoriesData?.data) ? categoriesData.data : []; // Đảm bảo 'categories' luôn là một mảng, trích xuất dữ liệu từ response hoặc là mảng rỗng nếu không có dữ liệu.

  // --- Lọc danh mục theo tìm kiếm ---
  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) // Lọc danh mục mà tên của chúng chứa chuỗi tìm kiếm (không phân biệt hoa thường).
  );

  // --- Các hàm xử lý sự kiện (Handlers) ---

  // Xử lý khi click vào nút "Sửa"
  const handleEdit = (category: Category) => {
    setEditingCategory(category); // Đặt danh mục hiện tại là danh mục đang chỉnh sửa.
    setFormData({ name: category.name, slug: category.slug }); // Điền dữ liệu của danh mục vào form.
    setShowModal(true); // Hiển thị modal chỉnh sửa.
  };

  // Xử lý khi click vào nút "Xoá"
  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get("token"); // Lấy token xác thực từ cookie.
      if (!token) throw new Error("Token không tồn tại"); // Nếu không có token, ném lỗi.

      await axios.delete(`http://127.0.0.1:8000/api/v1/admin/categories/${id}`, { // Gửi yêu cầu DELETE đến API để xóa danh mục.
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header Authorization để xác thực.
          Accept: "application/json",
        },
      });
      await mutate();  // Gọi mutate() để re-fetch dữ liệu, cập nhật lại danh sách sau khi xóa thành công.
    } catch (err) {
      console.error("Xoá thất bại", err); // Ghi lỗi ra console nếu xóa thất bại.
      alert("Xoá thất bại"); // Hiển thị thông báo lỗi cho người dùng.
    }
  };

  // Xử lý khi gửi form (Thêm mới hoặc Cập nhật)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form (tải lại trang).
    try {
      if (editingCategory) { // Nếu đang ở chế độ chỉnh sửa (editingCategory có giá trị).
        await putCategory(editingCategory.id, formData); // Gọi hàm putCategory để cập nhật danh mục.
      } else { // Nếu đang ở chế độ thêm mới.
        await postCategory(formData); // Gọi hàm postCategory để tạo danh mục mới.
      }
      setShowModal(false); // Ẩn modal sau khi submit thành công.
      setEditingCategory(null); // Đặt lại editingCategory về null.
      setFormData({ name: "", slug: "" }); // Xóa dữ liệu trong form.
      await mutate(); // Gọi mutate() để re-fetch dữ liệu, cập nhật lại danh sách.
    } catch (err) {
      console.error("Lỗi submit", err); // Ghi lỗi ra console.
      alert("Đã xảy ra lỗi khi lưu dữ liệu"); // Hiển thị thông báo lỗi cho người dùng.
    }
  };

  // --- JSX (Giao diện người dùng) ---
  return (
    <>
      <style>{`
        .main_content_iner {
          background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
          min-height: 100vh;
        }
        .QA_table.mb_30 {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 16px #0001;
          overflow: hidden;
          margin-bottom: 32px;
        }
        .QA_table th, .QA_table td {
          padding: 13px 20px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 1.04rem;
        }
        .QA_table th {
          background: #f1f5f9;
          font-weight: 600;
          color: #2563eb;
          border-bottom: 2px solid #e0e7ff;
          font-size: 1.08rem;
        }
        .QA_table tr:last-child td {
          border-bottom: none;
        }
        .btn_1 {
          border: none;
          border-radius: 7px;
          padding: 8px 22px;
          font-size: 1.05rem;
          font-weight: 600;
          background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%);
          color: #fff;
          box-shadow: 0 2px 8px #6366f122;
          transition: background 0.15s, color 0.15s, box-shadow 0.15s;
        }
        .btn_1:hover {
          background: #2563eb;
          color: #fff;
          box-shadow: 0 4px 16px #6366f133;
        }
        .btn-info {
          background: #e0e7ff;
          color: #2563eb;
          border: none;
          font-weight: 500;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
        }
        .btn-info:hover {
          background: #2563eb;
          color: #fff;
        }
        .btn-warning {
          background: #fef9c3;
          color: #b45309;
          border: none;
          font-weight: 500;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
        }
        .btn-warning:hover {
          background: #fde68a;
          color: #a16207;
        }
        .btn-danger {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          font-weight: 500;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
        }
        .btn-danger:hover {
          background: #dc2626;
          color: #fff;
        }
        .serach_field_2 input[type="text"] {
          border-radius: 7px;
          border: 1.5px solid #e5e7eb;
          padding: 9px 16px;
          font-size: 1.04rem;
          margin-right: 12px;
          width: 240px;
          background: #f8fafc;
          transition: border 0.15s, background 0.15s;
        }
        .serach_field_2 input[type="text"]:focus {
          border: 1.5px solid #6366f1;
          outline: none;
          background: #fff;
        }
        .dashboard_header h3 {
          font-size: 2.1rem;
          font-weight: 700;
          color: #22223b;
          margin-bottom: 0.5rem;
          letter-spacing: 0.5px;
        }
        .list_header h4 {
          font-size: 1.35rem;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 0.5rem;
        }
        .add_button {
          display: flex;
          align-items: center;
        }
        @media (max-width: 900px) {
          .QA_table th, .QA_table td { padding: 8px 8px; font-size: 0.97rem; }
          .btn_1 { padding: 7px 12px; font-size: 0.97rem; }
          .serach_field_2 input[type="text"] { width: 120px; font-size: 0.97rem; }
          .dashboard_header h3 { font-size: 1.3rem; }
          .list_header h4 { font-size: 1.05rem; }
        }
      `}</style>
      <div className="main_content_iner"> {/* Container chính của nội dung */}
        <div className="container-fluid p-0">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="dashboard_header mb_50"> {/* Header của Dashboard */}
                <div className="row">
                  <div className="col-lg-6">
                  
                  </div>
                  <div className="col-lg-6 text-end">
                   
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="QA_section"> {/* Phần quản lý QA (Quality Assurance) hoặc bảng dữ liệu chung */}
                <div className="white_box_tittle list_header">
                  <h4>Categories</h4> {/* Tiêu đề phần danh mục */}
                  <div className="box_right d-flex lms_block">
                    <div className="serach_field_2"> {/* Phần tìm kiếm */}
                      <form onSubmit={(e) => e.preventDefault()}> {/* Form tìm kiếm, ngăn chặn tải lại trang khi submit */}
                        
                      </form>
                    </div>
                    <div className="add_button ms-2"> {/* Nút "Add New" (Thêm mới) */}
                      <button
                        className="btn_1"
                        onClick={() => { // Khi click, hiển thị modal và reset form để thêm mới.
                          setShowModal(true);
                          setEditingCategory(null);
                          setFormData({ name: "", slug: "" });
                        }}
                      >
                        Add New
                      </button>
                    </div>
                  </div>
                </div>

                <div className="QA_table mb_30"> {/* Bảng hiển thị danh mục */}
                  <table className="table lms_table_active">
                    <thead> {/* Header của bảng */}
                      <tr>
                        <th>Id</th>
                        <th>Tên danh mục</th>
                        <th>Slug</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody> {/* Body của bảng */}
                      {isLoading ? ( // Nếu dữ liệu đang tải.
                        <tr>
                          <td colSpan={4} className="text-center">Loading...</td> {/* Hiển thị thông báo tải */}
                        </tr>
                      ) : ( // Nếu dữ liệu đã tải xong.
                        filteredCategories.map(category => ( // Duyệt qua mảng danh mục đã lọc để hiển thị từng hàng.
                          <tr key={category.id}> {/* Mỗi hàng là một danh mục, dùng id làm key. */}
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>{category.slug}</td>
                            <td>
                              <div className="d-flex gap-2"> {/* Các nút hành động */}
                                <Link href={`/admin/categories/${category.id}`} className="btn btn-sm btn-info">Xem</Link> {/* Nút xem chi tiết */}
                                <button className="btn btn-sm btn-warning" onClick={() => handleEdit(category)}>Sửa</button> {/* Nút sửa, gọi handleEdit */}
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(category.id)}>Xoá</button> {/* Nút xóa, gọi handleDelete */}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* --- Modal Thêm/Sửa Danh mục --- */}
          <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}> {/* Modal overlay, hiển thị khi showModal là true. */}
            <div className="modal-dialog">
              <div className="modal-content p-3">
                <div className="modal-header">
                  <h5 className="modal-title">{editingCategory ? "Sửa danh mục" : "Thêm danh mục"}</h5> {/* Tiêu đề modal động */}
                  <button type="button" className="btn-close" onClick={() => { setShowModal(false); setEditingCategory(null); }}></button> {/* Nút đóng modal */}
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}> {/* Form thêm/sửa, khi submit gọi handleSubmit */}
                    <label>Tên danh mục:</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name} // Giá trị input được điều khiển bởi formData.name.
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} // Cập nhật formData.name khi người dùng nhập.
                      className="form-control mb-2"
                    />
                    <label>Slug:</label>
                    <input
                      type="text"
                      name="slug"
                      required
                      value={formData.slug} // Giá trị input được điều khiển bởi formData.slug.
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })} // Cập nhật formData.slug khi người dùng nhập.
                      className="form-control mb-2"
                    />
                    <button type="submit" className="btn btn-primary mt-3">
                      {editingCategory ? "Cập nhật" : "Tạo danh mục"} {/* Văn bản nút submit động */}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* --- Kết thúc Modal --- */}
        </div>
      </div>
    </>
  );
}