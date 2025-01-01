import { Col, Row, Spin } from "antd"
import "../index.css"
import Timelog from "./Timelog"
import TodoCard from "./TodoCard"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../app/slices/authSlice"
import { Verify } from "../services/authAPI"
import { AppDispatch } from "../app/store"
import { UpdateTodoInProgressDate } from "../services/todoAPI"
import { fetchTodos } from "../app/actions/todosAction"

const MainPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await Verify();
                dispatch(setUser(response));
            } catch (error) {
                console.error("Verification failed:", error);
                navigate("/login");
            }
        };
        verifyToken();
    }, [dispatch, navigate]);

    useEffect(() => {
        const updateInProgressTodosDate = async () => {
            try {
                await UpdateTodoInProgressDate();
                dispatch(fetchTodos());
            } catch (error) {
                console.error("Failed to update todo date:", error);
            }
        };
        updateInProgressTodosDate();
    }, [dispatch]);


    return (
        <>
            {loading && (
                <div className="full-page-spin">
                    <Spin size="large" />
                </div>
            )}
            <Row >
                <Col md={15} >
                    <div
                        style={{
                            padding: "10px",
                        }}
                    >
                        <Timelog />
                    </div>
                </Col>
                <Col md={9} >
                    <TodoCard setLoading={setLoading} />
                </Col>
            </Row>

        </>
    )
}

export default MainPage
