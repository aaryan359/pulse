import apiClient from "@/config/client";


export const ApiKeyService = {
  async list() {
    const response = await apiClient.get("/api/v1/apikey/getkeys");
    return response.data;
  },

  async create(name: string) {
    const response = await apiClient.post("/api/v1/apikey/generatekey", { name });
    return response.data;
  },

  async revoke(id: number) {
    const response =  await apiClient.delete(`/api/v1/apikey/${id}`);
    return response.data;
  },
};