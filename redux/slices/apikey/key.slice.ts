import { createSlice } from "@reduxjs/toolkit";
import { fetchApiKeys, revokeApiKeyThunk } from "./key.thunk";
import { ApiKeyState } from "./key.type";


const initialState: ApiKeyState = {
    keys: [],
    loading: false,
};

const apiKeySlice = createSlice({
    name: "apikey",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApiKeys.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchApiKeys.fulfilled, (state, action) => {
                state.keys = action.payload;
                state.loading = false;
            })
            .addCase(revokeApiKeyThunk.fulfilled, (state, action) => {
                state.keys = state.keys.map((k) =>
                    k.id === action.payload ? { ...k, revoked: true } : k
                );
            })
            .addCase(fetchApiKeys.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default apiKeySlice.reducer;
