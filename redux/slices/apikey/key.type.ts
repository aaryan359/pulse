import { ApiKey } from "@/types/apiKey.type";

export interface ApiKeyState {
    keys: ApiKey[];
    loading: boolean;
}