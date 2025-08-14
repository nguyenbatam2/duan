import axios from "axios";
import Cookies from "js-cookie";
import { Product, PaginatedProducts } from "../types/product";

// Lấy danh sách sản phẩm phân trang
export async function getProductsPage(page: number): Promise<PaginatedProducts> {
  const res = await axios.get(
    `http://127.0.0.1:8000/api/v1/public/products/?per_page=16&page=${page}`
  );
  return res.data as PaginatedProducts;
}

// Thêm sản phẩm (gửi JSON) - dùng khi KHÔNG có upload file
export async function postProductsPage(data: {
  name: string;
  slug: string;
  description: string;
  status: number;
  product_type: string;
  price: string;
  stock_quantity: number;
  image: string;
}): Promise<Product> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");

  const res = await axios.post(
    "http://127.0.0.1:8000/api/v1/admin/products",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  console.log("res", res.data);
  return res.data;
}

// Thêm sản phẩm (dùng FormData, hỗ trợ upload ảnh, mảng images, variants)
export async function postProductFormData(formData: FormData): Promise<Product> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");

  const res = await axios.post(
    "http://127.0.0.1:8000/api/v1/admin/products",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        // Không set Content-Type, axios sẽ tự động set multipart/form-data
      },
    }
  );
  return res.data;
}

// Sửa sản phẩm (PUT)
export async function updateProduct(id: number, data: FormData | object): Promise<Product> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");

  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
  if (!isFormData) headers["Content-Type"] = "application/json";

  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
    const res = await axios.post(
      `http://127.0.0.1:8000/api/v1/admin/products/${id}`,
      data,
      { headers }
    );
    return res.data;
  } else {
    const res = await axios.put(
      `http://127.0.0.1:8000/api/v1/admin/products/${id}`,
      data,
      { headers }
    );
    return res.data;
  }
}

// Xoá sản phẩm (DELETE)
export async function deleteProduct(id: number): Promise<void> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");

  await axios.delete(`http://127.0.0.1:8000/api/v1/admin/products/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
}


