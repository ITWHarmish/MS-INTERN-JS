import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllProgressReport } from "../../services/progressReportAPI";

export const fetchProgressReport = createAsyncThunk("fetchProgressReport", async () => {
    const res = await GetAllProgressReport();
    return res;
})