import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetTelegram } from "../../services/telegramAPI";

export const fetchTelegram = createAsyncThunk("fetchTelegram", async () => {
    const res = await GetTelegram();
    return res;
})