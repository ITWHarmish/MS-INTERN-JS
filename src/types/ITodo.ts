import dayjs from "dayjs";

export interface Todo {
    userId: string;
    description: string;
    todoId?: string;
}

export interface TodoCardProps {
    setLoading: (loading: boolean) => void;
    selectedDate: dayjs.Dayjs;
    internId: string;
}

