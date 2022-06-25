import { createSlice } from "@reduxjs/toolkit";


export const user = createSlice({
    name: "users",
    initialState: {
      id: "2",
      username: "Haseeb",
      isLoggedIn:true,
    },
    reducers: {
      USER_DATA: (state, action) => {
        state.id = action.payload.user_id;
        state.username = action.payload.username;
        state.isLoggedIn = action.payload.isLoggedIn;
      },
      LOGOUT_USER: (state) => {
        state.id=null;
        state.username = "";
        state.isLoggedIn = false;
      },
    },
  });
  
  // Action creators are generated for each case reducer function
  export const { USER_DATA, LOGOUT_USER } = user.actions;
  
  export const userReducer = user.reducer;