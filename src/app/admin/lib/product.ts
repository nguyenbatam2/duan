import axios from "axios";
import Cookies from "js-cookie";
import { Product, PaginatedProducts } from "../types/product";
import { PUBLIC_API, ADMIN_API } from "../../lib/config";

// Lấy header kèm token admin
const getAuthHeader = () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token không tồn tại");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

/**
 * 📌 Lấy danh sách sản phẩm (Admin)
 * GET /api/v1/admin/products?per_page=16&page=1
 */
export async function getProductsPage(page: number = 1): Promise<PaginatedProducts> {
  const res = await axios.get(
    `${ADMIN_API.PRODUCTS}?per_page=10&page=${page}`,
    { headers: getAuthHeader() }
  );
  return res.data as PaginatedProducts;
}

/**
 * 📌 Thêm sản phẩm (JSON body - khi không upload ảnh)
 * POST /api/v1/admin/products
 */
export async function createProduct(data: {
  name: string;
  description?: string;
  status: number;            // 0: ẩn, 1: hiển thị
  product_type: string;      // simple | variable ...
  price: number;
  discount?: number;
  stock_quantity: number;
  category_id: number;
  image?: string;
  images?: string[];
  variants?: object[];
}): Promise<Product> {
  const res = await axios.post(ADMIN_API.PRODUCTS, data, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
  return res.data.data as Product;
}


export async function createProductForm(formData: FormData): Promise<Product> {
  const res = await axios.post(ADMIN_API.PRODUCTS, formData, {
    headers: {
      ...getAuthHeader(),
      // Không set "Content-Type" thủ công, axios sẽ tự thêm
    },
  });

  return res.data.data as Product;
}



export async function getProductDetail(id: number): Promise<Product> {
  const res = await axios.get(`${ADMIN_API.PRODUCTS}/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data.data as Product;
}


export async function updateProduct(id: number, data: object | FormData): Promise<Product> {
  const headers = getAuthHeader();

  if (typeof FormData !== "undefined" && data instanceof FormData) {
    data.append("_method", "PUT"); // method override cho backend Laravel
    const res = await axios.post(`${ADMIN_API.PRODUCTS}/${id}`, data, { headers });
    return res.data.data as Product;
  }

  const res = await axios.put(`${ADMIN_API.PRODUCTS}/${id}`, data, { headers });
  return res.data.data as Product;
}


export async function deleteProduct(id: number): Promise<void> {
  await axios.delete(`${ADMIN_API.PRODUCTS}/${id}`, {
    headers: getAuthHeader(),
  });
}

/* ==============================
   Public API (khách hàng)
============================== */


export async function searchProducts(query: string, page: number): Promise<Product[]> {
  const res = await axios.get<{
    data: Product[];
  }>(
    `${PUBLIC_API.PRODUCTS}-search?query=${encodeURIComponent(
      query
    )}`
  );
  return res.data.data as Product[];
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
