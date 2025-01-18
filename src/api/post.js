import { apiClient } from "./client.js";


const post = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default post;