import axios from "axios";
import { Author } from "@/app/types/author";
import Cookies from "js-cookie";

export function getLoggedInAuthor(): Author | null {
  const cookieData = Cookies.get("author");
  if (!cookieData) return null;
  try {
    return JSON.parse(cookieData) as Author;
  } catch {
    return null;
  }
}

export async function getAuthorsRegister(
  name: string,
  email: string,
  phone: string,
  password: string,
  passwordConfirmation: string
): Promise<Author> {
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/auth/register", {
      name,
      email,
      phone,
      password,
      password_confirmation: passwordConfirmation,
    });
    return res.data.user;
  } catch (error) {
    console.error("Error registering author:", error);
    throw error;
  }
}

export async function getAuthorLogin(
  email: string,
  password: string
): Promise<Author> {
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/auth/login", {
      email,
      password,
    });
    return res.data.user as Author;
  } catch (error) {
    console.error("Error logging in author:", error);
    throw error;
  }
}


export const logoutUser = async () => {
  const token = Cookies.get("author");
  if (!token) throw new Error("Không có token");

  const response = await axios.post(
    "http://127.0.0.1:8000/api/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  return response.data;
};