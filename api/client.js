import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const apiClient = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    Authorization: `${process.env.CLICKUP_API_TOKEN}`
  },
});