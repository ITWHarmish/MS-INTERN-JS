import { createSlice } from "@reduxjs/toolkit";

const telegramSlice = createSlice({
    name: "telegramAuth",
    initialState: {
        telegramUser: null,
    },
    reducers: {
        setTelegramUser: (state, action) => {
            state.telegramUser = action.payload;
        },
        clearTelegramData: (state) => {
            state.telegramUser = null;
        },
    },
})

export const { setTelegramUser, clearTelegramData } = telegramSlice.actions;

export default telegramSlice.reducer;
