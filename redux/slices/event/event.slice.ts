import { createSlice } from "@reduxjs/toolkit"

import { fetchEvents } from "./event.thunk"
import { EventState } from "./event.type"


const initialState: EventState = {
  events: [],
  loading: false,
}

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchEvents.rejected, (state) => {
        state.loading = false
      })
  },
})

export default eventSlice.reducer
