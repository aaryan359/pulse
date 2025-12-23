import { User } from "@/types/user.type";

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
