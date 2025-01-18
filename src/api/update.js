import { apiClient } from "./client.js";


const update = async (endpoint, data) => {
  try {
    const response = await apiClient.update(endpoint, data);
    return response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default update;