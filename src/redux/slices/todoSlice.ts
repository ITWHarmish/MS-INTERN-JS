import { createSlice } from "@reduxjs/toolkit";
import { fetchTodos } from "../actions/todosAction";

const todoSlice = createSlice({
    name: "todo",
    initialState: {
        loading: false,
        todos: [],
        isError: false
    },
    reducers: {
        updateTodoInState: (state, action) => {
            const { id, updatedData } = action.payload;
            const index = state.todos.findIndex((todo) => todo._id === id || todo.todoId === id);
            if (index !== -1) {
                state.todos[index] = { ...state.todos[index], ...updatedData };
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodos.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchTodos.fulfilled, (state, action) => {
            state.loading = false;
            state.todos = action.payload;
        })
        builder.addCase(fetchTodos.rejected, (state) => {
            state.isError = true;
        })
    }

})

export const { updateTodoInState } = todoSlice.actions;
export default todoSlice.reducer;
