import { Card, DatePicker, Select, Spin } from "antd";
import dayjs from "dayjs";
import Tasktable from "./Tasktable";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getInternsHook } from "../hooks/internlistHook";
import { useQuery } from "@tanstack/react-query";
import { GetTimelogs } from "../services/timelogAPI";

const Timelog = ({ selectedDate, setSelectedDate, setInternId, internId }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: students = [] } = getInternsHook(user);

  const formattedDate = selectedDate.format("YYYY-MM-DD");

  const {
    data: timelog = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["timelog", formattedDate, user?.admin ? internId : user?._id],
    queryFn: () =>
      GetTimelogs(formattedDate, user?.admin ? internId : user?._id),
    enabled: !!user?._id && (user?.admin ? !!internId : true),
    staleTime: Infinity,
  });

  const totalHours = timelog.reduce((total, timelog) => {
    const hours = typeof timelog?.hours === "number" ? timelog.hours : 0;
    return total + hours;
  }, 0);

  const handleDateChange = (date) => {
    if (date) {
      const formatted = date.format("YYYY-MM-DD");
      setSelectedDate(dayjs(formatted));
    }
  };

  const handleStudentChange = (value) => {
    setInternId(value);
  };

  return (
    <Card
      style={{ position: "relative", height: "calc(100vh - 148.5px)" }}
      title={
        <div>
          <span style={{ marginLeft: "8px" }}>TIMELOG :</span>
          <span
            style={{ fontWeight: "normal", marginLeft: "7px" }}
          >{`${totalHours.toFixed(2)} HOURS`}</span>
        </div>
      }
      extra={
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {user?.admin && (
            <Select
              showSearch
              style={{ marginLeft: "15px" }}
              placeholder="Select Student"
              options={students.map((student) => ({
                value: student._id,
                label: student.fullName,
              }))}
              onChange={handleStudentChange}
            />
          )}
          <DatePicker
            style={{ marginRight: "8px" }}
            className="picker-timelog"
            defaultValue={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      }
    >
      {isLoading ? (
        <div style={{ textAlign: "center", paddingTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : isError ? (
        <p>Error loading timelogs: {error.message}</p>
      ) : (
        <Tasktable selectedDate={selectedDate} internId={internId} />
      )}
    </Card>
  );
};

export default Timelog;
