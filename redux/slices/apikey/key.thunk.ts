import { ApiKeyService } from "@/api/apikey";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchApiKeys = createAsyncThunk(
    "apikey/fetchAll",
    async (_, thunkAPI) => {
        try {
            const res = await ApiKeyService.list();
            return res.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue("Failed to load API keys");
        }
    }
);

export const createApiKey = createAsyncThunk(
    "apikey/create",
    async (name: string, thunkAPI) => {
        try {
            const res = await ApiKeyService.create(name);
            return res.data.apiKey;
        } catch {
            return thunkAPI.rejectWithValue("Failed to create API key");
        }
    }
);

export const revokeApiKeyThunk = createAsyncThunk(
    "apikey/revoke",
    async (id: number, thunkAPI) => {
        try {
            await ApiKeyService.revoke(id);
            return id;
        } catch {
            return thunkAPI.rejectWithValue("Failed to revoke API key");
        }
    }
);
