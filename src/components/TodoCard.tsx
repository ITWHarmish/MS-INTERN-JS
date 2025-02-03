import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Input, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { AddTodo, DeleteTodo, UpdateTodo } from "../services/todoAPI";
import { useDispatch } from "react-redux";
import { fetchTodos } from "../redux/actions/todosAction";
import { AppDispatch, RootState } from "../redux/store";
import { updateTodoInState } from "../redux/slices/todoSlice";
import "../index.css"
import { SendTodosToChat, SendTodosToGoogleChat } from "../services/telegramAPI";
import { GetRefreshTokenAndUpdateAccessToken } from "../services/googleApi";
import { fetchTelegram } from "../redux/actions/telegramActions";
import dayjs from "dayjs";
import { SendTimelogToSheet } from "../services/timelogAPI";
import { TodoCardProps } from "../types/ITodo";

const TodoCard: React.FC<TodoCardProps> = ({ setLoading, selectedDate }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { todos } = useSelector((state: RootState) => state.todo);
  const { telegramUser } = useSelector((state: RootState) => state.telegramAuth);
  const { timelogs } = useSelector((state: RootState) => state.timelog)
  const [newTask, setNewTask] = useState("");

  const totalHours = timelogs.reduce((total, timelog) => {
    const hours = typeof timelog?.hours === 'number' ? timelog.hours : 0;
    return total + hours;
  }, 0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;


    const newTodos = [...todos];
    const sourceList = newTodos.filter(task => task.status === source.droppableId);
    const destinationList = newTodos.filter(task => task.status === destination.droppableId);

    const [movedTask] = sourceList.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: destination.droppableId };

    destinationList.splice(destination.index, 0, updatedTask);

    dispatch(updateTodoInState({ id: updatedTask.todoId, updatedData: { status: updatedTask.status } }));

    try {
      await UpdateTodo(updatedTask.todoId, updatedTask.status);
      dispatch(fetchTodos())
      message.success("Updated tasks successfully")
    } catch (error) {
      dispatch(updateTodoInState({ id: movedTask.todoId, updatedData: { status: movedTask.status } }));
      message.error("Failed to update task. Please try again.");
      console.error("Error updating task status:", error);
    }
  };

  const handleAddTodo = async () => {
    if (!newTask.trim()) return;

    const todo = {
      userId: user?._id,
      description: newTask,
    };
    setNewTask("");
    setIsModalOpen(false);

    try {
      setLoading(true);
      await AddTodo(todo);
      dispatch(fetchTodos());
      message.success("Task added successfully!");
    } catch (error) {
      console.error("Error adding todo:", error);
      message.error("Failed to add the task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await DeleteTodo(id);
      dispatch(fetchTodos());
      message.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      message.error("Failed to delete the task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendTodo = async () => {
    const inProgressTodos = todos.filter((task) => task.status === "inProgress");
    const description = inProgressTodos.map((task) => task.description);
    const phone = telegramUser?.telegram?.phone;

    if (inProgressTodos.length === 0) {
      message.warning("No tasks to send!");
      return;
    }

    const formattedTasks = `
Day start status:
${description.map(task => `• ${task}`).join("\n")}
`;
    try {
      setLoading(true);
      try {
        await GetRefreshTokenAndUpdateAccessToken(user?._id);
        dispatch(fetchTelegram())
      } catch (error) {
        console.error("Genrating New Access Token:", error);
        message.error("Failed to Genrate New Access Token. Please try again.");
      }

      const sendToChat = SendTodosToChat({ task: formattedTasks, phone: phone })
        .catch((error) => {
          console.error("Error sending tasks on Telegram:", error);
          message.error("Failed to send tasks on Telegram. Please try again.");
        });

      const sendToGoogleChat = SendTodosToGoogleChat({ messageText: formattedTasks })
        .catch((error) => {
          console.error("Error sending tasks to Google Chat:", error);
          message.error("Failed to send tasks to Google Chat. Please try again.");
        });

      await Promise.all([sendToChat, sendToGoogleChat]);

      message.success("Tasks sent to chats successfully!");
    } catch (error) {
      console.error("Error during sending tasks:", error);
      message.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendDayEndTodo = async () => {
    if (!timelogs.length) {
      message.warning("No Timelogs to Send!");
      return;
    }
    const currentDate = dayjs(Date.now()).format("YYYY-MM-DD")
    const formattedDate = selectedDate.format("YYYY-MM-DD");

    if (currentDate != formattedDate) {
      message.warning("Timelog must be Current Date!");
      return;
    }

    const text = timelogs.map((log, index) => [
      index === 0 ? formattedDate : " ",
      log.startTime ? dayjs(log.startTime).format("HH:mm") : "",
      log.endTime ? dayjs(log.endTime).format("HH:mm") : "",
      log.hours.toString(),
      log.category,
      log.description,
    ]);

    const messageText = ([...text]);

    const doneTodos = todos.filter((task) => task.status === "done");
    const inProgressTodos = todos.filter((task) => task.status === "inProgress");
    const phone = telegramUser?.telegram?.phone;

    if (doneTodos.length === 0 && inProgressTodos.length === 0) {
      message.warning("No tasks to send!");
      return;
    }

    const formattedTasks = `Day end status:
${doneTodos.map((task) => `• ${task.description} - done `).join("\n")} ${inProgressTodos.length > 0 ? `
${inProgressTodos.map((task) => `• ${task.description} - In Progress `).join("\n ")}` : ""}
  
${user?.fullName}: ${totalHours.toFixed(2)} hours`;
    try {
      setLoading(true);
      try {
        await GetRefreshTokenAndUpdateAccessToken(user?._id);
        dispatch(fetchTelegram())
      } catch (error) {
        console.error("Error Genrating New Access Token:", error);
        message.error("Failed to Genrate New Access Token. Please try again.");
      }

      const SendTimelogToSpreadSheets = SendTimelogToSheet(messageText)
        .catch((error) => {
          console.error("Error sending Timelog to sheet:", error);
          message.error("Failed to send Timelog to sheet. Please try again.");
        });
      const sendToChat = SendTodosToChat({ task: formattedTasks, phone: phone })
        .catch((error) => {
          console.error("Error sending tasks on Telegram:", error);
          message.error("Failed to send tasks on Telegram. Please try again.");
        });

      const sendToGoogleChat = SendTodosToGoogleChat({ messageText: formattedTasks })
        .catch((error) => {
          console.error("Error sending tasks to Google Chat:", error);
          message.error("Failed to send tasks to Google Chat. Please try again.");
        });

      await Promise.all([SendTimelogToSpreadSheets, sendToChat, sendToGoogleChat]);

      message.success("Tasks sent to chats successfully!");
    } catch (error) {
      console.error("Error during sending tasks:", error);
      message.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const { TextArea } = Input;

  return (
    <>
      <div style={{ paddingTop: "10px", paddingRight: "10px" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Card
            title="Todos"
            extra={
              <div style={{ display: "flex", gap: "3px", alignItems: "center", justifyContent: "center" }}>
                {
                  telegramUser?.telegram?.session_id && telegramUser?.google?.tokens?.access_token ?
                    <Button
                      onClick={handleSendTodo}
                      type="primary"
                    >
                      Send Day Start Status
                    </Button>
                    : <Button
                      disabled
                      onClick={handleSendTodo}
                      type="primary"
                    >
                      Send Day Start Status
                    </Button>
                }
                {
                  telegramUser?.telegram?.session_id && telegramUser?.google?.tokens?.access_token ?
                    <Button
                      onClick={handleSendDayEndTodo}
                      type="primary"
                    >
                      Send Day End Status
                    </Button>
                    : <Button
                      disabled
                      onClick={handleSendDayEndTodo}
                      type="primary"
                    >
                      Send Day End Status
                    </Button>
                }
              </div>
            }
          >

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "5px" }}>
              <Card
                className="ScrollInProgress"
                style={{ flex: 1, minHeight: "65vh", position: "relative" }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: "600" }}>In Progress</span>

                  <Button size="small" onClick={showModal} type="primary" icon={<PlusOutlined />}></Button>
                  <Modal style={{ fontWeight: "600" }} title="Add To Do" open={isModalOpen} onOk={handleAddTodo} onCancel={handleCancel} okText="Submit" cancelButtonProps={{ danger: true }}>

                    <p style={{ display: "flex", gap: "12px", padding: "12px", fontWeight: "normal" }} >Description:
                      <TextArea rows={4} placeholder="Description"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                      />
                    </p>

                  </Modal>
                </div>
                <Droppable droppableId="inProgress">
                  {(provided) => (
                    <>
                      <div
                        className="ScrollInProgress" style={{
                          height: "calc(65vh - 9vh)",
                          width: "100%",
                          overflow: "auto",
                          overflowX: "hidden",
                          position: "absolute",
                          right: "0",
                        }}
                        ref={provided.innerRef}
                        {...provided.droppableProps} >

                        {todos.filter(task => task.status === "inProgress").map((task, index) => (
                          <Draggable key={task._id || task.todoId || index} draggableId={String(task._id || task.todoId || index)} index={index}>
                            {(provided) => (

                              <div style={{ marginBottom: "10px", marginRight: "10px", marginLeft: "10px" }}>

                                <Card
                                  type="inner"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      gap: "15px",
                                      minHeight: "8vh",
                                    }}
                                  >
                                    <div className="hello">
                                      {task.description.length > 35
                                        ? `${task.description.substring(0, 35)}...`
                                        : task.description}
                                    </div>
                                    <Button
                                      size="small"
                                      shape="circle"
                                     style={{paddingBottom: "3px"}}
                                      icon={<DeleteOutlined />}
                                      danger
                                      onClick={() => handleDelete(task.todoId)}
                                    />
                                  </div>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </>
                  )}
                </Droppable>
              </Card>
              <Card
                style={{ flex: 1, minHeight: "65vh", position: "relative" }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <span style={{ fontSize: "16px", fontWeight: "600" }}>Done</span>
                </div>

                <Droppable droppableId="done">
                  {(provided) => (
                    <div className="ScrollInProgress" style={{
                      height: "calc(65vh - 9vh)",
                      overflowY: "auto",
                      overflowX: "hidden",
                      position: "absolute",
                      right: "0",
                      width: "100%",
                    }}
                      ref={provided.innerRef}  {...provided.droppableProps}>

                      {todos.filter(task => task.status === "done").map((task, index) => (
                        <Draggable key={task._id || `done-${index}`}
                          draggableId={task._id ? String(task._id) : `done-${index}`} index={index}>
                          {(provided) => (
                            <div style={{ marginBottom: "10px", marginRight: "10px", marginLeft: "10px" }}>

                              <Card
                                type="inner"
                                style={{ backgroundColor: "#fafafa" }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "15px",
                                    minHeight: "8vh"
                                  }}
                                >
                                  <div>
                                    {task.description.length > 35
                                      ? `${task.description.substring(0, 35)}...`
                                      : task.description}
                                  </div>
                                  <Button
                                    size="small"
                                    shape="circle"
                                    icon={<DeleteOutlined />}
                                    danger
                                    onClick={() => handleDelete(task.todoId)}
                                  />
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>
            </div>
          </Card>
        </DragDropContext>
      </div >
    </>
  );
};

export default TodoCard;
