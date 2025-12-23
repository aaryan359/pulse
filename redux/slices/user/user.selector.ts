import { RootState } from "@/redux/store";

export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.loading;