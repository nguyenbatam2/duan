import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import {OrderItem} from '@/app/types/coupon'
import { USER_API } from "./config";

const API_URL = USER_API.ORDERS;


export async function getOrders(page = 1): Promise<any> {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  const res = await axios.get(`${API_URL}?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data.data ?? res.data;
}

export async function getOrdersById(id: number) {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");

  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  const res = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return res.data;
}



export async function cancelOrder(id: number) {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");

  const { token } = JSON.parse(cookieData);

  const res = await axios.post(
    `${API_URL}/${id}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}

export async function getOrdersTotal() {
  const orders: { price: number; quantity: number }[] = await getOrders();
  return orders.reduce(
    (total: number, item: { price: number; quantity: number }) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
}



export const applyCoupon = async (
  coupon_code: string,
  items: { product_id: number; price: number; quantity: number }[],
  subtotal: number,
  shipping_fee: number,
  tax: number,
  payment_method: string
) => {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");

  const { token } = JSON.parse(cookieData);

  // Format items chuẩn BE yêu cầu
  const formattedItems = items.map((item) => ({
    product_id: item.product_id,
    price: item.price,
    quantity: item.quantity,
  }));

  const payload = {
    coupon_code,
    payment_method,
    subtotal,
    shipping_fee,
    tax,
    items: formattedItems,
  };

  try {
    const response = await axios.post(
      `${API_URL}/apply-coupon`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Áp mã giảm giá thành công!");
    return response.data; // BE trả về: coupon_id, discount, total,...
  } catch (error) {
    console.error("❌ Lỗi áp mã giảm giá:", error);
    toast.error("Áp mã giảm giá thất bại!");
    throw error;
  }
};


export async function placeOrder(
  items: OrderItem[],
  name: string,
  phone: string,
  address: string,
  email: string,
  payment_method: string,
  coupon_code: string | null,
  notes: string,
  subtotal: number,
  shipping_fee: number,
  tax: number,
  discount: number,
  total: number
): Promise<any> {
  try {
    const cookieData = Cookies.get("author");
    if (!cookieData) throw new Error("Không có token");

    const { token } = JSON.parse(cookieData);

    // Format theo VNPAY_PAYMENT_FLOW.md
    const formattedItems = items.map((item) => ({
      product_id: item.product_id,
      variant_id: null, // optional
      quantity: item.quantity,
      price: item.price,
      product_name: item.product_name || `Product ${item.product_id}` // Sử dụng product_name từ item
    }));

    // Payload theo đúng format BE yêu cầu trong VNPAY_PAYMENT_FLOW.md
    const payload = {
      items: formattedItems,
      name,
      phone,
      address,
      email,
      payment_method, // "cod", "online_payment"
      coupon_code: coupon_code ?? null,
      subtotal,
      shipping_fee,
      tax,
      discount,
      total,
      notes
    };

    console.log("📦 Payload gửi BE:", JSON.stringify(payload, null, 2));
    console.log("🔗 API URL:", `${API_URL}/place-order`);
    console.log("🔑 Token:", token ? 'Present' : 'Missing');

    const res = await axios.post(
      `${API_URL}/place-order`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Đặt hàng thành công:", res.data);
    
    // Xử lý response theo VNPAY_PAYMENT_FLOW.md
    if (payment_method === 'online_payment') {
      // Kiểm tra response format cho online payment
      if (res.data.success && res.data.data && res.data.data.payment_url) {
        const paymentUrl = res.data.data.payment_url;
        console.log("🔗 Redirecting to VNPay:", paymentUrl);
        
        // Kiểm tra URL hợp lệ
        if (!paymentUrl.includes('vnpayment.vn')) {
          console.error("❌ Invalid VNPay URL:", paymentUrl);
          toast.error("URL thanh toán không hợp lệ!");
          return res.data;
        }
        
        // Redirect đến VNPay
        window.location.href = paymentUrl;
        return res.data;
      } else {
        console.error("❌ Invalid payment response:", res.data);
        toast.error("Không thể tạo thanh toán. Vui lòng thử lại!");
        return res.data;
      }
    } else {
      // COD payment - không cần redirect
      console.log("💰 COD payment - no redirect needed");
      return res.data;
    }
    
  } catch (err: any) {
    console.error("❌ Lỗi đặt hàng:", err);
    console.error("🚨 Error details:", {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      config: {
        url: err.config?.url,
        method: err.config?.method,
      }
    });
    
    // Xử lý lỗi cụ thể
    if (err.response?.status === 422) {
      const errorData = err.response.data;
      if (errorData?.message?.includes('không đủ số lượng') || errorData?.message?.includes('chỉ còn')) {
        toast.error("Sản phẩm không đủ số lượng trong kho!");
        return;
      }
    }
    
    throw err;
  }
}

