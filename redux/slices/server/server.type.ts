import { Server } from "@/types/server.type";

export interface ServerState {
  servers: Server[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}