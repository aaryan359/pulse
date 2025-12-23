import { Server } from "@/types/server.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchServers } from "./server.thunk";
import { ServerState } from "./server.type";

const initialState: ServerState = {
    servers: [],
    loading: false,
    error: null,
    lastFetched: null,
};

const serverSlice = createSlice({
    name: "server",
    initialState,
    reducers: {
        clearServers(state) {
            state.servers = [];
            state.loading = false;
            state.error = null;
            state.lastFetched = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // FETCH SERVERS
            .addCase(fetchServers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchServers.fulfilled,
                (state, action: PayloadAction<Server[]>) => {
                    state.loading = false;
                    state.servers = action.payload;
                    state.lastFetched = Date.now();
                }
            )
            .addCase(fetchServers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearServers } = serverSlice.actions;
export default serverSlice.reducer;
