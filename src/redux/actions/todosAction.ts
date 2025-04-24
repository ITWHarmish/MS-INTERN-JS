import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetTodo } from "../../services/todoAPI";
import { IDate } from "../../types/ITimelog";

export const fetchTodos = createAsyncThunk("fetchTodos",
    async ({ userId }: IDate) => {
        const res = await GetTodo(userId);
        return res;
    })