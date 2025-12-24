
import apiClient from "@/config/client";


export const TerminalService = {

    async terminalsessionstart(serverId: string) {
        console.log(" teminal api call",serverId)
        const response = await apiClient.post("/api/v1/terminal/session", { serverId });

        return response.data;
    },
}