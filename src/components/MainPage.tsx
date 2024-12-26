import { Col, Row } from "antd"
import "../index.css"
import Timelog from "./Timelog"
import TodoCard from "./TodoCard"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../app/slices/authSlice"
import { GetCurrentUser, Verify } from "../services/authAPI"
import { AppDispatch, RootState } from "../app/store"
import { UpdateTodoInProgressDate } from "../services/todoAPI"
import { fetchTodos } from "../app/actions/todosAction"

const MainPage = () => {

    const { user } = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
        else {
            navigate("/")
        }
    }, [user, navigate])


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
        const getCurrentUser = async () => {
            try {
                const response = await GetCurrentUser();
                dispatch(setUser(response.user));

            } catch (error) {
                console.error("Fetch Failed:", error);
            }
        };
        getCurrentUser();
    }, [dispatch]);

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
                        <TodoCard />
                    </Col>
            </Row>
        </>
    )
}

export default MainPage
