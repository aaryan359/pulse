import { ServerService } from "@/api/server";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

export const fetchServers = createAsyncThunk(
  "server/fetchAll",
  async (_, thunkAPI) => {
    try {

      const response = await ServerService.getserver();

      return response.data;

    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to load servers";

        Toast.show({
            type: "error",
            text1: "Server fetch failed",
            text2: message,
        });

      return thunkAPI.rejectWithValue(message);
    }
  }
);
