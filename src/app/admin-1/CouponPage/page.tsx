"use client";
import { getAllCoupons, addCoupon, updateCouponStatus } from "../lib/useCoupon";
import { getProductsPage } from "../lib/product";
import { getCategories } from "../lib/cartegory";
import { useState, useEffect } from "react";
import { Coupon } from "../types/coupon";
import { Product } from "../types/product";
import { Category } from "../types/cartegory";

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

  useEffect(() => {
    async function loadVouchers() {
      try {
        const data = await getAllCoupons();
        setVouchers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi không xác định khi lấy coupon");
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    }
    loadVouchers();
  }, []);

  // Load sản phẩm/danh mục khi scope đổi
  useEffect(() => {
    if (form.scope === "product") {
      (async () => {
        const res = await getProductsPage(1);
        setProductOptions(res.data || []);
      })();
    } else if (form.scope === "category") {
      (async () => {
        const res = await getCategories();
        setCategoryOptions(Array.isArray(res.data) ? res.data : []);
      })();
    }
  }, [form.scope]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked, multiple, options } = e.target as any;
    if (type === "checkbox") {
      setForm((prev: any) => ({ ...prev, [name]: checked }));
    } else if (multiple) {
      const vals = Array.from(options).filter((o: any) => o.selected).map((o: any) => o.value);
      setForm((prev: any) => ({ ...prev, [name]: vals }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    // Validate logic FE
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }
    setSubmitting(true);
    try {
      // Chuẩn hoá dữ liệu gửi đi
      const payload = {
        ...form,
        value: +form.value,
        max_discount: form.max_discount ? +form.max_discount : undefined,
        shipping_discount: form.shipping_discount ? +form.shipping_discount : undefined,
        shipping_discount_percent: form.shipping_discount_percent ? +form.shipping_discount_percent : undefined,
        min_order_value: form.min_order_value ? +form.min_order_value : undefined,
        max_order_value: form.max_order_value ? +form.max_order_value : undefined,
        usage_limit: form.usage_limit ? +form.usage_limit : undefined,
        only_once_per_user: !!form.only_once_per_user,
        first_time_only: !!form.first_time_only,
        free_shipping: !!form.free_shipping,
        is_active: !!form.is_active,
        target_ids: Array.isArray(form.target_ids) ? form.target_ids.map(Number) : [],
        allowed_rank_ids: Array.isArray(form.allowed_rank_ids) ? form.allowed_rank_ids.map(Number) : [],
        allowed_payment_methods: form.allowed_payment_methods,
        allowed_regions: form.allowed_regions,
        time_rules: form.time_rules,
      };
      await addCoupon(payload);
      setShowModal(false);
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
      const data = await getAllCoupons();
      setVouchers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Lỗi tạo coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await updateCouponStatus(id);
      setLoading(true);
      const data = await getAllCoupons();
      setVouchers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      alert("Lỗi cập nhật trạng thái: " + (err instanceof Error ? err.message : ""));
    }
  };

  return (
    <div className="coupon-modern-bg">
      <div className="coupon-modern-container">
        <div className="coupon-modern-header">
          <h2 className="coupon-modern-title gradient-text">Quản lý mã giảm giá</h2>
          <button className="coupon-modern-btn" onClick={() => setShowModal(true)}>+ Thêm coupon</button>
        </div>
      {loading ? (
          <div className="coupon-modern-loading">Đang tải...</div>
      ) : error ? (
          <div className="coupon-modern-error">{error}</div>
      ) : (
          <div className="coupon-modern-table-wrap">
            <table className="coupon-modern-table">
          <thead>
                <tr>
                  <th>ID</th>
                  <th>Code</th>
                  <th>Tên</th>
                  <th>Mô tả</th>
                  <th>Loại</th>
                  <th>Giá trị</th>
                  <th>Miễn phí ship</th>
                  <th>Giảm ship (VNĐ)</th>
                  <th>Giảm ship (%)</th>
                  <th>Đơn tối thiểu</th>
                  <th>Đơn tối đa</th>
                  <th>Giới hạn lượt</th>
                  <th>Đã dùng</th>
                  <th>Chỉ 1 lần/user</th>
                  <th>Chỉ cho lần đầu</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
                {Array.isArray(vouchers) && vouchers.map((v) => (
              <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.code}</td>
                    <td>{v.name}</td>
                    <td>{v.description}</td>
                    <td>{v.type}</td>
                    <td>{v.value}</td>
                    <td>{v.free_shipping ? "✅" : ""}</td>
                    <td>{v.shipping_discount ?? ""}</td>
                    <td>{v.shipping_discount_percent ?? ""}</td>
                    <td>{v.min_order_value}</td>
                    <td>{v.max_order_value ?? ""}</td>
                    <td>{v.usage_limit ?? ""}</td>
                    <td>{v.used_count ?? ""}</td>
                    <td>{v.only_once_per_user ? "✅" : ""}</td>
                    <td>{v.first_time_only ? "✅" : ""}</td>
                    <td>{v.start_at ? new Date(v.start_at).toLocaleString() : ""}</td>
                    <td>{v.end_at ? new Date(v.end_at).toLocaleString() : ""}</td>
                    <td>
                      <button
                        className={`coupon-modern-btn coupon-modern-btn-light`}
                        style={{padding: '4px 12px', fontSize: '0.97em', border: v.is_active ? '1.5px solid #22c55e' : '1.5px solid #e5e7eb', color: v.is_active ? '#22c55e' : '#888', background: v.is_active ? '#e0fce6' : '#f1f5f9'}}
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
          </div>
      )}
      {/* Modal thêm coupon */}
      {showModal && (
          <div className="coupon-modern-modal-bg">
            <div className="coupon-modern-modal">
              <div className="coupon-modern-modal-header">
                <h3>Thêm coupon mới</h3>
                <button className="coupon-modern-btn-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="coupon-modern-form">
                <div className="coupon-modern-modal-body">
                  {formError && <div className="coupon-modern-error">{formError}</div>}
                  <label className="required">Mã code</label>
                  <input name="code" required className={`coupon-modern-input${formError && !form.code ? " input-error" : ""}`} value={form.code} onChange={handleChange} maxLength={50} />
                  {formError && !form.code && <div className="coupon-modern-error-inline">Bắt buộc nhập mã code</div>}
                  <label>Mô tả</label>
                  <textarea name="description" className="coupon-modern-input" value={form.description} onChange={handleChange} maxLength={500}></textarea>
                  <label className="required">Loại</label>
                  <select name="type" className={`coupon-modern-input${formError && !form.type ? " input-error" : ""}`} value={form.type} onChange={handleChange} required>
                    {TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  {formError && !form.type && <div className="coupon-modern-error-inline">Bắt buộc chọn loại</div>}
                  <label className="required">Giá trị</label>
                  <input name="value" type="number" required className={`coupon-modern-input${formError && (!form.value || isNaN(+form.value)) ? " input-error" : ""}`} value={form.value} onChange={handleChange} min={0} max={form.type==="percent"?100:undefined} />
                  {formError && (!form.value || isNaN(+form.value)) && <div className="coupon-modern-error-inline">Bắt buộc nhập giá trị hợp lệ</div>}
                  {/* max_discount chỉ cho nhập khi type là fixed */}
                  {form.type === "fixed" && (
                    <>
                      <label>Giảm tối đa</label>
                      <input name="max_discount" type="number" className="coupon-modern-input" value={form.max_discount} onChange={handleChange} min={0} />
                    </>
                  )}
                  <label className="required">Phạm vi</label>
                  <select name="scope" className={`coupon-modern-input${formError && !form.scope ? " input-error" : ""}`} value={form.scope} onChange={handleChange} required>
                    {SCOPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  {formError && !form.scope && <div className="coupon-modern-error-inline">Bắt buộc chọn phạm vi</div>}
                  {/* target_ids: chỉ hiện khi scope=product/category, dùng multi-select */}
                  {form.scope === "product" && (
                    <>
                      <label>Chọn sản phẩm áp dụng</label>
                      <select
                        name="target_ids"
                        className="coupon-modern-input"
                        multiple
                        value={form.target_ids}
                        onChange={e => {
                          const vals = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                          setForm(f => ({ ...f, target_ids: vals }));
                        }}
                      >
                        {productOptions.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </>
                  )}
                  {form.scope === "category" && (
                    <>
                      <label>Chọn danh mục áp dụng</label>
                      <select
                        name="target_ids"
                        className="coupon-modern-input"
                        multiple
                        value={form.target_ids}
                        onChange={e => {
                          const vals = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                          setForm(f => ({ ...f, target_ids: vals }));
                        }}
                      >
                        {categoryOptions.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </>
                  )}
                  {/* Trường vận chuyển chỉ hiện khi scope=shipping */}
                  {form.scope === "shipping" && (
                    <>
                      <label>Miễn phí ship</label>
                      <input name="free_shipping" type="checkbox" className="coupon-modern-checkbox" checked={!!form.free_shipping} onChange={handleChange} />
                  <label>Giảm ship (VNĐ)</label>
                      <input name="shipping_discount" type="number" className="coupon-modern-input" value={form.shipping_discount} onChange={handleChange} min={0} />
                  <label>Giảm ship (%)</label>
                      <input name="shipping_discount_percent" type="number" className="coupon-modern-input" value={form.shipping_discount_percent} onChange={handleChange} min={0} max={100} />
                    </>
                  )}
                  {/* Các trường điều kiện đơn hàng chỉ hiện khi scope khác shipping */}
                  {form.scope !== "shipping" && (
                    <>
                      <label>Đơn tối thiểu</label>
                      <input name="min_order_value" type="number" className="coupon-modern-input" value={form.min_order_value} onChange={handleChange} min={0} />
                      <label>Đơn tối đa</label>
                      <input name="max_order_value" type="number" className="coupon-modern-input" value={form.max_order_value} onChange={handleChange} min={0} />
                    </>
                  )}
                  <label>Giới hạn lượt</label>
                  <input name="usage_limit" type="number" className="coupon-modern-input" value={form.usage_limit} onChange={handleChange} min={0} />
                  <label>Chỉ 1 lần/user</label>
                  <input name="only_once_per_user" type="checkbox" className="coupon-modern-checkbox" checked={!!form.only_once_per_user} onChange={handleChange} />
                  <label>Chỉ cho lần đầu</label>
                  <input name="first_time_only" type="checkbox" className="coupon-modern-checkbox" checked={!!form.first_time_only} onChange={handleChange} />
                  <label>Rank ID (nếu có, cách nhau dấu phẩy)</label>
                  <input name="allowed_rank_ids" className="coupon-modern-input" value={form.allowed_rank_ids.join(",")} onChange={e => setForm(f => ({ ...f, allowed_rank_ids: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} placeholder="1,2,3" />
                  <label>Ngày bắt đầu</label>
                  <input name="start_at" type="datetime-local" className="coupon-modern-input" value={form.start_at} onChange={handleChange} />
                  <label>Ngày kết thúc</label>
                  <input name="end_at" type="datetime-local" className="coupon-modern-input" value={form.end_at} onChange={handleChange} />
                  <label>Time rules (JSON array)</label>
                  <input name="time_rules" className="coupon-modern-input" value={Array.isArray(form.time_rules) ? JSON.stringify(form.time_rules) : form.time_rules} onChange={e => setForm(f => ({ ...f, time_rules: e.target.value ? JSON.parse(e.target.value) : [] }))} />
                  <label>Phương thức thanh toán</label>
                  <select name="allowed_payment_methods" className="coupon-modern-input" multiple value={form.allowed_payment_methods} onChange={handleChange}>
                    {PAYMENT_METHODS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <label>Vùng áp dụng (nếu có, cách nhau dấu phẩy)</label>
                  <input name="allowed_regions" className="coupon-modern-input" value={form.allowed_regions.join(",")} onChange={e => setForm(f => ({ ...f, allowed_regions: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} placeholder="HCM,HN" />
                  <label>Trạng thái</label>
                  <select name="is_active" className="coupon-modern-input" value={form.is_active ? 1 : 0} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === "1" }))}>
                    <option value={1}>Kích hoạt</option>
                    <option value={0}>Không kích hoạt</option>
                  </select>
                </div>
                <div className="coupon-modern-modal-footer">
                  <button type="button" className="coupon-modern-btn coupon-modern-btn-light" onClick={() => setShowModal(false)} disabled={submitting}>Đóng</button>
                  <button type="submit" className="coupon-modern-btn coupon-modern-btn-primary" disabled={submitting}>{submitting ? "Đang lưu..." : "Lưu"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      <style>{`
        .coupon-modern-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
        }
        .coupon-modern-container {
          max-width: 1340px;
          margin: 0 auto;
          padding: 32px 12px 32px 12px;
        }
        .coupon-modern-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .coupon-modern-title {
          font-size: 1.18rem;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.5px;
        }
        .gradient-text {
          background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .coupon-modern-btn {
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
        .coupon-modern-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, #2563eb 0%, #6366f1 100%);
          box-shadow: 0 4px 16px #6366f133;
        }
        .coupon-modern-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .coupon-modern-btn-light {
          background: #f1f5f9;
          color: #2563eb;
          border: 1.5px solid #e0e7ef;
        }
        .coupon-modern-btn-primary {
          background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%);
          color: #fff;
        }
        .coupon-modern-table-wrap {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px #6366f111;
          padding: 18px 10px 10px 10px;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        .coupon-modern-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 0.97rem;
        }
        .coupon-modern-table th {
          background: linear-gradient(90deg, #e0e7ff 0%, #f1f5f9 100%);
          color: #2563eb;
          font-weight: 600;
          padding: 10px 8px;
          border-top: none;
          border-bottom: 2px solid #6366f1;
        }
        .coupon-modern-table td {
          background: #fff;
          padding: 8px 8px;
          border-bottom: 1px solid #e5e7eb;
          color: #222;
        }
        .coupon-modern-table tr {
          transition: background 0.13s;
        }
        .coupon-modern-table tr:hover {
          background: #f0f4ff;
        }
        .coupon-modern-loading {
          color: #2563eb;
          font-size: 1.1em;
          text-align: center;
          margin: 32px 0;
        }
        .coupon-modern-error {
          color: #ef4444;
          background: #fef2f2;
          border-radius: 6px;
          padding: 7px 10px;
          font-size: 0.97em;
          margin-bottom: 12px;
          text-align: center;
        }
        .coupon-modern-error-inline {
          color: #ef4444;
          font-size: 0.93em;
          margin-top: 2px;
          margin-bottom: 6px;
        }
        /* Modal */
        .coupon-modern-modal-bg {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.18);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .coupon-modern-modal {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 8px 32px #6366f133, 0 1.5px 8px #2563eb22;
          min-width: 380px;
          max-width: 98vw;
          width: 600px;
          padding: 0;
          overflow: hidden;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
        }
        .coupon-modern-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%);
          color: #fff;
          padding: 18px 24px 12px 24px;
        }
        .coupon-modern-btn-close {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .coupon-modern-form {
          padding: 18px 24px 18px 24px;
          overflow-y: auto;
          flex: 1 1 auto;
          display: flex;
          flex-wrap: wrap;
          gap: 0 24px;
        }
        .coupon-modern-modal-body {
          display: flex;
          flex-wrap: wrap;
          gap: 0 24px;
        }
        .coupon-modern-modal-body label {
          font-size: 0.97em;
          color: #2563eb;
          font-weight: 500;
          margin-top: 8px;
          margin-bottom: 2px;
          display: block;
        }
        .coupon-modern-modal-body label.required:after {
          content: " *";
          color: #ef4444;
          font-weight: bold;
        }
        .coupon-modern-modal-body > * {
          flex: 1 1 240px;
          min-width: 220px;
          max-width: 100%;
        }
        .coupon-modern-input, .coupon-modern-checkbox, .coupon-modern-modal-body select {
          margin-bottom: 10px;
        }
        .coupon-modern-input {
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
        .coupon-modern-input:focus {
          border: 1.5px solid #6366f1;
          background: #fff;
        }
        .coupon-modern-input.input-error {
          border: 1.5px solid #ef4444;
          background: #fff0f0;
        }
        .coupon-modern-checkbox {
          margin-left: 8px;
          margin-bottom: 8px;
          accent-color: #6366f1;
        }
        .coupon-modern-modal-footer {
          display: flex;
          flex-direction: row;
          gap: 8px;
          align-items: center;
          justify-content: flex-end;
          padding: 0 24px 18px 24px;
        }
        @media (max-width: 900px) {
          .coupon-modern-bg { padding-left: 54px; }
          .coupon-modern-container { padding: 8px 2vw; }
          .coupon-modern-modal, .coupon-modern-form, .coupon-modern-modal-body { flex-direction: column !important; gap: 0 !important; }
        }
        @media (max-width: 600px) {
          .coupon-modern-modal { min-width: 100vw; width: 100vw; border-radius: 0; }
          .coupon-modern-modal-header, .coupon-modern-form, .coupon-modern-modal-footer { padding-left: 8px; padding-right: 8px; }
          .coupon-modern-modal, .coupon-modern-form, .coupon-modern-modal-body { flex-direction: column !important; gap: 0 !important; }
        }
      `}</style>
    </div>
  );
} 