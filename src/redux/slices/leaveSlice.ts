import { createSlice } from "@reduxjs/toolkit";
import { fetchLeaves } from "../actions/leaveActions";
import { ILeave } from "../../types/ILeaves";

interface LeaveState {
    loading: boolean;
    leaves: ILeave[];
    isError: boolean;
}

const initialState: LeaveState = {
    loading: false,
    leaves: [],
    isError: false,
};



const leaveSlice = createSlice({
    name: "leave",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(fetchLeaves.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchLeaves.fulfilled, (state, action) => {
            state.loading = false;
            state.leaves = action.payload;
        })
        builder.addCase(fetchLeaves.rejected, (state) => {
            state.loading = false;
            state.isError = true;
        })
    }
})

export default leaveSlice.reducer;