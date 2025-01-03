// redux/googleLoginSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: null,
};

const googleLoginSlice = createSlice({
    name: "googleLogin",
    initialState,
    reducers: {
        setGoogleLogin: (state, action) => {
            state.accessToken = action.payload.accessToken;
        },
    },
});

export const { setGoogleLogin } = googleLoginSlice.actions;
export default googleLoginSlice.reducer;
