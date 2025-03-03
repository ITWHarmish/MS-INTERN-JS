import { configureStore } from '@reduxjs/toolkit'
import timelogReducer from "./slices/timelogSlice"
import authReducer from "./slices/authSlice"
import telegramReducer from "./slices/telegramSlice"
import todoReducer from "./slices/todoSlice"
import leaveReducer from "./slices/leaveSlice"

export const store = configureStore({
  reducer: {
    timelog: timelogReducer,
    auth: authReducer,
    telegramAuth: telegramReducer,
    todo: todoReducer,
    leave: leaveReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;