import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetPolicies } from "../../services/hrPolicyAPI";

export const fetchPolicies = createAsyncThunk("fetchPolicies", async () => {
    const res = await GetPolicies();
    return res;
})