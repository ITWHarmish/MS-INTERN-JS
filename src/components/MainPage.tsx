import { Col, Row } from "antd";
import "../index.css";
import Timelog from "./Timelog";
import TodoCard from "./TodoCard";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import axios from "axios";
import { API_END_POINT } from "../utils/constants";
import { fetchTelegram } from "../redux/actions/telegramActions";
import { TelegramSessionValidation } from "../services/telegramAPI";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { fetchTodos } from "../redux/actions/todosAction";
import Spinner from "../utils/Spinner";

const token = Cookies.get('ms_intern_jwt')

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [internId, setInternId] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(dayjs(Date.now()));
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const telegramSessionCheck = async () => {
      try {
        await TelegramSessionValidation();
        dispatch(fetchTelegram());
      } catch (error) {
        console.error("Failed to update todo date:", error);
      } finally {
        setLoading(false);
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
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
    if (user) {
      if(user.admin) return;
      if (user.internsDetails === undefined || user.internsDetails === "") {
        navigate("/fillUpForm");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate])

  useEffect(() => {
    if (!user) return;

    const currentUserId = user?.admin ? internId : user._id;
    if (!currentUserId) return;

    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchTelegram()),
          dispatch(fetchTodos({ userId: currentUserId }))
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, internId, dispatch]);


  return (
    <>
      {loading ?
        <Spinner /> :
        <Row className="Check" style={{ height: "calc(100vh - 100px )" }}>
          <Col md={15}>
            <div
              style={{
                padding: "10px",
                position: "relative",
                zIndex: "3",
              }}
            >
              <Timelog selectedDate={selectedDate} setSelectedDate={setSelectedDate} setInternId={setInternId} internId={internId} />
            </div>
          </Col>
          <Col md={9}>
            <TodoCard selectedDate={selectedDate} setLoading={setLoading} internId={internId} />
          </Col>
        </Row>
      }
    </>
  );
};

export default MainPage;
