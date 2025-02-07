import axios from "axios";
import { API_END_POINT } from "../utils/constants";
import { Todo } from "../types/ITodo";


export const AddTodo = async (todo: Todo) => {
  try {
    const res = await axios.post(`${API_END_POINT}/todo/addTodo`, todo, {

      withCredentials: true,
    })
    return res.data
  } catch (error) {
    console.error('Error while Adding time log:', error);
    throw error;
  }
}

export const GetTodo = async () => {
  try {
    const res = await axios.get(`${API_END_POINT}/todo/getTodo`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Error while fetching time logs:', error);
    throw error;
  }
}


export const UpdateTodo = async (id: string, status: string) => {
  try {
    const res = await axios.put(`${API_END_POINT}/todo/updateTodo/${id}`, { status }, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Error while updating Todo:', error);
    throw error;
  }
};


export const DeleteTodo = async (id: string) => {
  try {
    const res = await axios.delete(`${API_END_POINT}/todo/deleteTodo/${id}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Error while Deleting Todo:', error);
    throw error;
  }
}

export const UpdateTodoInProgressDate = async () => {
  try {
    const res = await axios.put(`${API_END_POINT}/todo/updateInProgressDate`, {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Error while updating Todo InProgressDate:', error);
    throw error;
  }
};