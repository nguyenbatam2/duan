import axios from "axios";
import Cookies from "js-cookie";
import { Product, PaginatedProducts } from "../types/product";
import { PUBLIC_API, ADMIN_API } from "../../lib/config";

// Lấy danh sách sản phẩm phân trang
export async function getProductsPage(page: number): Promise<PaginatedProducts> {
  const res = await axios.get(
    `${PUBLIC_API.PRODUCTS}/?per_page=16&page=${page}`
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
    ADMIN_API.PRODUCTS,
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
    ADMIN_API.PRODUCTS,
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
      `${ADMIN_API.PRODUCTS}/${id}`,
      data,
      { headers }
    );
    return res.data;
  } else {
    const res = await axios.put(
      `${ADMIN_API.PRODUCTS}/${id}`,
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

  await axios.delete(`${ADMIN_API.PRODUCTS}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
}
export async function fetchProductsByCategory(categoryId: number, perPage: number = 15) {
  const res = await axios.get(PUBLIC_API.PRODUCTS, {
    params: { category_id: categoryId, per_page: perPage },
  });
  return res.data;

}

export async function fetchProductsByCategoryWithPage(categoryId: number, page: number = 1) {
  const res = await axios.get(`${PUBLIC_API.PRODUCTS}-filter`, {
    params: { category_id: categoryId, page },
  });
  return res.data;
}