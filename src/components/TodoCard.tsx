import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Input, message, Modal, Select, theme } from "antd";
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { useSelector } from "react-redux";
import { AddTodo, DeleteTodo, UpdateTodo } from "../services/todoAPI";

import { RootState } from "../redux/store";
import "../index.css";
import {
  SendTodosToChat,
  SendTodosToGoogleChat,
} from "../services/telegramAPI";
import dayjs from "dayjs";

import { TodoCardProps } from "../types/ITodo";
import ModalCard from "../utils/ModalCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  telegramHook,
  timeLogHook,
  todocardHook,
  todohook,
} from "../Hooks/timeLogHook";
import { ConfigProvider } from "antd";
import Spinner from "../utils/Spinner";

const TodoCard: React.FC<TodoCardProps> = ({
  setLoading,
  selectedDate,
  internId,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { token } = theme.useToken();
  const { data: SendTimelogToSpreadSheets = [] } = todocardHook(user);

  const [newTask, setNewTask] = useState("");
  const [isDayStartModalOpen, setIsDayStartModalOpen] = useState(false);
  const [isDayEndModalOpen, setIsDayEndModalOpen] = useState(false);
  const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const dispatch = useDispatch<AppDispatch>();
  const QueryClient = useQueryClient();
  ConfigProvider.config({
    holderRender: (children) => children,
  });
  const currentDate = dayjs(Date.now()).format("YYYY-MM-DD");
  const formattedDate = selectedDate.format("YYYY-MM-DD");
  const { data: timelogs = [] } = timeLogHook(user, formattedDate, internId);
  const { data: todos = [] } = todohook(user, internId);
  const { data: telegramUser = [] } = telegramHook(user);

  const totalHours = timelogs.reduce((total, timelog) => {
    const hours = typeof timelog?.hours === "number" ? timelog.hours : 0;
    return total + hours;
  }, 0);
  const getItemStyle = (draggableStyle) => ({
    marginBottom: "24px",
    background: "#3c3c3c46",
    backdropFilter: "blur(12px)",
    ...draggableStyle,
  });

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const newTodos = [...todos];
    const sourceList = newTodos.filter(
      (task) => task.status === source.droppableId
    );
    const destinationList = newTodos.filter(
      (task) => task.status === destination.droppableId
    );

    const [movedTask] = sourceList.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: destination.droppableId };

    destinationList.splice(destination.index, 0, updatedTask);

    const userId = user?.admin ? internId : user?._id;
    if (!userId) {
      message.error("User ID is missing.");
      return;
    }

    try {
      setIsLoading(true);
      await UpdateTodo(updatedTask.todoId, updatedTask.status);
      QueryClient.invalidateQueries({ queryKey: ["todo"] });
    } catch (error) {
      message.error("Failed to update task. Please try again.");
      console.error("Error updating task status:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handleAddTodo = useMutation({
    mutationFn: async () => {
      if (!newTask.trim()) return;

      const userId = user?.admin ? internId : user?._id;
      if (!userId) {
        message.error("User ID is missing.");
        return;
      }

      const todo = {
        userId: userId,
        description: newTask,
        date: currentDate,
      };
      setNewTask("");
      setIsAddTodoModalOpen(false);
      try {
        setLoading(true);
        await AddTodo(todo);
        QueryClient.invalidateQueries({ queryKey: ["todo"] });

        message.success("Task added successfully!");
      } catch (error) {
        console.error("Error adding todo:", error);
        message.error("Failed to add the task. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleDelete = useMutation({
    mutationFn: async (id: string) => {
      const userId = user?.admin ? internId : user?._id;
      if (!userId) {
        message.error("User ID is missing.");
        return;
      }
      setLoading(true);
      try {
        await DeleteTodo(id);
        QueryClient.invalidateQueries({ queryKey: ["todo"] });

        message.success("Task deleted successfully!");
      } catch (error) {
        console.error("Error deleting task:", error);
        message.error("Failed to delete the task. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleSendTodo = async () => {
    const inProgressTodos = todos.filter(
      (task) => task.status === "inProgress"
    );
    const description = inProgressTodos.map((task) => task.description);
    const phone = telegramUser?.telegram?.phone;

    if (inProgressTodos.length === 0) {
      message.warning("No tasks to send!");
      return;
    }

    const formattedTasks = `𝗗𝗮𝘆 𝘀𝘁𝗮𝗿𝘁 𝘀𝘁𝗮𝘁𝘂𝘀:
${description.map((task) => `• ${task}`).join("\n")}
`;
    try {
      setIsDayStartModalOpen(false);
      setLoading(true);

      const sendToChat = SendTodosToChat({ task: formattedTasks, phone: phone })
        .then(() => true)
        .catch((error) => {
          const errorMessage =
            error.response?.data ||
            "Failed to send tasks on Telegram. Please try again.";
          message.error(errorMessage);
          return false;
        });

      const sendToGoogleChat = SendTodosToGoogleChat({
        messageText: formattedTasks,
      })
        .then(() => true)
        .catch((error) => {
          const errorMessage =
            error.response?.data ||
            "Failed to send tasks on Google Chat. Please try again.";
          message.error(errorMessage);
          return false;
        });

      const promiseResult = await Promise.all([sendToChat, sendToGoogleChat]);
      const check = promiseResult.every((item) => item == false);
      if (!check) {
        message.success("Tasks sent to chats successfully!");
      }
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

    const messageText = [...text];
    console.log(messageText);

    const doneTodos = todos.filter((task) => task.status === "done");
    const inProgressTodos = todos.filter(
      (task) => task.status === "inProgress"
    );
    const phone = telegramUser?.telegram?.phone;

    if (doneTodos.length === 0 && inProgressTodos.length === 0) {
      message.warning("No tasks to send!");
      return;
    }
    const formattedTasks = `𝗗𝗮𝘆 𝗲𝗻𝗱 𝘀𝘁𝗮𝘁𝘂𝘀:
${doneTodos.map((task) => `• ${task.description} - done `).join("\n")} ${
      inProgressTodos.length > 0
        ? `
${inProgressTodos
  .map((task) => `• ${task.description} - In Progress `)
  .join("\n")}`
        : ""
    }
  
${user?.fullName}: ${totalHours.toFixed(2)} hours`;
    try {
      setIsDayEndModalOpen(false);
      setLoading(true);

      const sendToChat = SendTodosToChat({ task: formattedTasks, phone: phone })
        .then(() => true)
        .catch((error) => {
          const errorMessage =
            error.response?.data ||
            "Failed to send tasks on Telegram. Please try again.";
          message.error(errorMessage);
          return false;
        });

      const sendToGoogleChat = SendTodosToGoogleChat({
        messageText: formattedTasks,
      })
        .then(() => true)
        .catch((error) => {
          const errorMessage =
            error.response?.data ||
            "Failed to send tasks on Google Chat. Please try again.";
          message.error(errorMessage);
          return false;
        });

      const promiseResult = await Promise.all([
        SendTimelogToSpreadSheets,
        sendToChat,
        sendToGoogleChat,
      ]);
      const check = promiseResult.every((item) => item == false);
      if (!check) {
        message.success("Tasks sent to chats successfully!");
      }
    } catch (error) {
      console.error("Error during sending tasks:", error);
      message.error("Failed to send tasks on Telegram. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAddTodoModalOpen(false);
  };

  const showModal = () => {
    setIsAddTodoModalOpen(true);
  };

  const { TextArea } = Input;

  return (
    <>
      <div style={{}}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Card
            className="custom-card"
            style={{
              borderBottomRightRadius: "0",
              borderTopLeftRadius: "0",
              borderTopRightRadius: "30px !important",
              borderBottomLeftRadius: "30px",
              minHeight: "calc(100vh - 148.5px)",
            }}
            title="TO DO"
            extra={
              <>
                <Select
                  style={{ width: 160 }}
                  placeholder="DAY STATUS"
                  onChange={(value) => {
                    if (value === "start") {
                      setIsDayStartModalOpen(true);
                    } else if (value === "end") {
                      setIsDayEndModalOpen(true);
                    }
                  }}
                  disabled={
                    !(
                      (telegramUser?.telegram?.session_id ||
                        telegramUser?.google?.tokens?.access_token) &&
                      !user?.admin &&
                      currentDate === formattedDate
                    )
                  }
                >
                  <Select.Option value="start">DAY START</Select.Option>
                  <Select.Option value="end">DAY END</Select.Option>
                </Select>

                <ModalCard
                  title="Are you sure, Do you want to send the day start status?"
                  ModalOpen={isDayStartModalOpen}
                  setModalOpen={setIsDayStartModalOpen}
                  onOk={handleSendTodo}
                />

                <ModalCard
                  title="Are you sure, Do you want to send the day end status?"
                  ModalOpen={isDayEndModalOpen}
                  setModalOpen={setIsDayEndModalOpen}
                  onOk={handleSendDayEndTodo}
                />
              </>
            }
          >
            {" "}
            {isLoading ? (
              <Spinner />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <div
                  className="ScrollInProgress"
                  style={{
                    flex: 1,
                    minHeight: "calc(31vh)",
                    position: "relative",
                    width: "100%",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.386)",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginLeft: "12px",
                      }}
                    >
                      IN PROGRESS
                    </span>

                    <Button
                      className="check2"
                      size="small"
                      onClick={showModal}
                      icon={<PlusOutlined />}
                    ></Button>
                    <Modal
                      style={{ fontWeight: "600" }}
                      title="ADD TO DO"
                      open={isAddTodoModalOpen}
                      onOk={() => handleAddTodo.mutate()}
                      onCancel={handleCancel}
                      okText="SUBMIT"
                      cancelText="CANCEL"
                    >
                      <p
                        style={{
                          display: "flex",
                          gap: "12px",
                          padding: "12px",
                          fontWeight: "normal",
                        }}
                      >
                        <TextArea
                          rows={7}
                          placeholder="DESCRIPTION"
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
                          className="ScrollInProgress"
                          style={{
                            height: "calc(65vh - 40.5vh)",
                            width: "100%",
                            overflowY: "auto",
                            overflowX: "hidden",
                            position: "absolute",
                            right: "0",
                          }}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {todos
                            .filter((task) => task.status === "inProgress")
                            .map((task, index) => (
                              <Draggable
                                key={task._id || task.todoId || index}
                                draggableId={String(
                                  task._id || task.todoId || index
                                )}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    className="todo-card"
                                    style={{
                                      marginBottom: "10px",
                                      marginRight: "10px",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    <Card
                                      className={
                                        token.colorBgLayout === "White"
                                          ? ""
                                          : "BgCard"
                                      }
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={getItemStyle(
                                        provided.draggableProps.style
                                      )}
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
                                            ? `${task.description.substring(
                                                0,
                                                35
                                              )}...`
                                            : task.description}
                                        </div>
                                        <Button
                                          size="small"
                                          shape="circle"
                                          icon={
                                            <DeleteOutlined className="check" />
                                          }
                                          danger
                                          onClick={() =>
                                            handleDelete.mutate(task.todoId)
                                          }
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
                </div>
                <div
                  className=""
                  style={{
                    flex: 1,
                    minHeight: "30vh",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <div style={{ marginBottom: "10px" }}>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginLeft: "12px",
                      }}
                    >
                      DONE
                    </span>
                  </div>
                  <div>
                    <Droppable droppableId="done">
                      {(provided) => (
                        <div
                          className="ScrollInProgress"
                          style={{
                            height: "calc(65vh - 250px)",
                            overflowY: "auto",
                            overflowX: "hidden",
                            position: "absolute",
                            right: "0",
                            width: "100%",
                          }}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {todos
                            .filter((task) => task.status === "done")
                            .map((task, index) => (
                              <Draggable
                                key={task._id || `done-${index}`}
                                draggableId={
                                  task._id ? String(task._id) : `done-${index}`
                                }
                                index={index}
                              >
                                {(provided: any) => (
                                  <div
                                    className="todo-card"
                                    style={{
                                      marginBottom: "10px",
                                      marginRight: "10px",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    <Card
                                      className={
                                        token.colorBgLayout === "White"
                                          ? ""
                                          : "BgCard"
                                      }
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
                                        <div>
                                          {task.description.length > 35
                                            ? `${task.description.substring(
                                                0,
                                                35
                                              )}...`
                                            : task.description}
                                        </div>
                                        <Button
                                          size="small"
                                          shape="circle"
                                          icon={<DeleteOutlined />}
                                          danger
                                          onClick={() =>
                                            handleDelete.mutate(task.todoId)
                                          }
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
                  </div>
                </div>
              </div>
            )}
          </Card>
        </DragDropContext>
      </div>
    </>
  );
};

export default TodoCard;
