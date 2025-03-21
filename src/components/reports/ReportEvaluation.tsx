import { Button, Card, Col, Form, Input, message, Row, Select, Steps, theme } from "antd"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import { AddSelfEvaluation, GetProgressReport, GetRemark } from "../../services/progressReportAPI";
import { fetchProgressReport } from "../../redux/actions/progressReportActions";
import Spinner from "../../utils/Spinner";

const ReportEvaluation = () => {
    const { Step } = Steps;
    const { token } = theme.useToken();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(2);
    const [remarks, setRemarks] = useState(["", "", "", ""]);
    const { reportId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await GetProgressReport(reportId);
                setRemarks(res.externalGuideRemarks)
                if (res) {
                    form.setFieldsValue({
                        regularity: res.selfEvaluation.regularity,
                        punctuality: res.selfEvaluation.punctuality,
                        discipline: res.selfEvaluation.discipline,
                        learningAbility: res.selfEvaluation.learningAbility,
                        implementationAbility: res.selfEvaluation.implementationAbility,
                        remark1: res.externalGuideRemarks?.[0] || "",
                        remark2: res.externalGuideRemarks?.[1] || "",
                        remark3: res.externalGuideRemarks?.[2] || "",
                        remark4: res.externalGuideRemarks?.[3] || "",
                    });
                }
            } catch (error) {
                console.error("Error fetching progress report:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [form, reportId])

    const handleGenerateRemarks = async () => {
        try {
            setLoading(true);
            const values = form.getFieldsValue();
            const remarkPayload = {
                regularity: Number(values.regularity),
                punctuality: values.punctuality,
            };
            const remark = await GetRemark(remarkPayload);
            if (remark.remarks) {
                setRemarks(remark.remarks);
            }

            if (!remark || !remark.remarks) {
                throw new Error("Remark data is missing");
            }

            form.setFieldsValue({
                remark1: remark.remarks?.[0] || "",
                remark2: remark.remarks?.[1] || "",
                remark3: remark.remarks?.[2] || "",
                remark4: remark.remarks?.[3] || "",
            });

        } catch (error) {
            console.error("Error fetching remark", error);
            message.error("Failed to fetch remark");
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (values) => {
        const payload = {
            selfEvaluation: {
                regularity: Number(values.regularity),
                punctuality: values.punctuality,
                discipline: values.discipline,
                learningAbility: values.learningAbility,
                implementationAbility: values.implementationAbility
            },
            externalGuideRemarks: remarks
        }


        try {
            setLoading(true);
            await AddSelfEvaluation(reportId, payload);
            message.success("Evaluation submitted successfully!");
            dispatch(fetchProgressReport());

            navigate("/report/submit")
            handleNext();
        } catch (error) {
            message.error("Error while adding Self Evaluation");
            console.error("Failed to add Self Evaluation", error);
        } finally {
            setLoading(false);
        }
    }

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    }

    const updateRemark = (index, value) => {
        setRemarks((prevRemarks) => {
            const updatedRemarks = [...prevRemarks];
            updatedRemarks[index] = value;
            return updatedRemarks;
        });
    };

    return (
        <>
            {loading ?
                <Spinner /> :
                <div style={{ marginBottom: "10px", height: "90rem" }}>
                    <div style={{ backgroundColor: token.colorBgLayout === "White" ? "#f0f2f5" : "#1a1c1f", height: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", flexDirection: "column" }}>
                            <Steps current={currentStep} style={{ width: "80%", maxWidth: "800px", marginBottom: "20px" }}>
                                <Step title="Fill Details" />
                                <Step title="Add Tasks" />
                                <Step title="Intern Evaluation" />
                                <Step title="Review & Submit" />
                            </Steps>
                            <Card
                                title="Interns Evaluation"
                                extra={
                                    <Button onClick={() => form.submit()} loading={loading} type="primary" htmlType="submit">
                                        Next
                                    </Button>
                                }
                                style={{ width: "80%", maxWidth: "900px", padding: "24px", marginBottom: "40px" }}
                            >
                                <Form
                                    form={form}
                                    onFinish={handleSubmit}
                                    layout="vertical"
                                >
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Regularity"
                                                name="regularity"
                                                rules={[{ required: true, message: "Regularity is required!" }]}
                                            >
                                                <Input type="number" placeholder="100% " />
                                            </Form.Item>

                                            <Form.Item
                                                label="Punctuality"
                                                name="punctuality"
                                                rules={
                                                    [{ required: true, message: "Punctuality is required!" },
                                                    ]}
                                            >
                                                <Select
                                                    placeholder="Select Punctuality"
                                                    options={[
                                                        { value: 'good', label: 'Good' },
                                                        { value: 'average', label: 'Average' },
                                                        { value: 'poor', label: 'Poor' },
                                                    ]}

                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="Implementation Ability"
                                                name="implementationAbility"
                                                rules={
                                                    [{ required: true, message: "Implementation Ability is required!" },
                                                    ]}
                                            >
                                                <Select
                                                    placeholder="Select Implementation Ability"
                                                    options={[
                                                        { value: 'good', label: 'Good' },
                                                        { value: 'average', label: 'Average' },
                                                        { value: 'poor', label: 'Poor' },
                                                    ]}
                                                />
                                            </Form.Item>


                                        </Col>

                                        <Col span={12}>


                                            <Form.Item
                                                label="Learning Ability"
                                                name="learningAbility"
                                                rules={
                                                    [{ required: true, message: "Learning Ability is required!" },
                                                    ]}
                                            >
                                                <Select
                                                    placeholder="Select Learning Ability"
                                                    options={[
                                                        { value: 'good', label: 'Good' },
                                                        { value: 'average', label: 'Average' },
                                                        { value: 'poor', label: 'Poor' },
                                                    ]}

                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="Discipline"
                                                name="discipline"
                                                rules={[
                                                    { required: true, message: "Discipline is required!" },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="Select Discipline"
                                                    options={[
                                                        { value: 'good', label: 'Good' },
                                                        { value: 'average', label: 'Average' },
                                                        { value: 'poor', label: 'Poor' },
                                                    ]}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item
                                        label={
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "800px" }}>
                                                <span>Remark by External Guide</span>
                                                <Button
                                                    onClick={handleGenerateRemarks}
                                                    loading={loading}
                                                    style={{ borderRadius: "20px", marginLeft: "0px" }}
                                                    size="small"
                                                    type="primary"
                                                >
                                                    <span>Generate Remark with AI</span>
                                                    <img
                                                        style={{ height: "16px", filter: "brightness(0) invert(1)", marginLeft: "8px" }}
                                                        src="/geminiIcon.svg"
                                                        alt=""
                                                    />
                                                </Button>
                                            </div>
                                        }
                                    >
                                        <Input name="remark1" value={remarks[0]} placeholder="1." style={{ height: "40px" }} onChange={(e) => updateRemark(0, e.target.value)} />
                                        <Input name="remark2" value={remarks[1]} placeholder="2." style={{ marginTop: "8px", height: "40px" }} onChange={(e) => updateRemark(1, e.target.value)} />
                                        <Input name="remark3" value={remarks[2]} placeholder="3." style={{ marginTop: "8px", height: "40px" }} onChange={(e) => updateRemark(2, e.target.value)} />
                                        <Input name="remark4" value={remarks[3]} placeholder="4." style={{ marginTop: "8px", height: "40px" }} onChange={(e) => updateRemark(3, e.target.value)} />
                                    </Form.Item>

                                </Form>
                            </Card>
                        </div>
                    </div >
                </div>
            }
        </>
    )
}

export default ReportEvaluation
