import { Button, Card, Col, DatePicker, Form, Input, message, Row, Steps, theme } from "antd"
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddUserReportDetails, GetProgressReport, UpdateUserDetailsProgressReport } from "../../services/progressReportAPI";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { fetchProgressReport } from "../../redux/actions/progressReportActions";
import Spinner from "../../utils/Spinner";

const ReportUserDetail = () => {
    const { RangePicker } = DatePicker;
    const { Step } = Steps;
    const { reportId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const { user } = useSelector((state: RootState) => state.auth)
    const { progressReport } = useSelector((state: RootState) => state.report)
    const { token } = theme.useToken();

    useEffect(() => {
        const fetchData = async () => {
            try {

                if (user?.admin) {
                    const res = await GetProgressReport(reportId);
                    if (res) {
                        form.setFieldsValue({
                            studentName: res.studentName,
                            enrollmentNo: res.enrollmentNo,
                            course: res.course,
                            division: res.division,
                            projectTitle: res.projectTitle,
                            duration: res.duration
                                ? [dayjs(res.duration.from), dayjs(res.duration.to)]
                                : [],
                        });
                    }
                } else {
                    const report = progressReport.find(report => report._id === reportId);
                    if (report) {
                        form.setFieldsValue({
                            studentName: report.studentName,
                            enrollmentNo: report.enrollmentNo,
                            course: report.course,
                            division: report.division,
                            projectTitle: report.projectTitle,
                            duration: report.duration
                                ? [dayjs(report.duration.from), dayjs(report.duration.to)]
                                : [],
                        });
                    }
                }
            } catch (error) {
                console.error("error While Fetching", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [reportId, progressReport, form, user?.admin]);


    const handleSubmit = async (values) => {
        const formatDate = values.duration.map(date => dayjs(date).format("YYYY-MM-DD"))

        try {
            setLoading(true);
            let response;

            if (user?.admin) {
                if (reportId) {
                    navigate(`/reporttable/${reportId}`);
                    handleNext();
                } else {
                    message.error("Report ID not found.");
                }
                return;
            }
            const payload = {
                ...values,
                mentorFullName: user.internshipDetails.mentor.fullName,
                mentorId: user.internshipDetails.mentor._id,
                duration: {
                    from: formatDate[0],
                    to: formatDate[1],
                },

            }

            if (reportId) {
                await UpdateUserDetailsProgressReport(reportId, payload);
                message.success("Successfully Updated User Report Details");
                response = reportId;
            } else {
                const res = await AddUserReportDetails(payload);
                message.success("Successfully added User Report Details");
                response = res.report._id
            }

            dispatch(fetchProgressReport());

            if (response) {
                navigate(`/reporttable/${response}`);
                handleNext();
            }
        } catch (error) {
            console.error('Error While Updating the User Reports:', error);
            message.error("Failed to process User Report Details");
        } finally {
            setLoading(false);
        }

    }

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    }

    return (
        <>
            {
                loading ? <Spinner /> :
                    <div style={{ backgroundColor: token.colorBgLayout === "White" ? "#f0f2f5" : "#1a1c1f", marginBottom: "50px", overflow: "", height: "100vh" }}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", flexDirection: "column" }}>
                            <Steps current={currentStep} style={{ width: "80%", maxWidth: "800px", marginBottom: "20px" }}>
                                <Step title="Fill Details" />
                                <Step title="Add Tasks" />
                                {user?.admin &&
                                    <Step title="Intern Evaluation" />
                                }
                                <Step title="Review & Submit" />
                            </Steps>
                            <Card
                                title="Fill Up Your Details"
                                extra={
                                    <Button onClick={() => form.submit()} loading={loading} type="primary" htmlType="submit">
                                        Next
                                    </Button>
                                }
                                style={{ width: "80%", maxWidth: "900px", padding: "24px", marginBottom: "22px" }}
                            >
                                <Form
                                    form={form}
                                    onFinish={handleSubmit}
                                    layout="vertical"
                                >
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Student Name"
                                                name="studentName"
                                                rules={[{ required: true, message: "Name is required!" }]}
                                            >
                                                <Input placeholder="Enter Full Name " />
                                            </Form.Item>
                                            <Form.Item
                                                label="Enrollment Number"
                                                name="enrollmentNo"
                                                rules={
                                                    [{ required: true, message: "Enrollement Number is required!" },
                                                    ]}
                                            >
                                                <Input placeholder="SR22BSIT000" />
                                            </Form.Item>
                                            <Form.Item
                                                label="Class/Course"
                                                name="course"
                                                rules={[
                                                    { required: true, message: "Please Enter your Course!" },
                                                ]}
                                            >
                                                <Input placeholder="BSC IT" />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>

                                            <Form.Item
                                                label="Division"
                                                name="division"
                                            >
                                                <Input placeholder="Enter your Division " />
                                            </Form.Item>
                                            <Form.Item
                                                label="Project Title"
                                                name="projectTitle"
                                            >
                                                <Input placeholder="Enter your Project Title " />
                                            </Form.Item>
                                            <Form.Item
                                                label="Report Duration"
                                                name="duration"
                                                rules={[{ required: true, message: "Please Select your Report date!" }]}
                                            >
                                                <RangePicker placeholder={["From", "To"]} style={{ width: "100%" }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </div>
                    </div>
            }
        </>
    )
}

export default ReportUserDetail
