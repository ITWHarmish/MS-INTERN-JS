import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Input, Table, Form, message, Steps } from "antd";
import dayjs from "dayjs";
import type { TableProps } from 'antd';
import { IColumnsReports, IProgressReport } from "../../types/IReport";
import { AddTaskToProgressReport, DeleteTaskToProgressReport, GetProgressReport, GetPunctuality, GetRegularity, UpdateTaskToProgressReport } from "../../services/progressReportAPI";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchProgressReport } from "../../redux/actions/progressReportActions";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ReportTable = () => {
    const { RangePicker } = DatePicker;
    const { Step } = Steps;
    const { reportId } = useParams();
    const [form] = Form.useForm();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth)
    const { progressReport } = useSelector((state: RootState) => state.report)
    const [loading, setLoading] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [currentReport, setCurrentReport] = useState<IProgressReport | null>(null);

    useEffect(() => {
        if (!user?.admin) return;
        const getRegularity = async () => {
            try {
                await GetRegularity(reportId);
                await GetPunctuality(reportId);
                await dispatch(fetchProgressReport());
            } catch (error) {
                console.error("error while fetching the regularity and punctuality: ", error);
            }
        };

        getRegularity();
    }, [user?.admin, reportId, dispatch]);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                if (user?.admin) {
                    const response = await GetProgressReport(reportId);
                    setCurrentReport(response);
                } else {
                    const report = progressReport.find(report => report._id === reportId);
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

    const columns: TableProps<IColumnsReports>['columns'] = [
        {
            title: 'Date Assigned',
            dataIndex: 'assignedDate',
            width: 130,
            key: 'assignedDate',
            render: (assignedDate: string) =>
                dayjs(assignedDate).format('YYYY-MM-DD'),
        },
        {
            title: 'Expected Date Of Completion',
            dataIndex: 'expectedCompletionDate',
            width: 230,
            key: 'expectedCompletionDate',
            render: (expectedCompletionDate: string) =>
                dayjs(expectedCompletionDate).format('YYYY-MM-DD'),
        },
        {
            title: 'Actual Date Of Completion',
            dataIndex: 'actualCompletionDate',
            key: 'actualCompletionDate',
            width: 230,
            render: (actualCompletionDate: string) =>
                dayjs(actualCompletionDate).format('YYYY-MM-DD'),
        },
        {
            title: 'Description',
            dataIndex: 'taskDescription',
            key: 'taskDescription',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: "center", gap: '20px', cursor: 'pointer', alignItems: "center" }}>
                    <Button
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
                            handleDelete(record._id);
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
            actualCompletionDate: task.actualCompletionDate ? dayjs(task.actualCompletionDate) : null,
            taskDescription: task.taskDescription,
        });
    };
    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            await DeleteTaskToProgressReport(id, reportId);
            dispatch(fetchProgressReport());
            message.success("Task deleted successfully!");
        } catch (error) {
            console.error("error deleting task", error);
            message.error("Failed to delete the task. Please try again.");
        } finally {
            setLoading(false);
        }

    }

    const handleSubmit = async (values) => {
        const { dateRange, ...restValues } = values;
        const formatDate = dateRange.map(date => dayjs(date).format("YYYY-MM-DD"))

        const payload: IProgressReport = {
            reportId: reportId,
            tasks: [
                {
                    ...restValues,
                    assignedDate: formatDate[0],
                    expectedCompletionDate: formatDate[1],
                    actualCompletionDate: dayjs(values.actualCompletionDate).format("YYYY-MM-DD")
                }
            ]
        }
        if (editingTask) {
            try {
                setLoading(true);
                await UpdateTaskToProgressReport(editingTask._id, payload)
                dispatch(fetchProgressReport())
                message.success("Successfully Task Updated");

                form.resetFields();
            } catch (error) {
                message.error("Failed to Update Task");
                console.error("Error While Updating task: ", error);
            } finally {
                setLoading(false);
                setEditingTask(null);
            }
        }
        else {
            if (tasks.length >= 7) {
                message.warning("You can only add up to 7 tasks.");
                return;
            }
            try {
                setLoading(true);
                await AddTaskToProgressReport(payload)
                dispatch(fetchProgressReport())
                message.success("Successfully added Task");

                form.resetFields();
            } catch (error) {
                message.error("Failed to add Task");
                console.error("Error While Adding task: ", error);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <>
            <div style={{ marginBottom: "50px", height: "82vh" }}>
                <div style={{ padding: "20px", height: "80vh", marginBottom: "50px" }}>
                    <Steps current={1} style={{ width: "99%", maxWidth: "1300px", marginBottom: "20px" }}>
                        <Step title="Fill Details" />
                        <Step title="Add Tasks" />
                        {user?.admin &&
                            <Step title="Intern Evaluation" />
                        }
                        <Step title="Review & Submit" />
                    </Steps>
                    <Card style={{ position: "relative", height: "90%" }}
                        title={
                            "Progress Report"
                        }
                        extra={
                            user?.admin ?
                                <Button onClick={() => navigate(`/reportevaluation/${reportId}`)} type="primary">
                                    Next
                                </Button>
                                :
                                <Button onClick={() => navigate(`/report/submit`)} type="primary">
                                    Next
                                </Button>
                        }
                    >
                        <Form
                            form={form}
                            onFinish={handleSubmit}
                            layout="vertical"
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    flexWrap: "wrap",
                                }}
                            >
                                <Form.Item
                                    name="dateRange"
                                    rules={[{ required: true, message: "Please select assigned and expected completion dates!" }]}
                                    style={{ flex: 1, minWidth: "280px" }}
                                >
                                    <RangePicker
                                        placeholder={['Date Assigned', 'Expected Date']}
                                        style={{ width: "100%" }}
                                        required
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="actualCompletionDate"
                                    rules={[{ required: true, message: "Please select actual completion dates!" }]}
                                    style={{ flex: 1, minWidth: "250px" }}
                                >
                                    <DatePicker
                                        placeholder="Actual Completion Date"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="taskDescription"
                                    rules={[{ required: true, message: "Please write the Description!" }]}
                                    style={{ flex: 2, minWidth: "300px" }}
                                >
                                    <Input
                                        placeholder="Task Description"
                                        style={{ width: "100%" }}
                                        maxLength={115}
                                    />
                                </Form.Item>
                                <Form.Item
                                >
                                    <Button htmlType="submit" type="primary">
                                        {editingTask ? "Update Task" : "Add Task"}
                                    </Button>
                                </Form.Item>
                            </div>
                            <div
                            >
                                <Table<IColumnsReports>
                                    columns={columns}
                                    dataSource={tasks}
                                    pagination={false}
                                    bordered
                                    size="small"
                                    loading={loading}
                                    sticky={true}
                                    locale={{ emptyText: <></> }}
                                    className="ScrollInProgress"
                                    style={{
                                        height: "calc(65vh - 135px)",
                                        position: "absolute",
                                        overflowY: "auto",
                                        overflowX: "hidden",
                                        left: "10px",
                                        right: "0",
                                        paddingRight: "10px",
                                    }}
                                />
                            </div>
                        </Form>
                    </Card >
                </div>
            </div>
        </>
    )
}

export default ReportTable
