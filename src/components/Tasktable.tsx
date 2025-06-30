import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Input, message, Select, Table, TimePicker } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  AddTimelog,
  DeleteTimelog,
  UpdateTimelog,
} from "../services/timelogAPI";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
// import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
// import { fetchTimelogs } from "../redux/actions/timelogActions";
// import { AppDispatch  } from "../redux/store";
import { RootState } from "../redux/store";
import type { TableProps } from "antd";
import { IColumns, TimeLog } from "../types/ITimelog";
import { timeLogHook } from "../Hooks/timeLogHook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../utils/Spinner";

dayjs.extend(localizedFormat);

const Tasktable = ({ selectedDate, internId }) => {
  const formattedDate = selectedDate.format("YYYY-MM-DD");
  //   const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    category: "coding",
    description: "",
    date: formattedDate,
  });
  // const { timelogs } = useSelector((state: RootState) => state.timelog)
  const { user } = useSelector((state: RootState) => state.auth);
  const [editingId, setEditingId] = useState<string | null>(null);

  // const dispatch = useDispatch<AppDispatch>();
  const { RangePicker } = TimePicker;
  const userId = user?.admin ? internId : user?._id;

  const QueryClient = useQueryClient();

  const {
    data: timelogs = [],
    isLoading,
    refetch,
  } = timeLogHook(user, formattedDate, internId);

  const timelogsWithKeys = timelogs.map((timelogs) => ({
    ...timelogs,
    key: timelogs._id,
  }));
  const stableTimeLog = useMemo(() => timelogs, [JSON.stringify(timelogs)]);
  useEffect(() => {
    let startTime, endTime;

    if (timelogs.length > 0) {
      const lastEntryEndTime = dayjs(timelogs[timelogs.length - 1].endTime);
      startTime = lastEntryEndTime;
      endTime = lastEntryEndTime.add(1, "hour");
    } else {
      startTime = dayjs("09:00", "HH:mm");
      endTime = dayjs("10:00", "HH:mm");
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
    }));
  }, [stableTimeLog]);

  const columns: TableProps<IColumns>["columns"] = [
    {
      title: "START TIME",
      dataIndex: "startTime",
      width: 100,
      key: "startTime",
      render: (startTime: string) => dayjs(startTime).format("hh:mm A"),
    },
    {
      title: "END TIME",
      dataIndex: "endTime",
      width: 100,
      key: "endTime",
      render: (endTime: string) => dayjs(endTime).format("hh:mm A"),
    },
    {
      title: "HOURS",
      dataIndex: "hours",
      key: "hours",
      width: 70,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
      width: 120,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "ACTIONS",
      dataIndex: "actions",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            cursor: "pointer",
            alignItems: "center",
          }}
        >
          <Button
            className="check2"
            shape="circle"
            icon={<EditOutlined className="check" />}
            size="small"
            onClick={() => {
              handleEdit(record);
            }}
          />
          <Button
            shape="circle"
            danger
            icon={<DeleteOutlined className="check" />}
            size="small"
            onClick={() => {
              handleDelete.mutate(record._id);
            }}
          />
        </div>
      ),
    },
  ];

  const handleRangeChange = (
    value: [dayjs.Dayjs | null, dayjs.Dayjs | null]
  ) => {
    if (value) {
      setFormData({
        ...formData,
        startTime: value[0]?.format("HH:mm"),
        endTime: value[1]?.format("HH:mm"),
      });
    }
  };

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleChangeCategory = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleSubmit = useMutation({
    mutationFn: async () => {
      if (
        !formData.startTime ||
        !formData.endTime ||
        !formData.category ||
        !formData.description ||
        !formData.date
      ) {
        message.error("All fields are required!");
        throw new Error("Validation Error!");
      }

      const startTimeObj = dayjs(formData.startTime, "HH:mm");
      const endTimeObj = dayjs(formData.endTime, "HH:mm");
      const duration = endTimeObj.diff(startTimeObj, "minutes") / 60;

      if (duration > 1) {
        message.error("Time should not be more than 1 hour!");
        throw new Error("Validation Error!");
      }
      const payload = {
        ...formData,
        startTime: startTimeObj.format(),
        endTime: endTimeObj.format(),
        hours: Number(duration).toFixed(2),
      };
      if (editingId) {
        await UpdateTimelog(editingId, payload);
      } else {
        await AddTimelog(payload);
      }
    },
    onSuccess: () => {
      message.success(
        editingId
          ? "TimeLog Updated successfully!"
          : "TimeLog Added successfully!"
      );

      setFormData({
        startTime: "",
        endTime: "",
        category: "coding",
        description: "",
        date: formattedDate,
      });

      setEditingId(null);
      QueryClient.invalidateQueries({
        queryKey: ["timeLog", formattedDate, userId],
      });
      refetch();
    },
    onError: (error) => {
      if (!(error instanceof Error && error.message === "Validation failed")) {
        message.error("Something went wrong! Please try again.");
      }
    },
  });

  //   const handleSubmit = async () => {
  //     if (
  //       !formData.startTime ||
  //       !formData.endTime ||
  //       !formData.category ||
  //       !formData.description ||
  //       !formData.date
  //     ) {
  //       message.error("All fields are required!");
  //       return;
  //     }

  //     const startTimeObj = dayjs(formData.startTime, "HH:mm");
  //     const endTimeObj = dayjs(formData.endTime, "HH:mm");
  //     const duration = endTimeObj.diff(startTimeObj, "minutes") / 60;

  //     if (duration > 1) {
  //       message.error("Time should not be more than 1 hour!");
  //       return;
  //     }
  //     const payload = {
  //       ...formData,
  //       startTime: dayjs(formData.startTime, "HH:mm").format(),
  //       endTime: dayjs(formData.endTime, "HH:mm").format(),
  //       hours: Number(duration).toFixed(2),
  //     };
  //     setLoading(true);
  //     if (editingId) {
  //       try {
  //         await UpdateTimelog(editingId, payload);
  //         // dispatch(fetchTimelogs({ date: formattedDate, userId }));
  //         QueryClient.invalidateQueries({
  //           queryKey: [
  //             "timelogs",
  //             formattedDate,
  //             user?.admin ? internId : user?._id,
  //           ],
  //         });
  //         message.success("TimeLog Updated successful!");
  //       } catch (error) {
  //         console.error("Error While Updating the time log:", error);
  //         message.error("Updated Failed! Please try again.");
  //       }
  //     } else {
  //       try {
  //         await AddTimelog(payload);
  //         // dispatch(fetchTimelogs({ date: formattedDate, userId }));
  //         QueryClient.invalidateQueries({
  //           queryKey: [
  //             "timelogs",
  //             formattedDate,
  //             user?.admin ? internId : user?._id,
  //           ],
  //         });
  //         message.success("TimeLog Added successful!");
  //       } catch (error) {
  //         console.error("Error While Submitting the time log:", error);
  //         message.error("Submiision Failed! Please try again.");
  //       }
  //     }
  //     setLoading(false);
  //     setFormData({
  //       startTime: "",
  //       endTime: "",
  //       category: "coding",
  //       description: "",
  //       date: formattedDate,
  //     });

  //     setEditingId(null);
  //   };

  const handleEdit = (record: TimeLog) => {
    setEditingId(record._id);

    const startTime = dayjs(record.startTime).format("HH:mm");
    const endTime = dayjs(record.endTime).format("HH:mm");

    setFormData({
      startTime,
      endTime,
      category: record.category,
      description: record.description,
      date: formattedDate,
    });
  };

  const handleDelete = useMutation({
    mutationFn: (id: string) => DeleteTimelog(id),
    onSuccess: () => {
      QueryClient.invalidateQueries({
        queryKey: ["timeLog", formattedDate, userId],
      });
      refetch();
      message.success("TimeLog Deleted successful!");
    },
    onError: () => {
      message.error("Delete Failed! Please try again.");
      console.error("Error While Deleting the time log:");
    },
  });

  //   const handleDelete = async (record) => {
  //     try {
  //       setLoading(true);
  //       await DeleteTimelog(record);
  //       //   dispatch(fetchTimelogs({ date: formattedDate, userId }));
  //       QueryClient.invalidateQueries({
  //         queryKey: [
  //           "timelogs",
  //           formattedDate,
  //           user?.admin ? internId : user?._id,
  //         ],
  //       });
  //       QueryClient.refetchQueries({
  //         queryKey: [
  //           "timelogs",
  //           formattedDate,
  //           user?.admin ? internId : user?._id,
  //         ],
  //       });
  //       message.success("TimeLog Deleted successful!");
  //     } catch (error) {
  //       message.error("Delete Failed! Please try again.");
  //       console.error("Error While Deleting the time log:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, date: formattedDate }));
  }, [formattedDate]);

  return (
    <div style={{ height: "calc(100vh - 225px)", paddingTop: "10px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          paddingLeft: "22px",
          paddingRight: "20px",
          width: "100%",
        }}
      >
        <RangePicker
          style={{ width: "240px" }}
          format="HH:mm A"
          minuteStep={15}
          onChange={handleRangeChange}
          value={
            formData.startTime && formData.endTime
              ? [
                  dayjs(formData.startTime, "HH:mm"),
                  dayjs(formData.endTime, "HH:mm"),
                ]
              : null
          }
          required
        />

        <Select
          style={{ width: "180px" }}
          placeholder="Select Category"
          optionFilterProp="label"
          options={[
            { value: "learning", label: "LEARNING" },
            { value: "coding", label: "CODING" },
            { value: "management", label: "MANAGEMENT" },
          ]}
          onChange={handleChangeCategory}
          value={formData.category || undefined}
        />
        <Input
          placeholder="Description"
          style={{ flex: 1, minWidth: "450px" }}
          value={formData.description}
          onChange={handleChangeDescription}
          required
        />
        <Button onClick={() => handleSubmit.mutate()} type="primary">
          SUBMIT
        </Button>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div
          style={{
            paddingTop: "10px",
          }}
        >
          <Table<IColumns>
            columns={columns}
            dataSource={timelogsWithKeys}
            pagination={false}
            bordered
            size="small"
            loading={isLoading}
            sticky={true}
            locale={{ emptyText: <></> }}
            className="ScrollInProgress"
            style={{
              height: "calc(100vh - 280px)",
              position: "absolute",
              overflowY: "auto",
              overflowX: "hidden",
              left: "10px",
              right: "0",
              paddingRight: "10px",
            }}
          />
        </div>
      )}
      <div>
        {/* <div
                    className={`calculate-hours-card ${showCard ? 'show-card' : ''
                        }`}
                >
                    <Button
                        type="primary"
                        icon={showCard ? <WechatWorkOutlined style={{ fontSize: "22px" }} className="check" /> : <WechatWorkOutlined style={{ fontSize: "22px" }} className="check" />}
                        className="arrow-toggle"
                        onClick={() => setShowCard(!showCard)}
                        size='large'
                        style={{ borderRadius: "40px" }}
                    />
                    <iframe
                        src={import.meta.env.VITE_REACT_APP_CHAT_BASE_URL}
                        width="100%"
                        style={{ minHeight: "450px" }}
                        frameBorder="0"
                    ></iframe>
                </div> */}
      </div>
    </div>
  );
};

export default Tasktable;
