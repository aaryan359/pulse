import { RootState } from "@/redux/store"

export const selectEvents = (s: RootState) => s.event.events
export const selectEventLoading = (s: RootState) => s.event.loading

export const selectRecentEvents = (s: RootState) =>  s.event.events.slice(0, 5)
