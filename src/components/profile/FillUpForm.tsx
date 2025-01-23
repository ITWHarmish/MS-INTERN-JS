import { Form, Input, Button, Row, Col, DatePicker, message, Card, Spin } from "antd";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import dayjs from "dayjs";
import { UpdateUserDetails } from "../../services/authAPI";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IProfileForm } from "../../types/IProfile";

const FillUpForm = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.fullname) {
                navigate("/")
            }
        }
    }, [user, navigate])

    const handleSubmit = async (values: IProfileForm) => {
        setLoading(true);

        try {
            const formattedValues = {
                ...values,
                dob: dayjs(values.dob).format("YYYY-MM-DD"),
                joiningDate: dayjs(values.joiningDate).format("YYYY-MM-DD"),
            };
            const response = await UpdateUserDetails(formattedValues)
            dispatch(setUser(response.user));
            message.success("Updated successful!");
            navigate("/")
        } catch (error) {
            message.error("Updation failed! Please try again.");
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Spin size="large" tip="Loading..." spinning={loading} className="full-page-spin">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "20px" }}>
                <Card
                    title="Fill Up Your Details"
                    style={{ width: "80%", maxWidth: "900px", padding: "24px" }}
                >
                    <Form
                        onFinish={handleSubmit}
                        layout="vertical"
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label="Full Name"
                                    name="fullName"
                                    rules={[{ required: true, message: "Please input your full name!" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Duration"
                                    name="duration"
                                    rules={[{ required: true, message: "Please input the duration!" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Stream/Language"
                                    name="stream"
                                    rules={[{ required: true, message: "Please input your stream!" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Phone Number"
                                    name="phoneNumber"
                                    rules={[{ required: true, message: "Please input your phone number!" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Address"
                                    name="address"
                                    rules={[{ required: true, message: "Please input your address!" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="GitHub URL"
                                    name="githubURL"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="LinkedIn URL"
                                    name="linkedinURL"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={12}>

                                <Form.Item
                                    label="HR Email"
                                    name="hrEmail"
                                    rules={[{ required: true, message: "Please input your HR email!" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="HR Full Name"
                                    name="hrFullName"
                                    rules={[{ required: true, message: "Please input your HR full name!" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Mentor Email"
                                    name="mentorEmail"
                                    rules={[{ required: true, message: "Please input your mentor email!" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Mentor Full Name"
                                    name="mentorFullName"
                                    rules={[{ required: true, message: "Please input your mentor full name!" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Date of Birth"
                                    name="dob"
                                    rules={[{ required: true, message: "Please input your date of birth!" }]}
                                >
                                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                                </Form.Item>
                                <Form.Item
                                    label="Joining Date"
                                    name="joiningDate"
                                    rules={[{ required: true, message: "Please input your joining date!" }]}
                                >
                                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <div style={{textAlign:"center" }}>
                                <Button type="primary" htmlType="submit" size="large">
                                    Submit
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Spin>
    );
};

export default FillUpForm;
