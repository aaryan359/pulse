import apiClient from "@/config/client";


export const UserService = {

    async getuser() {
        const res = await apiClient.get("/api/v1/users/me");
        return res.data;
    },
}