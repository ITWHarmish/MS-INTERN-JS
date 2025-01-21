import { createSlice } from "@reduxjs/toolkit";
import { fetchTimelogs } from "../actions/timelogActions";
import { TimeLog } from "../../types/ITimelog";

interface TimelogState {
    loading: boolean;
    timelogs: TimeLog[];
    isError: boolean;
  }
  
  const initialState: TimelogState = {
    loading: false,
    timelogs: [],
    isError: false,
  };


const timelogSlice = createSlice({
    name: "timelog",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTimelogs.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchTimelogs.fulfilled, (state, action) => {
            state.loading = false;
            state.timelogs = action.payload;
        })
        builder.addCase(fetchTimelogs.rejected, (state) => {
            state.isError = true;
        })
    }

})

export default timelogSlice.reducer;
