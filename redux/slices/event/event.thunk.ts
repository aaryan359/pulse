
import { EventService } from "@/api/event";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEvents = createAsyncThunk(
    "event/fetch",
    async (severity?: string) => {
        console.log(" evetns serverty",severity)
        const res = await EventService.getevents(severity);
        console.log(" evetns data from backend in serve",res.data.data)
        return res.data;
    }
)
