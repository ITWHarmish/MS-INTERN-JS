import { Col, Row } from "antd";
import "../index.css";
import Timelog from "./Timelog";
import TodoCard from "./TodoCard";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import axios from "axios";
import { API_END_POINT } from "../utils/constants";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Spinner from "../utils/Spinner";
import { gsap } from "gsap";

import {
  telegramHook,
  TelegramValidationHook,
  todohook,
} from "../hooks/timeLogHook";

const token = Cookies.get("ms_intern_jwt");

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [internId, setInternId] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(dayjs(Date.now()));
  const { user } = useSelector((state: RootState) => state.auth);
  const timelogRef = useRef(null);
  const todoRef = useRef(null);

  const { data: todo = [] } = todohook(user);

  const { data: telegram = [] } = telegramHook(user, internId);

  const { data: TelegramValidation = [] } = TelegramValidationHook(
    user as any,
    internId
  );

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        timelogRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.4 }
      );
      gsap.fromTo(
        todoRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.8 }
      );
    }
  }, [loading]);

  useEffect(() => {
    const telegramSessionCheck = async () => {
      await TelegramValidation;
      await telegram;

      setLoading(false);
    };
    telegramSessionCheck();
  }, [telegram, TelegramValidation]);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get("code");

      if (!code) return;

      try {
        await axios.get(`${API_END_POINT}/oauth2callback`, {
          params: { code },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        telegram;

        navigate("/");
      } catch (error) {
        console.error("Error during OAuth2 callback:", error);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, dispatch, telegram]);

  useEffect(() => {
    if (user) {
      if (user.admin) return;
      if (user.internsDetails === undefined || user.internsDetails === "") {
        navigate("/fillUpForm");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const currentUserId = user?.admin ? internId : user._id;

    if (!currentUserId) return;

    const fetchData = async () => {
      await Promise.all([telegram, todo]);
    };

    fetchData();
  }, [user, internId, dispatch]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Row
          className="Check"
          style={{
            height: "calc(100vh - 130px )",
            padding: "10px 18px 10px 18px",
          }}
        >
          <Col md={18}>
            <div
              className="timelogRef"
              // ref={timelogRef}
              style={{
                marginRight: "4px",
                position: "relative",
                zIndex: "3",
              }}
            >
              <Timelog
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                setInternId={setInternId}
                internId={internId}
              />
            </div>
          </Col>
          <Col md={6}>
            <div
            // className="todoRef"
            >
              <TodoCard
                selectedDate={selectedDate}
                setLoading={setLoading}
                internId={internId}
              />
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default MainPage;
