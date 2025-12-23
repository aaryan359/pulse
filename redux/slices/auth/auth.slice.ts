// store/auth/auth.slice.ts
import { createSlice } from "@reduxjs/toolkit";
import { removeToken } from "./auth.helper";
import { checkAuth, loginUser, registerUser } from "./auth.thunk";
import { AuthState } from "./auth.type";


const initialState: AuthState = {
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      isCheckingAuth: true,
};



const authSlice = createSlice({
    name: "auth",
    initialState,
        reducers: {

          logout(state) {
              state.user = null;
              state.token = null;
              state.isAuthenticated = false;
              state.error = null;
              removeToken();
          },
    },
      extraReducers: builder => {
        builder
          // LOGIN
          .addCase(loginUser.pending, state => {
            state.loading = true;
            state.error = null;
            state.isCheckingAuth = false;
          })
          .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isCheckingAuth = false;
          })
          .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.isCheckingAuth = false;
          })

          // REGISTER
          .addCase(registerUser.pending, state => {
            state.loading = true;
            state.error = null;
            state.isCheckingAuth = false;
          })
          .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isCheckingAuth = false;
          })
          .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.isCheckingAuth = false;
          })



          // CHECK AUTH (BOOTSTRAP)
          .addCase(checkAuth.pending, state => {
            state.isCheckingAuth = true;
          })
          .addCase(checkAuth.fulfilled, (state) => {
            state.isAuthenticated = true;
            state.isCheckingAuth = false;
          })
          .addCase(checkAuth.rejected, state => {
            state.isAuthenticated = false;
            state.isCheckingAuth = false;
          });
          },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
