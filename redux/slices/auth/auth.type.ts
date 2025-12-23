import { User } from "@/types/user.type";

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean,
}
