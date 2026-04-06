'use client';
import { User } from "@/models/user";
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: <User | null>null,
    isLoggedIn: false,
    token: <null | string>null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user || state.user;
      state.isLoggedIn = action.payload.isLoggedIn ?? state.isLoggedIn;
      state.token = action.payload.token ?? state.token;
    },
    register: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = false;
      state.token = null;
    },
    logout: (state) => {
      Cookies.remove("user");

      // Clear auth state
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;

      // Remove the user session cookie
    },
    updateWallet: (state, action) => {
      if (state.user && state.user.wallet) {
        state.user.wallet.credits += action.payload.credits;
      }
    },
  },
});

export const { login, register, logout, updateWallet } = authSlice.actions;
export default authSlice.reducer;
