import { Form, Input, Button, Row, Col, DatePicker, message, Card, Spin, Select } from "antd";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import { UpdateAllUserDetails } from "../../services/authAPI";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IProfileForm, IProfileUpdate } from "../../types/IProfile";
import dayjs from "dayjs";

const FillUpForm = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate])

    const handleSubmit = async (values: IProfileForm) => {
        setLoading(true);

        try {
            const formattedValues: IProfileUpdate = {
                internsDetails: {
                    phoneNumber: values.phoneNumber,
                    address: values.address,
                    collegeName: values.collegeName,
                    stream: values.stream,
                    duration: values.duration,
                    githubURL: values.githubURL,
                    linkedinURL: values.linkedinURL,
                    joiningDate: dayjs(values.joiningDate).format("YYYY-MM-DD"),
                },
            };
            const response = await UpdateAllUserDetails(formattedValues)
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
        user &&
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
                                {/* <Form.Item
                                    label="Full Name"
                                    name="fullName"
                                    rules={[{ required: true, message: "Please input your full name!" }]}
                                >
                                    <Input placeholder="John Allen" />
                                </Form.Item> */}
                               
                                <Form.Item
                                    label="Stream/Language"
                                    name="stream"
                                    rules={[{ required: true, message: "Please select a Stream!" }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select Your Stream"
                                        optionFilterProp="label"
                                        options={[
                                            { value: "Nodejs", label: "Nodejs " },
                                            { value: "MERN Stack", label: "MERN Stack" },
                                            { value: "Reactjs", label: "Reactjs" },
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Duration"
                                    name="duration"
                                    rules={[{ required: true, message: "Please input the duration!" }]}
                                >
                                    <Input placeholder="6 months" />
                                </Form.Item>
                                <Form.Item
                                    label="Phone Number"
                                    name="phoneNumber"
                                    rules={[
                                        { required: true, message: "Please input your phone number!" },
                                        {
                                            pattern: /^[0-9]{10}$/,
                                            message: "Phone number must be 10 digits.",
                                        },
                                    ]}
                                >
                                    <Input placeholder="9876543210" />
                                </Form.Item>
                                <Form.Item
                                    label="Address"
                                    name="address"
                                    rules={[{ required: true, message: "Please input your address!" }]}
                                >
                                    <Input placeholder="45 Main St, Apartment 101, Cityville, 12345" />
                                </Form.Item>

                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label="College Name"
                                    name="collegeName"
                                >
                                    <Input placeholder="Enter your College fullName " />
                                </Form.Item>
                                <Form.Item
                                    label="GitHub URL"
                                    name="githubURL"
                                >
                                    <Input placeholder="Enter your GitHub URL " />
                                </Form.Item>
                                <Form.Item
                                    label="LinkedIn URL"
                                    name="linkedinURL"
                                >
                                    <Input placeholder="Enter your LinkedIn URL " />
                                </Form.Item>
                                {/* <Form.Item
                                    label="Date of Birth"
                                    name="dob"
                                    rules={[{ required: true, message: "Please input your date of birth!" }]}
                                >
                                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                                </Form.Item> */}
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
                            <div>
                                <Button type="primary" htmlType="submit" size="large">
                                    Submit
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Spin >
    );
};

export default FillUpForm;
