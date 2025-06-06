import { Col, Row } from "antd";
import "../index.css";
import Timelog from "./Timelog";
import TodoCard from "./TodoCard";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";
import { API_END_POINT } from "../utils/constants";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Spinner from "../utils/Spinner";

import {
  telegramHook,
  TelegramValidationHook,
  todohook,
} from "../Hooks/timeLogHook";
import { useQueryClient } from "@tanstack/react-query";

const token = Cookies.get("ms_intern_jwt");

const MainPage = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [internId, setInternId] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(dayjs(Date.now()));
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: todo = [] } = todohook(user);

  const { data: telegram = [] } = telegramHook(user);

  const { data: TelegramValidation = [] } = TelegramValidationHook(
    user,
    internId
  );

  const QueryClient = useQueryClient();

  useEffect(() => {
    const telegramSessionCheck = async () => {
      // await TelegramValidation;

      // await telegram;
      QueryClient.invalidateQueries({ queryKey: ["telegram"] });

      setLoading(false);
    };
    telegramSessionCheck();
  }, []);

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
        QueryClient.invalidateQueries({ queryKey: ["telegram", user._id] });

        navigate("/");
      } catch (error) {
        console.error("Error during OAuth2 callback:", error);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, user, QueryClient]);

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
      await Promise.all([
        // QueryClient.invalidateQueries({ queryKey: ["todo"] }),
        QueryClient.invalidateQueries({ queryKey: ["telegram", user._id] }),
      ]);
    };

    fetchData();
  }, [user, internId]);

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
            <div>
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
