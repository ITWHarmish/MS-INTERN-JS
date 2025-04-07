import { Input, Button, Modal, Form, Row, Col, message } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../../utils/Spinner";
import { UserRegister } from "../../services/authAPI";
import { RootState } from "../../redux/store";

const AddIntern = ({ visible, onClose, fetchInterns }) => {

    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state: RootState) => state.auth)

    const handleSubmit = async (values) => {
        const payload = {
            fullName: values.fullName,
            password: values.password,
            email: values.email,
            spaceId: values.spaceId,
            spreadId: values.spreadId,
            mentorFullName: user.fullName,
            mentorEmail: user.email,
            mentorId: user._id,

        }
        try {
            setLoading(true);
            await UserRegister(payload);
            fetchInterns();
            message.success("Intern Added Successfully!");
        } catch (error) {
            console.error("Error While Adding Intern: ", error);
            message.error("Intern failed to add!");
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <Modal title={"Add Intern"} open={visible} onCancel={onClose} footer={null} centered width={1000}>
            {loading ? <Spinner /> :
                <div style={{ padding: "20px" }}>

                    <Form
                        onFinish={handleSubmit}
                        layout="vertical"
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label="Full Name"
                                    name="fullName"
                                    rules={[{ required: true, message: "Please Enter Full Name!" }]}
                                >
                                    <Input placeholder="Roman Reigns" />
                                </Form.Item>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: "Please enter your password!" }]}
                                >
                                    <Input.Password placeholder="Password" />
                                </Form.Item>
                                <Form.Item
                                    label="Spread Id"
                                    name="spreadId"
                                    rules={[
                                        { required: true, message: "Please Enter the Spread Id!" },
                                    ]}
                                >
                                    <Input placeholder="1608285224" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>

                                <Form.Item
                                    label="E-Mail"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please enter your email!' },
                                        { type: 'email', message: 'Please enter a valid email!' },
                                    ]}
                                >
                                    <Input
                                        placeholder="E-Mail"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    dependencies={["password"]}
                                    rules={[
                                        { required: true, message: "Please confirm your password!" },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue("password") === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error("Passwords do not match!"));
                                            },
                                        })
                                    ]}
                                >
                                    <Input.Password placeholder="Confirm Password" />
                                </Form.Item>
                                <Form.Item
                                    label="Space Id"
                                    name="spaceId"
                                    rules={[
                                        { required: true, message: "Please Enter the Space Id!" },
                                    ]}
                                >
                                    <Input placeholder="AAAAivSqCkQ" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <div>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            }
        </Modal >
    );
};

export default AddIntern;