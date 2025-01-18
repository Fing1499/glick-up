import { apiClient } from "./client.js"

const get = async (endpoint) => {
  console.log(process.env.BASE_URL)
  console.log(process.env.CLICKUP_API_TOKEN)
  try {
    const response = await apiClient.get(endpoint)
    return response.data;
  } catch (err) {
    console.error(err)
    throw err;
  }
}

export default get;