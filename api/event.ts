import apiClient from "@/config/client";


export const EventService = {

    async getevents (severity?: string)  {
        const res = await apiClient.get("/api/v1/events/list", {params: severity ? { severity } : undefined})
        return res.data;
    }
}