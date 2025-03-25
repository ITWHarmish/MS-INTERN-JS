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
import toshalImg from "../../assets/toshal logo without bg.png"

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
            <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
                <div className="wrapper">
                    <img src={toshalImg} />
                    <h2>FILL UP YOUR DETAILS</h2>
                        <Form
                            onFinish={handleSubmit}
                            layout="vertical"
                        >
                            <Row gutter={24}>
                                <Col span={12}>
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
                                        rules={
                                            [{ required: true, message: "Please input the duration!" },
                                            { pattern: /^[0-9]+$/, message: "Only numbers are allowed!" },
                                            ]}
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
                                        label="College Name"
                                        name="collegeName"
                                    >
                                        <Input placeholder="Enter your College fullName " />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>

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
                                <div className="btn">
                                    <Button style={{ width: "30%", margin: "10px auto", display: "block" }} type="primary" htmlType="submit" size="large">
                                        SUBMIT
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    {/* </Card> */}
                </div>
            </div>
        </Spin >
    );
};

export default FillUpForm;
