import { createSlice } from "@reduxjs/toolkit";
import { fetchTelegram } from "../actions/telegramActions";

const telegramSlice = createSlice({
    name: "telegramAuth",
    initialState: {
        loading: false,
        telegramUser: null,
        isError: false,
    },

    reducers: {
        clearTelegramData: (state) => {
            state.telegramUser = null;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchTelegram.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchTelegram.fulfilled, (state, action) => {
            state.loading = false;
            state.telegramUser = action.payload;
        })
        builder.addCase(fetchTelegram.rejected, (state) => {
            state.isError = true;
        })
    }

})

export const { clearTelegramData } = telegramSlice.actions;

export default telegramSlice.reducer;
