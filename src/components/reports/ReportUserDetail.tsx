import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Steps,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddUserReportDetails,
  GetProgressReport,
  UpdateUserDetailsProgressReport,
} from "../../services/progressReportAPI";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
// import { useDispatch } from "react-redux";
// import { fetchProgressReport } from "../../redux/actions/progressReportActions";
import Spinner from "../../utils/Spinner";
import "./ProgressReport.css";
import { progressReportHook } from "../../Hooks/progressReportsHook";
import { useQueryClient } from "@tanstack/react-query";

interface FormValues {
  studentName: string;
  enrollmentNo: string;
  course: string;
  division?: string;
  projectTitle?: string;
  duration: [dayjs.Dayjs, dayjs.Dayjs];
}

const ReportUserDetail = () => {
  const { RangePicker } = DatePicker;
  const { Step } = Steps;
  const { reportId } = useParams();
  //   const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useSelector((state: RootState) => state.auth);
  //   const { progressReport } = useSelector((state: RootState) => state.report);

  const { data: progressReport = [] } = progressReportHook();
  const QueryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }
        if (user.admin || user) {
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
                : [dayjs(), dayjs().add(1, "month")],
            });
          }
        } else {
          const report = progressReport.find(
            (report) => report._id === reportId
          );
          if (report && isMounted) {
            form.setFieldsValue({
              studentName: report.studentName,
              enrollmentNo: report.enrollmentNo,
              course: report.course,
              division: report.division,
              projectTitle: report.projectTitle,
              duration: report.duration
                ? [dayjs(report.duration.from), dayjs(report.duration.to)]
                : [dayjs(), dayjs().add(1, "month")],
            });
          }
        }
      } catch (error) {
        console.error("error While Fetching", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [reportId, progressReport, form, user, user?.admin]);

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      if (!values.duration || values.duration.length !== 2) {
        message.error("Please select a valid date range");
        return;
      }

      const formatDate = values.duration.map((date) =>
        dayjs(date).format("YYYY-MM-DD")
      );

      if (user?.admin) {
        if (!reportId) {
          message.error("Report ID not found");
          return;
        }

        await UpdateUserDetailsProgressReport(reportId, {
          ...values,
          duration: {
            from: formatDate[0],
            to: formatDate[1],
          },
        });

        message.success("Successfully updated report");
        // dispatch(fetchProgressReport());
        QueryClient.invalidateQueries({ queryKey: ["allchProgressReport"] });
        navigate(`/reporttable/${reportId}`);
        handleNext();
        return;
      }

      if (!user?.internshipDetails?.mentor) {
        message.error("Mentor information not found");
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
      };

      let response;
      if (reportId) {
        await UpdateUserDetailsProgressReport(reportId, payload);
        message.success("Successfully updated report");
        response = reportId;
      } else {
        const res = await AddUserReportDetails(payload);
        message.success("Successfully created new report");
        response = res.report._id;
      }

      //   dispatch(fetchProgressReport());
      QueryClient.invalidateQueries({ queryKey: ["allchProgressReport"] });

      if (response) {
        navigate(`/reporttable/${response}`);
        handleNext();
      }
    } catch (error) {
      console.error("Error processing report:", error);
      message.error("Failed to process report");
    } finally {
      setLoading(false);
    }
  };
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div style={{ height: "calc(100vh - 130px)", padding: "20px" }}>
          <Row gutter={6} style={{ height: "calc(100vh - 130px)" }}>
            <Col style={{}}>
              <div style={{}}>
                <Steps
                  direction="vertical"
                  current={currentStep}
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
              </div>
            </Col>
            <Col>
              <Card
                title="FILL UP YOUR DETAILS"
                extra={
                  <Button
                    onClick={() => form.submit()}
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                  >
                    NEXT
                  </Button>
                }
                style={{
                  width: "calc(100vw - 400px)",
                  height: "calc(100vh - 160px)",
                }}
              >
                <Form
                  form={form}
                  onFinish={handleSubmit}
                  layout="vertical"
                  style={{ padding: "10px" }}
                >
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        label="STUDENT NAME"
                        name="studentName"
                        rules={[
                          { required: true, message: "Name is required!" },
                        ]}
                      >
                        <Input placeholder="Enter Full Name " />
                      </Form.Item>
                      <Form.Item
                        label="ENROLLMENT NUMBER"
                        name="enrollmentNo"
                        rules={[
                          {
                            required: true,
                            message: "Enrollement Number is required!",
                          },
                        ]}
                      >
                        <Input placeholder="SR22BSIT000" />
                      </Form.Item>
                      <Form.Item
                        label="CLASS/COURSE"
                        name="course"
                        rules={[
                          {
                            required: true,
                            message: "Please Enter your Course!",
                          },
                        ]}
                      >
                        <Input placeholder="BSC IT" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="DIVISION" name="division">
                        <Input placeholder="Enter your Division " />
                      </Form.Item>
                      <Form.Item label="PROJECT TITLE" name="projectTitle">
                        <Input placeholder="Enter your Project Title " />
                      </Form.Item>
                      <Form.Item
                        label="REPORT DURATIION"
                        name="duration"
                        rules={[
                          {
                            required: true,
                            message: "Please Select your Report date!",
                          },
                        ]}
                      >
                        <RangePicker
                          placeholder={["From", "To"]}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      )}
      <div className="report-overlay"></div>
    </>
  );
};

export default ReportUserDetail;
