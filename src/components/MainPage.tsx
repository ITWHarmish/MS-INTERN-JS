import { Col, Row, Spin } from "antd";
import "../index.css";
import Timelog from "./Timelog";
import TodoCard from "./TodoCard";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { Verify } from "../services/authAPI";
import { AppDispatch } from "../redux/store";
import { UpdateTodoInProgressDate } from "../services/todoAPI";
import { fetchTodos } from "../redux/actions/todosAction";
import axios from "axios";
import { API_END_POINT } from "../utils/constants";
import { fetchTelegram } from "../redux/actions/telegramActions";
import { TelegramSessionValidation } from "../services/telegramAPI";
import dayjs from "dayjs";

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(dayjs(Date.now()));

  useEffect(() => {
    const telegramSessionCheck = async () => {
      try {
        await TelegramSessionValidation();
        dispatch(fetchTelegram());
      } catch (error) {
        console.error("Failed to update todo date:", error);
      }
    };
    telegramSessionCheck();
  }, [dispatch]);
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get("code");
      if (!code) {
        console.error("Authorization code not found.");
        return;
      }

      try {
        await axios.get(`${API_END_POINT}/oauth2callback`, {
          params: { code },
          withCredentials: true,
        });
        dispatch(fetchTelegram());
        navigate("/");
      } catch (error) {
        console.error("Error during OAuth2 callback:", error);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, dispatch]);

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
      <Row>
        <Col md={15}>
          <div
            style={{
              padding: "10px",
              position: "relative",
              zIndex: "1",
            }}
          >
            <Timelog selectedDate={selectedDate} setSelectedDate={setSelectedDate}  />
          </div>
        </Col>
        <Col md={9}>
          <TodoCard selectedDate={selectedDate} setLoading={setLoading} />
        </Col>
      </Row>
    </>
  );
};

export default MainPage;
