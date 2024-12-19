import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetTodo } from "../../services/todoAPI";

export const fetchTodos = createAsyncThunk("fetchTodos", async () => {
    const res = await GetTodo();
    return res;
})