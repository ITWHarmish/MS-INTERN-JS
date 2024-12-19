import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, ConfigProvider, Input, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { AddTodo, DeleteTodo, UpdateTodo } from "../services/todoAPI";
import { useDispatch } from "react-redux";
import { fetchTodos } from "../app/actions/todosAction";
import { AppDispatch, RootState } from "../app/store";
import { updateTodoInState } from "../app/slices/todoSlice";


const TodoCard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { todos } = useSelector((state: RootState) => state.todo);
  const [newTask, setNewTask] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTodos());
  }, []);

  const onDragEnd = async (result: any) => {
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
      await AddTodo(todo);
      dispatch(fetchTodos())
      message.success("Task added successfully!");
    } catch (error) {
      console.error("Error adding todo:", error);
      message.error("Failed to add the task. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await DeleteTodo(id);
      dispatch(fetchTodos())
      message.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      message.error("Failed to delete the task. Please try again.");
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
      <div style={{ padding: "10px" }}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#c9194b",
              borderRadius: 20,
            },
          }}
        >
          <Card title="Card title" extra={<Button type="primary">Send todos on chat</Button>}>
            <div style={{ display: "flex", gap: "10px" }}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="inProgress">
                  {(provided) => (
                    <Card
                      style={{ flex: 1 }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "13px",
                        }}
                      >
                        <span style={{ fontSize: "16px", fontWeight: "bold" }}>In Progress</span>
                        <ConfigProvider
                          theme={{
                            token: {
                              colorPrimary: "#c9194b",
                              borderRadius: 10,
                            },
                          }}
                        >
                          <Button onClick={showModal} type="primary" icon={<PlusOutlined />}></Button>
                          <Modal style={{ fontWeight: "bolder" }} title="Add To Do" open={isModalOpen} onOk={handleAddTodo} onCancel={handleCancel}>

                            <p style={{ display: "flex", gap: "12px", padding: "12px", fontWeight: "normal" }} >Description:
                              <TextArea rows={4} placeholder="Description"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                              />
                            </p>

                          </Modal>
                        </ConfigProvider>
                      </div>
                      {todos.filter(task => task.status === "inProgress").map((task, index) => (
                        <Draggable key={task._id || task.todoId || index} draggableId={String(task._id || task.todoId || index)} index={index}>
                          {(provided) => (
                            <div style={{ marginBottom: "10px" }}>
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
                                    alignItems: "center",
                                    gap: "15px",
                                  }}
                                >
                                  <div>
                                    <div>{task.description}</div>
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
                    </Card>
                  )}
                </Droppable>
                <Droppable droppableId="done">
                  {(provided) => (
                    <Card
                      style={{ flex: 1 }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div style={{ marginBottom: "20px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Done</span>
                      </div>
                      {todos.filter(task => task.status === "done").map((task, index) => (
                        <Draggable key={task._id || `done-${index}`}
                          draggableId={task._id ? String(task._id) : `done-${index}`} index={index}>
                          {(provided) => (
                            <div style={{ marginBottom: "10px" }}>
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
                                    alignItems: "center",
                                    gap: "15px",
                                  }}
                                >
                                  <div>
                                    <div>{task.description}</div>
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
                    </Card>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </Card>
        </ConfigProvider>
      </div >
    </>
  );
};

export default TodoCard;
