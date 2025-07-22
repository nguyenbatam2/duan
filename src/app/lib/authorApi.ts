// lib/authorApi.ts

import axios from "axios";
import Cookies from "js-cookie";
import { RegisterData, LoginData } from "../types/author";
const API_URL = "http://127.0.0.1:8000/api/v1/auth";
const API_PassWord = "http://127.0.0.1:8000/api/v1/password";


export const registerUser = async (data: RegisterData) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};

export const logoutUser = async () => {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");

  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  if (!token) throw new Error("Token không hợp lệ");

  const response = await axios.post(
    `${API_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  Cookies.remove("author");
  return response.data;
};

export const requestOtp = async (email: string) => {
  const response = await axios.post(`${API_PassWord}/request-otp`,{ email }
  );
  return response.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await axios.post(`${API_PassWord}/verify-otp`, {
    email,
    otp,
  });
  return res.data;
};

export const resetPassword = async (
  email: string,
  otp: string,
  new_password: string,
  new_password_confirmation: string
) => {
  const response = await axios.post(`${API_PassWord}/reset`, {
    email,
    otp,
    new_password,
    new_password_confirmation,
  });
  return response.data;
};


export const changePassword = async (
  current_password: string,
  new_password: string,
  new_password_confirmation: string
) => {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");

  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  if (!token) throw new Error("Token không hợp lệ");

  const response = await axios.post(
    `http://127.0.0.1:8000/api/v1/user/change-password`,
    {
      current_password, 
      new_password,
      new_password_confirmation,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  return response.data;
};

export const updateUserAddress = async (address: string) => {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");

  const parsed = JSON.parse(cookieData);
  const token = parsed.token;

  if (!token) throw new Error("Token không hợp lệ");

  const response = await axios.patch(
    "http://127.0.0.1:8000/api/v1/user/address",
    { address },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return response.data;
};

export const updateUserAvatar = async (avatarFile: File) => {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;
  if (!token) throw new Error("Token không hợp lệ");

  const formData = new FormData();
  formData.append('avatar', avatarFile);

  const response = await axios.post(
    "http://127.0.0.1:8000/api/v1/auth/update-avatar",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// Địa chỉ user CRUD
export interface UserAddress {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address: string;
  is_default: number;
  created_at: string;
  updated_at: string;
}

export async function getUserAddresses(): Promise<UserAddress[]> {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;
  const res = await axios.get("http://127.0.0.1:8000/api/v1/user/addresses", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return (res.data as { data: UserAddress[] }).data;
}

export async function addUserAddress(data: { name: string; phone: string; address: string; is_default?: number }): Promise<UserAddress> {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;
  const res = await axios.post("http://127.0.0.1:8000/api/v1/user/addresses", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return (res.data as { data: UserAddress }).data;
}

export async function updateUserAddressById(id: number, data: { name: string; phone: string; address: string; is_default?: number }): Promise<UserAddress> {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;
  const res = await axios.put(`http://127.0.0.1:8000/api/v1/user/addresses/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return (res.data as { data: UserAddress }).data;
}

export async function deleteUserAddress(id: number): Promise<void> {
  const cookieData = Cookies.get("author");
  if (!cookieData) throw new Error("Không có token");
  const parsed = JSON.parse(cookieData);
  const token = parsed.token;
  await axios.delete(`http://127.0.0.1:8000/api/v1/user/addresses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
}