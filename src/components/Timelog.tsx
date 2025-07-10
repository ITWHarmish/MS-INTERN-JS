import { Card, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import Tasktable from "./Tasktable";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// import { infinity } from "ldrs";
import { getInternsHook } from "../Hooks/internListhook";
import { timeLogHook } from "../Hooks/timeLogHook";
import { useQueryClient } from "@tanstack/react-query";

const Timelog = ({ selectedDate, setSelectedDate, setInternId, internId }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const QueryClient = useQueryClient();

  const formattedDate = selectedDate.format("YYYY-MM-DD");

  const { data: timelogs = [] } = timeLogHook(user, formattedDate, internId);
  const { data: students = [] } = getInternsHook(user);

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedDate(dayjs(formattedDate));
    }
  };

  const totalHours = timelogs.reduce((total, timelog) => {
    QueryClient.invalidateQueries({
      queryKey: ["timeLog", formattedDate, user?._id],
    });
    const hours = typeof timelog?.hours === "number" ? timelog.hours : 0;
    return total + hours;
  }, 0);

  const handleStudentChange = (value) => {
    setInternId(value);
  };

  return (
    <>
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
            {user && user.admin && (
              <div>
                <Select
                  showSearch
                  style={{ marginLeft: "15px" }}
                  placeholder="Select Student"
                  options={students.map((student) => ({
                    value: student._id,
                    label: student.fullName,
                  }))}
                  onChange={handleStudentChange}
                  filterOption={(input, option: any) =>
                    option?.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
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
        <Tasktable selectedDate={selectedDate} internId={internId} />
      </Card>
    </>
  );
};

export default Timelog;
