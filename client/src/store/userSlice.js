import { createSlice } from "@reduxjs/toolkit";
import Cookie from "js-cookie";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: Cookie.get("username") || "",
    userId: Cookie.get("userId") || "",
  },

  reducers: {
    onSuccessfulLogin: (state, action) => {
      state.username = action.payload.username;
      state.userId = action.payload.userId;
    },
  },
});

export const { onSuccessfulLogin } = userSlice.actions;

export default userSlice.reducer;
