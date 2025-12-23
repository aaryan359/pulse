import apiClient from "@/config/client";


export const ServerService = {

    async getserver() {
        const response = await apiClient.get("/api/v1/stats/servers");
        console.log(" server service", response.data)
        return response.data;
    },

    async getstatsOverView() {
        const response = await apiClient.get("/api/v1/stats/overview");
        return response.data;
    },

    async getOverview(serverId: number) {
        return apiClient.get(`/api/v1/stats/servers/${serverId}/overview`);
    },

    async getContainers(serverId: number) {
        return apiClient.get(`/api/v1/stats/servers/${serverId}/containers`);
    },

    async getMetrics(serverId: number, interval: "1m" | "5m" | "1h" = "1h") {
        return apiClient.get(`/api/v1/stats/servers/${serverId}/metrics?interval=${interval}`);
    },

    async getContainerDetails(containerId: number) {
        return apiClient.get(`/api/v1/stats/containers/${containerId}`);
    }
};