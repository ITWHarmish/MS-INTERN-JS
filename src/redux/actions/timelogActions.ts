import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetTimelogs } from "../../services/timelogAPI";
import { IDate } from "../../types/ITimelog";

export const fetchTimelogs = createAsyncThunk("fetchTimelogs",
    async ({ date }: IDate) => {
        const res = await GetTimelogs(date);
        return res;
    })