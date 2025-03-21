import { createSlice } from "@reduxjs/toolkit";
import { fetchProgressReport } from "../actions/progressReportActions";
import { IProgressReport } from "../../types/IReport";

interface ProgressReport {
    loading: boolean;
    progressReport: IProgressReport[];
    isError: boolean;
}

const initialState: ProgressReport = {
    loading: false,
    progressReport: [],
    isError: false,
};



const progressReportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(fetchProgressReport.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchProgressReport.fulfilled, (state, action) => {
            state.loading = false;
            state.progressReport = action.payload;
        })
        builder.addCase(fetchProgressReport.rejected, (state) => {
            state.loading = false;
            state.isError = true;
        })
    }
})

export default progressReportSlice.reducer;