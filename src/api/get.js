import { apiClient } from "./client.js"

const get = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint)
    return response.data;
  } catch (err) {
    console.error(err)
    throw err;
  }
}

export default get;