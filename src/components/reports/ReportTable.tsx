import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Input,
  Table,
  Form,
  message,
  Steps,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import type { TableProps } from "antd";
import { IColumnsReports, IProgressReport } from "../../types/IReport";
import {
  AddTaskToProgressReport,
  DeleteTaskToProgressReport,
  GetProgressReport,
  GetPunctuality,
  GetRegularity,
  UpdateTaskToProgressReport,
} from "../../services/progressReportAPI";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { progressReportHook } from "../../Hooks/progressReportsHook";

const ReportTable = () => {
  const { RangePicker } = DatePicker;
  const { Step } = Steps;
  const { reportId } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentReport, setCurrentReport] = useState<IProgressReport | null>(
    null
  );
  const QueryClient = useQueryClient();
  const { data: progressReport = [], refetch } = progressReportHook();

  useEffect(() => {
    if (user?.id) {
      const getRegularity = async () => {
        try {
          await GetRegularity(reportId);
          await GetPunctuality(reportId);
          QueryClient.invalidateQueries({ queryKey: ["allchProgressReport"] });
        } catch (error) {
          console.error(
            "error while fetching the regularity and punctuality: ",
            error
          );
        }
      };

      getRegularity();
    }
  }, [user?.admin, reportId]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        if (user?.admin) {
          const response = await GetProgressReport(reportId);

          setCurrentReport(response);
        } else {
          const report = progressReport.find(
            (report) => report._id === reportId
          );
          setCurrentReport(report || null);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId, user, progressReport]);

  const tasks = currentReport?.tasks || [];
  const tasksWithKeys = tasks.map((tasks) => ({
    ...tasks,
    key: tasks._id,
  }));

  const columns: TableProps<IColumnsReports>["columns"] = [
    {
      title: "DATE ASSIGNED",
      dataIndex: "assignedDate",
      width: 130,
      key: "assignedDate",
      render: (assignedDate: string) =>
        dayjs(assignedDate).format("YYYY-MM-DD"),
    },
    {
      title: "EXPECTED DATE OF COMPLETION",
      dataIndex: "expectedCompletionDate",
      width: 230,
      key: "expectedCompletionDate",
      render: (expectedCompletionDate: string) =>
        dayjs(expectedCompletionDate).format("YYYY-MM-DD"),
    },
    {
      title: "ACTUAL DATE OF COMPLETION",
      dataIndex: "actualCompletionDate",
      key: "actualCompletionDate",
      width: 230,
      render: (actualCompletionDate: string) =>
        dayjs(actualCompletionDate).format("YYYY-MM-DD"),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "taskDescription",
      key: "taskDescription",
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
  const handleEdit = (task) => {
    setEditingTask(task);

    form.setFieldsValue({
      dateRange: [dayjs(task.assignedDate), dayjs(task.expectedCompletionDate)],
      actualCompletionDate: task.actualCompletionDate
        ? dayjs(task.actualCompletionDate)
        : null,
      taskDescription: task.taskDescription,
    });
  };

  const handleDelete = useMutation({
    mutationFn: async (id: string) => {
      try {
        setLoading(true);
        await DeleteTaskToProgressReport(id, reportId);

        //   refetch();
        //   dispatch(fetchProgressReport());
        message.success("Task deleted successfully!");
      } catch (error) {
        console.error("error deleting task", error);
        message.error("Failed to delete the task. Please try again.");
      } finally {
        setLoading(false);
        QueryClient.removeQueries({ queryKey: ["allchProgressReport"] });
      }
    },
  });

  const handleSubmit = async (values) => {
    const { dateRange, ...restValues } = values;
    const formatDate = dateRange.map((date) =>
      dayjs(date).format("YYYY-MM-DD")
    );

    const payload: IProgressReport = {
      reportId: reportId,
      tasks: [
        {
          ...restValues,
          assignedDate: formatDate[0],
          expectedCompletionDate: formatDate[1],
          actualCompletionDate: dayjs(values.actualCompletionDate).format(
            "YYYY-MM-DD"
          ),
        },
      ],
    };
    if (editingTask) {
      try {
        setLoading(true);
        await UpdateTaskToProgressReport(editingTask._id, payload);

        message.success("Successfully Task Updated");

        form.resetFields();
      } catch (error) {
        message.error("Failed to Update Task");
        console.error("Error While Updating task: ", error);
      } finally {
        setLoading(false);
        setEditingTask(null);
        QueryClient.resetQueries({ queryKey: ["allchProgressReport"] });
        refetch();
      }
    } else {
      if (tasks.length >= 7) {
        message.warning("You can only add up to 7 tasks.");
        return;
      }
      try {
        setLoading(true);
        await AddTaskToProgressReport(payload);

        message.success("Successfully added Task");

        form.resetFields();
      } catch (error) {
        message.error("Failed to add Task");
        console.error("Error While Adding task: ", error);
      } finally {
        setLoading(false);
        QueryClient.resetQueries({ queryKey: ["allchProgressReport"] });
        refetch();
      }
    }
  };

  return (
    <>
      <div style={{ height: "calc(100vh - 130px)", padding: "20px" }}>
        <Row gutter={6} style={{ height: "calc(100vh - 130px)" }}>
          <Col>
            <Steps
              direction="vertical"
              current={1}
              style={{
                height: "calc(100vh - 160px)",
                background: "rgba(255, 255, 255, 0.5)",
                borderRadius: "30px",
              }}
            >
              <Step />
              <Step />
              {user?.admin && <Step />}
              <Step />
            </Steps>
          </Col>
          <Col>
            <Card
              title="PROGRESS REPORT"
              extra={
                user?.admin ? (
                  <Button
                    onClick={() => navigate(`/reportevaluation/${reportId}`)}
                    type="primary"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      if (!tasks.length) {
                        message.warning(
                          "Please add at least one task before proceeding."
                        );
                        return;
                      }
                      navigate(`/report/submit`);
                    }}
                    type="primary"
                  >
                    Next
                  </Button>
                )
              }
              style={{
                width: "calc(100vw - 400px)",
                height: "calc(100vh - 160px)",
                padding: "",
              }}
            >
              <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Row gutter={[16, 16]} align="bottom">
                  <Col span={6}>
                    <Form.Item
                      name="dateRange"
                      rules={[
                        {
                          required: true,
                          message:
                            "Please select assigned and expected completion dates!",
                        },
                      ]}
                      style={{ paddingLeft: "14px" }}
                    >
                      <RangePicker
                        placeholder={["DATE ASSIGNED", "EXPECTED DATE"]}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="actualCompletionDate"
                      rules={[
                        {
                          required: true,
                          message: "Please select actual completion date!",
                        },
                      ]}
                    >
                      <DatePicker
                        placeholder="ACTUAL COMPLETION DATE"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="taskDescription"
                      rules={[
                        {
                          required: true,
                          message: "Please write the Description!",
                        },
                      ]}
                    >
                      <Input placeholder="TASK DESCRIPTION" maxLength={115} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item style={{ marginLeft: "6px" }}>
                      <Button htmlType="submit" type="primary">
                        {editingTask ? "UPDATE TASK" : "ADD TASK"}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>

                <Table<IColumnsReports>
                  columns={columns}
                  dataSource={tasksWithKeys}
                  pagination={false}
                  bordered
                  size="small"
                  loading={loading}
                  sticky
                  locale={{ emptyText: <></> }}
                  className="ScrollInProgress"
                  style={{
                    height: "calc(65vh - 135px)",
                    overflowY: "auto",
                    position: "absolute",
                    right: "0",
                    paddingRight: "4px",
                    paddingLeft: "4px",
                    top: "103px",
                  }}
                />
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="report-overlay"></div>
    </>
  );
};

export default ReportTable;
