import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetTimelogs } from "../../services/timelogAPI";

export const fetchTimelogs = createAsyncThunk("fetchTimelogs", async () => {
    const res = await GetTimelogs();
    return res;
})