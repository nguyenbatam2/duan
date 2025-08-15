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

    // Đúng format BE yêu cầu
    const formattedItems = items.map((item) => ({
      product_id: item.product_id,
      price: item.price,
      quantity: item.quantity,
    }));

    const payload = {
      items: formattedItems,
      name,
      phone,
      address,
      email,
      payment_method,
      coupon_code: coupon_code ?? null,
      subtotal,
      shipping_fee,
      tax,
      discount,
      total,
      notes,
    };

    console.log("📦 Payload gửi BE:", JSON.stringify(payload, null, 2));
    console.log("🔗 API URL:", `${API_URL}/place-order`);
    console.log("🔑 Token:", token ? 'Present' : 'Missing');
    console.log("📋 Items validation:", {
      itemsCount: formattedItems.length,
      itemsWithPrice: formattedItems.filter(item => item.price > 0).length,
      itemsWithQuantity: formattedItems.filter(item => item.quantity > 0).length,
      totalPrice: formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      items: formattedItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }))
    });

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
    console.log("📊 Response status:", res.status);
    console.log("📋 Response headers:", res.headers);
    
    // Xử lý response cho thanh toán online
    if (res.data.payment && res.data.payment.success && res.data.payment.data.payment_url) {
      const paymentUrl = res.data.payment.data.payment_url;
      console.log("🔗 Redirecting to payment URL:", paymentUrl);
      console.log("🔍 Payment URL Analysis:", {
        isVNPay: paymentUrl.includes('vnpayment.vn'),
        isSandbox: paymentUrl.includes('sandbox'),
        hasParams: paymentUrl.includes('?'),
        urlLength: paymentUrl.length
      });
      
      // Kiểm tra URL trước khi redirect
      if (!paymentUrl.includes('vnpayment.vn')) {
        console.error("❌ Invalid VNPay URL:", paymentUrl);
        toast.error("URL thanh toán không hợp lệ!");
        return res.data;
      }
      
      // Redirect đến VNPay nếu là thanh toán online
      window.location.href = paymentUrl;
      return res.data;
    }
    
    return res.data;
  } catch (err: any) {
    console.error("❌ Lỗi đặt hàng:", err);
    console.error("🚨 Error details:", {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: JSON.stringify(err.response?.data, null, 2),
      config: {
        url: err.config?.url,
        method: err.config?.method,
        headers: err.config?.headers
      }
    });
    throw err;
  }
}

