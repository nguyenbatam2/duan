/* eslint-disable @typescript-eslint/no-unused-vars */
import { Author, LoginData } from './../types/auth.d';
import axios from 'axios';
    const API_URL = 'http://127.0.0.1:8000/api/v1/admin/auth'; // Replace with your actual API URL
export const loginUser = async (data: LoginData) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};
