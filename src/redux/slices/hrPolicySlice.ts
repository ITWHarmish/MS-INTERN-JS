import { createSlice } from "@reduxjs/toolkit";
import { IPolicy } from "../../types/IPolicy";
import { fetchPolicies } from "../actions/hrPolicyActions";

interface HrPolicy {
    loading: boolean;
    policies: IPolicy[];
    isError: boolean;
}

const initialState: HrPolicy = {
    loading: false,
    policies: [],
    isError: false,
};



const policySlice = createSlice({
    name: "policy",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(fetchPolicies.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchPolicies.fulfilled, (state, action) => {
            state.loading = false;
            state.policies = action.payload;
        })
        builder.addCase(fetchPolicies.rejected, (state) => {
            state.loading = false;
            state.isError = true;
        })
    }
})

export default policySlice.reducer;