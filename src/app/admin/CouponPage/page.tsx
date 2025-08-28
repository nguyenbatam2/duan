"use client";
import { useState, useEffect } from "react";
import { getAllCoupons, addCoupon, updateCouponStatus } from "../lib/useCoupon";
import { getProductsPage } from "../lib/product";
import { getCategories } from "../lib/cartegory";
import { Coupon } from "../types/coupon";
import { Product } from "../types/product";
import { Category } from "../types/cartegory";
import toast from "react-hot-toast";


const SCOPE_OPTIONS = [
  { value: "order", label: "Toàn đơn hàng" },
  { value: "product", label: "Theo sản phẩm" },
  { value: "category", label: "Theo danh mục" },
  { value: "shipping", label: "Vận chuyển" },
];
const TYPE_OPTIONS = [
  { value: "percent", label: "Phần trăm" },
  { value: "fixed", label: "Cố định" },
];
const PAYMENT_METHODS = [
  { value: "cod", label: "Thanh toán khi nhận hàng" },
  { value: "bank_transfer", label: "Chuyển khoản" },
  { value: "online_payment", label: "Thanh toán online" },
];

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>({
    code: "",
    description: "",
    type: "percent",
    value: 0,
    max_discount: "",
    scope: "order",
    target_ids: [],
    free_shipping: false,
    shipping_discount: "",
    shipping_discount_percent: "",
    min_order_value: "",
    max_order_value: "",
    usage_limit: "",
    only_once_per_user: false,
    first_time_only: false,
    allowed_rank_ids: [],
    start_at: "",
    end_at: "",
    time_rules: [],
    allowed_payment_methods: [],
    allowed_regions: [],
    is_active: true,
  });
  const [formError, setFormError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [productOptions, setProductOptions] = useState<Product[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load coupon có phân trang và search
  useEffect(() => {
    async function loadVouchers() {
      setLoading(true);
      try {
        // getAllCoupons(page, query) phải trả về {data, meta}
        const res = await getAllCoupons(page, query);
        setVouchers(Array.isArray(res.data) ? res.data : []);
        setTotalPages(res.meta?.last_page || res.meta?.pagination?.last_page || 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi không xác định khi lấy coupon");
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    }
    loadVouchers();
  }, [page, query]);

  // Load sản phẩm/danh mục khi scope đổi
  useEffect(() => {
    if (form.scope === "product") {
      getProductsPage(1).then(res => setProductOptions(res.data || []));
    } else if (form.scope === "category") {
      getCategories().then(res => setCategoryOptions(Array.isArray(res.data) ? res.data : []));
    }
  }, [form.scope]);

  // Validate form
  const validateForm = () => {
    if (!form.code || form.code.length > 50) return "Mã code là bắt buộc, tối đa 50 ký tự.";
    if (!form.type || !["percent", "fixed"].includes(form.type)) return "Loại mã giảm giá không hợp lệ.";
    if (form.type === "percent" && (+form.value > 100)) return "Giá trị phần trăm không được vượt quá 100%.";
    if (!form.value || isNaN(+form.value) || +form.value < 0) return "Giá trị giảm giá phải là số >= 0.";
    if (form.max_discount && (+form.max_discount < 0)) return "Giảm tối đa phải >= 0.";
    if (!form.scope || !["order", "product", "category", "shipping"].includes(form.scope)) return "Phạm vi áp dụng không hợp lệ.";
    if (form.scope === "shipping" && !form.free_shipping && !form.shipping_discount && !form.shipping_discount_percent) return "Coupon vận chuyển phải có ít nhất một loại giảm giá vận chuyển.";
    if (form.shipping_discount && (+form.shipping_discount < 0)) return "Giảm ship phải >= 0.";
    if (form.shipping_discount_percent && (+form.shipping_discount_percent < 0 || +form.shipping_discount_percent > 100)) return "Giảm ship (%) phải từ 0-100.";
    if (form.min_order_value && (+form.min_order_value < 0)) return "Đơn tối thiểu phải >= 0.";
    if (form.max_order_value && (+form.max_order_value < 0)) return "Đơn tối đa phải >= 0.";
    if (form.max_order_value && form.min_order_value && (+form.max_order_value <= +form.min_order_value)) return "Đơn tối đa phải lớn hơn đơn tối thiểu.";
    if (form.usage_limit && (+form.usage_limit < 0)) return "Giới hạn lượt phải >= 0.";
    if (form.start_at && form.end_at && new Date(form.end_at) < new Date(form.start_at)) return "Ngày kết thúc phải sau ngày bắt đầu.";
    return "";
  };

  // Thêm coupon
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const err = validateForm();
    if (err) {
      setFormError(err);
      toast.error(err);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: form.code,
        description: form.description || "",
        type: form.type,
        value: Number(form.value),
        max_discount: form.max_discount ? Number(form.max_discount) : undefined,
        scope: form.scope,
        target_ids: form.target_ids?.length ? form.target_ids.map(Number) : [],
        free_shipping: !!form.free_shipping,
        shipping_discount: form.shipping_discount ? Number(form.shipping_discount) : 0,
        shipping_discount_percent: form.shipping_discount_percent ? Number(form.shipping_discount_percent) : 0,
        min_order_value: form.min_order_value ? Number(form.min_order_value) : undefined,
        max_order_value: form.max_order_value ? Number(form.max_order_value) : undefined,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : undefined,
        only_once_per_user: !!form.only_once_per_user,
        first_time_only: !!form.first_time_only,
        allowed_rank_ids: form.allowed_rank_ids?.length ? form.allowed_rank_ids.map(Number) : [],
        start_at: form.start_at || undefined,
        end_at: form.end_at || undefined,
        time_rules: form.time_rules || [],
        allowed_payment_methods: form.allowed_payment_methods || [],
        allowed_regions: form.allowed_regions || [],
        is_active: !!form.is_active,
      };

      await addCoupon(payload);
      toast.success("Thêm coupon thành công!");
      setShowModal(false);
      // Reset form
      setForm({
        code: "",
        description: "",
        type: "percent",
        value: 0,
        max_discount: "",
        scope: "order",
        target_ids: [],
        free_shipping: false,
        shipping_discount: "",
        shipping_discount_percent: "",
        min_order_value: "",
        max_order_value: "",
        usage_limit: "",
        only_once_per_user: false,
        first_time_only: false,
        allowed_rank_ids: [],
        start_at: "",
        end_at: "",
        time_rules: [],
        allowed_payment_methods: [],
        allowed_regions: [],
        is_active: true,
      });
      setLoading(true);
      const res = await getAllCoupons(page, query);
      setVouchers(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err: any) {
      setFormError(err.message || "Lỗi tạo coupon");
      toast.error(err.message || "Lỗi tạo coupon");
    } finally {
      setSubmitting(false);
    }
  };


  // Chuyển trạng thái coupon
  const handleToggleActive = async (id: number) => {
    try {
      await updateCouponStatus(id);
      toast.success("Cập nhật trạng thái thành công!");
      setLoading(true);
      const res = await getAllCoupons(page, query);
      setVouchers(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      toast.error("Lỗi cập nhật trạng thái: " + (err instanceof Error ? err.message : ""));
    }
  };

  // Thêm hàm handleChange nếu chưa có
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked, multiple, options } = e.target as any;
    if (type === "checkbox") {
      setForm((f: any) => ({ ...f, [name]: checked }));
    } else if (multiple) {
      setForm((f: any) => ({
        ...f,
        [name]: Array.from(options).filter((o: any) => o.selected).map((o: any) => o.value)
      }));
    } else {
      setForm((f: any) => ({ ...f, [name]: value }));
    }
  };

  return (
    <section className="home">
      <header className="home-header">
        <div className="text">Quản lý mã giảm giá</div>
        <div className="search">
          <input
            type="text"
            placeholder="Tìm kiếm coupon"
            style={{ padding: "5px" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>
      <main className="home-main">
        <div className="home__container two">
          <div className="home__container--title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a href="#">Danh sách coupon</a>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              style={{
                padding: "8px 8px",
                cursor: "pointer",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              + Thêm coupon
            </button>
          </div>
          <div className="home__container--content">
            {loading ? (
              <p>Đang tải...</p>
            ) : (
                <table>
                  <thead>
                    <tr>
                      <th style={{ minWidth: "39px", maxWidth: "80px" }}>ID</th>
                      <th style={{ minWidth: "100px", maxWidth: "200px" }}>Code</th>
                      <th style={{ minWidth: "200px", maxWidth: "300px" }}>Mô tả</th>
                      <th style={{ minWidth: "100px", maxWidth: "150px" }}>Loại</th>
                      <th style={{ minWidth: "100px", maxWidth: "150px" }}>Giá trị</th>
                      <th style={{ minWidth: "100px", maxWidth: "150px" }}>Miễn phí ship</th>
                      <th style={{ minWidth: "100px", maxWidth: "150px" }}>Giảm ship (VNĐ)</th>
                      <th style={{ minWidth: "100px", maxWidth: "150px" }}>Giảm ship (%)</th>
                      <th style={{ minWidth: "100px", maxWidth: "150px" }}>Đơn tối thiểu</th>
                      <th style={{ minWidth: "100px", maxWidth: "150px" }}>Đơn tối đa</th>
                      <th style={{ minWidth: "100px", maxWidth: "150px" }}> Giảm tối đa</th>
                      <th style={{ minWidth: "100px", maxWidth: "150px" }}>Giới hạn lượt</th>
                      {/* <th>Đã dùng</th> */}
                      {/* <th>Chỉ 1 lần/user</th>
                      <th>Chỉ cho lần đầu</th> */}
                      {/* <th>Ngày bắt đầu</th>
                      <th>Ngày kết thúc</th> */}
                      <th style={{ minWidth: "177px", maxWidth: "250px" }}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(vouchers) && vouchers.map((v, index) => (
                      console.log(v, index),
                      <tr key={v.id}>
                          <td>{(page - 1) * 10 + index + 1}</td>
                          <td>{v.code}</td>
                          <td>{v.description}</td>
                          <td>{v.type}</td>
                          <td>{v.type === "percent" ? `${Number(v.value).toLocaleString()}%` : `${Number(v.value).toLocaleString()}đ`}</td>
                          <td>{v.free_shipping ? "X" : ""}</td>
                          <td>{Number(v.shipping_discount).toLocaleString() + "đ"}</td>
                          <td>{Number(v.shipping_discount_percent) ? `${v.shipping_discount_percent}%` : ""}</td>
                          <td>{Number(v.min_order_value).toLocaleString() + "đ"}</td>
                          <td>{v.max_order_value ? Number(v.max_order_value).toLocaleString() + "đ" : ""}</td>
                          <td>{v.max_discount ? Number(v.max_discount).toLocaleString() + "đ" : ""}</td>
                          <td>{v.usage_limit ? Number(v.usage_limit).toLocaleString() : ""}</td>
                          {/* <td>{v.used_count ?? ""}</td> */}
                          {/* <td>{v.only_once_per_user ? "X" : ""}</td>
                      <td>{v.first_time_only ? "X" : ""}</td> */}
                          {/* <td>{v.start_at ? new Date(v.start_at).toLocaleString() : ""}</td>
                      <td>{v.end_at ? new Date(v.end_at).toLocaleString() : ""}</td> */}
                          <td>
                            <button
                              className={`coupon-modern-btn coupon-modern-btn-light`}
                            style={{
                              padding: '4px 12px',
                              fontSize: '0.97em',
                              border: v.is_active ? '1.5px solid #22c55e' : '1.5px solid #e5e7eb',
                              color: v.is_active ? '#22c55e' : '#888',
                              background: v.is_active ? '#e0fce6' : '#f1f5f9'
                            }}
                            onClick={() => handleToggleActive(v.id)}
                            title="Chuyển đổi trạng thái"
                          >
                            {v.is_active ? "Kích hoạt" : "Không kích hoạt"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )}
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{ marginRight: "8px" }}
              >
                Trang trước
              </button>
              <span>
                Trang {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                style={{ marginLeft: "8px" }}
              >
                Trang sau
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* Modal thêm coupon */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Thêm coupon mới</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Left */}
              <div className="form-group">
                <label>Mã code <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  name="code"
                  placeholder="Nhập mã code"
                  value={form.code}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rank ID </label>
                <input
                  type="text"
                  name="allowed_rank_ids"
                  value={form.allowed_rank_ids.join(",")}
                  onChange={e => setForm(f => ({ ...f, allowed_rank_ids: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                  placeholder="1,2,3"
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  placeholder="Mô tả chi tiết"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row" style={{ display: "flex", gap: "12px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Ngày bắt đầu</label>
                  <input
                    type="datetime-local"
                    name="start_at"
                    value={form.start_at}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Ngày kết thúc</label>
                  <input
                    type="datetime-local"
                    name="end_at"
                    value={form.end_at}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Loại <span style={{ color: "red" }}>*</span></label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                >
                  {TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Giá trị <span style={{ color: "red" }}>*</span></label>
                <input
                  type="number"
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phương thức thanh toán</label>
                <select
                  name="allowed_payment_methods"
                  multiple
                  value={form.allowed_payment_methods}
                  onChange={handleChange}
                >
                  {PAYMENT_METHODS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Phạm vi <span style={{ color: "red" }}>*</span></label>
                <select
                  name="scope"
                  value={form.scope}
                  onChange={handleChange}
                  required
                >
                  {SCOPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Vùng áp dụng </label>
                <input
                  type="text"
                  name="allowed_regions"
                  value={form.allowed_regions.join(",")}
                  onChange={e => setForm(f => ({ ...f, allowed_regions: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                  placeholder="HCM,HN"
                />
              </div>
              <div className="form-row" style={{ display: "flex", gap: "12px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Đơn tối thiểu</label>
                  <input
                    type="number"
                    name="min_order_value"
                    value={form.min_order_value}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Đơn tối đa</label>
                  <input
                    type="number"
                    name="max_order_value"
                    value={form.max_order_value}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  name="is_active"
                  value={form.is_active ? 1 : 0}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.value === "1" }))}
                >
                  <option value={1}>Kích hoạt</option>
                  <option value={0}>Không kích hoạt</option>
                </select>
              </div>
              <div className="form-group">
                <label>Giới hạn lượt</label>
                <input
                  type="number"
                  name="usage_limit"
                  value={form.usage_limit}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    name="free_shipping"
                    checked={!!form.free_shipping}
                    onChange={handleChange}
                    style={{ marginLeft: "200px", marginTop: "-10px", opacity: 1, "!important": true, width: "auto" }}
                  />
                  Miễn phí ship
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="only_once_per_user"
                    checked={!!form.only_once_per_user}
                    onChange={handleChange}
                    style={{ marginLeft: "200px", marginTop: "-10px", opacity: 1, "!important": true, width: "auto" }}
                  />
                  Chỉ 1 lần/user
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="first_time_only"
                    checked={!!form.first_time_only}
                    onChange={handleChange}
                    style={{ marginLeft: "200px", marginTop: "-10px", opacity: 1, "!important": true, width: "auto" }}
                  />
                  Chỉ cho lần đầu
                </label>
              </div>

              <div className="action-buttons" style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                <button type="button" className="delete" onClick={() => setShowModal(false)} disabled={submitting}>Đóng</button>
                <button type="submit" className="green" disabled={submitting}>{submitting ? "Đang lưu..." : "Lưu"}</button>
              </div>
            </form>
          </div>
        </div>
      )
      }
    </section>
  );
}