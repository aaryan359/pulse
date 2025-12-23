import { UserService } from "@/api/user";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const fetchCurrentUser = createAsyncThunk(
    "user/fetchCurrent",
    async (_, thunkAPI) => {
        try {
            const res = await UserService.getuser();
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message || "Failed to load user"
            );
        }
    }
);
