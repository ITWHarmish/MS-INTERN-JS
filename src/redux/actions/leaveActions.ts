import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetLeaveRequests } from "../../services/leaveAPI";

export const fetchLeaves = createAsyncThunk("fetchLeaves", async () => {
    const res = await GetLeaveRequests();
    return res;
})