import { createAsyncThunk } from "@reduxjs/toolkit";

import { AuthService } from "@/api/auth";
import Toast from "react-native-toast-message";
import { removeToken, storeToken } from "./auth.helper";


interface LoginPayload {
  email: string;
  password: string;
}


interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}


export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, thunkAPI) => {

     Toast.show({
      type: "info",
      text1: "Logging you in…",
      });

    try {

      const response = await AuthService.login(payload);



      const { user, token } = response.data;

      // store token securely
      await storeToken(token);


      Toast.show({
        type: "success",
        text1: "Login successful",
        text2: `Welcome back, ${user.name || "User"}!`,
      });

      return { user, token };


    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong. Please try again.";

      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: message,
      });

      return thunkAPI.rejectWithValue(message);
    }
  }
);



export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, thunkAPI) => {
    
    Toast.show({
      type: "info",
      text1: "Creating your account…",
    });

    try {

      const response = await AuthService.register(payload);

      const { user, token } = response.data;

      
      await storeToken(token);

      Toast.show({
        type: "success",
        text1: "Account created ",
        text2: `Welcome, ${user.name || "User"}!`,
      });

      return { user, token };

    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong. Please try again.";

      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: message,
      });

      return thunkAPI.rejectWithValue(message);
    }
  }
);



export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, thunkAPI) => {

    try {
      console.log(" auth thunk");
      await AuthService.checkAuthentication();

      console.log("vrify user can move to the dashboard")
        Toast.show({
          type: "success",
          text1: "verified",
          
        });

        return true;

    } 
    catch (err: any) {

      const message = err?.response?.data?.message
      
      await removeToken();

      Toast.show({
        type: "info",
        text1: "Session expired",
        text2:message
      });

      return thunkAPI.rejectWithValue("Session expired");
    }
  }
);