import apiClient from "@/config/client";


export const AuthService = {
    async register(data: any) {
           
            const response = await apiClient.post("/api/v1/users/register", data);            
            console.log(" response from backend is ", response.data)
            return response.data;
    },

    async login(data: any) {
        
            const response = await apiClient.post("/api/v1/users/login", data);
            console.log(" response from backend is ", response.data)
            return response.data;
        
    },

    async googleLogin(idToken: string, user: any) {
            const response = await apiClient.post("/api/v1/users/auth/google", { idToken ,user});
            return response.data;
    },


    forgotPassword: async (email: string) => {
        try {
            const response = await apiClient.post("/api/v1/users/forgot-password", { email });
            return response;
        } catch (error: any) {
            console.error("Forgot Password Error:", error);
            throw error.response?.data || error;
        }
    },
    checkAuthentication: async () => {

           
            const response = await apiClient.get("/api/v1/users/check");
            return response.data;
    },
   
}