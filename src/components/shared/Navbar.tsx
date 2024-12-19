import { FieldTimeOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, ConfigProvider, Input, Menu, Modal, Popover, Form, message } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginApiTelegram, LogoutApiTelegram, SubmitApiTelegram } from "../../services/telegramAPI";
import { useDispatch, useSelector } from "react-redux";
import { clearTelegramData, setTelegramUser } from "../../app/slices/telegramSlice";
import { RootState } from "../../app/store";

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");

    const { telegramUser } = useSelector((state: RootState) => state.telegramAuth)
    const dispatch = useDispatch();

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsOtpStep(false);
        setPhoneNumber("");
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const [current, setCurrent] = useState("timelog");

    const onMenuClick = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        const phoneNo = telegramUser?.telegram?.telegramData?.phone;
        const phone = `+${phoneNo}`;
        await LogoutApiTelegram(phone)
        dispatch(clearTelegramData());
        // dispatch(setUser(null))
        message.success("Telegram logged out successfully!");
    }

    const popoverContent = (
        <div>
            <Button onClick={handleLogout} type="text" icon={<LogoutOutlined />}>
                Logout
            </Button>
        </div>
    );

    const handleLogin = async (values) => {
        setIsOtpStep(true);
        try {
            const phoneWithCountryCode = `+91${values.phone}`;
            setPhoneNumber(phoneWithCountryCode);
            const res = await LoginApiTelegram(phoneWithCountryCode);
            dispatch(setTelegramUser(res.telegramUser))
        } catch (error) {
            console.error("Error while sending phone number:", error);
            message.error("Failed to send code. Please try again.");
        }
    };
    const handleOtpSubmit = async (values) => {
        try {
            await SubmitApiTelegram({ phone: phoneNumber, code: values.code })
            message.success("Logged in successfully!");
            handleCancel();
        } catch (error) {
            message.error(error.response?.data?.error || "Invalid code. Please try again.");
        }
    };


    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#c9194b",
                        borderRadius: 20,
                        margin: 20,
                    },
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #e0e0e0",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        padding: "0px 20px",
                    }}
                >
                    <Menu
                        onClick={onMenuClick}
                        selectedKeys={[current]}
                        style={{
                            display: "flex",
                            gap: "1px",
                        }}
                        mode="horizontal"
                        items={[
                            // {
                            //     key: "dashboard",
                            //     icon: <PieChartOutlined />,
                            //     label: <Link to={"/dashboard"}>Dashboard</Link>,
                            // },
                            { key: "timelog", icon: <FieldTimeOutlined />, label: <Link to={"/"}>Timelog</Link> },
                        ]}
                    ></Menu>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <Button type="default">Connect Google</Button>
                        {telegramUser ? (
                            <Popover content={popoverContent} trigger="click">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <Button type="text">{telegramUser?.telegram?.telegramData?.firstName}</Button>
                                </div>
                            </Popover>
                        ) : (
                            <>
                                <Button onClick={showModal} type="default">
                                    Connect Telegram
                                </Button>

                                <Modal
                                    title={isOtpStep ? "Enter OTP" : "Connect Telegram"}
                                    open={isModalOpen}
                                    footer={null}
                                    onCancel={handleCancel}
                                >
                                    <Form
                                        onFinish={isOtpStep ? handleOtpSubmit : handleLogin}
                                        layout="vertical"
                                    >
                                        {!isOtpStep && (
                                            <Form.Item
                                                label="Phone Number"
                                                name="phone"
                                                rules={[
                                                    { required: true, message: "Please enter your phone number!" },
                                                    {
                                                        pattern: /^[0-9]{10}$/,
                                                        message: "Phone number must be 10 digits.",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter your phone number" />
                                            </Form.Item>
                                        )}
                                        {isOtpStep && (
                                            <Form.Item
                                                label="Code"
                                                name="code"
                                                rules={[
                                                    { required: true, message: "Please enter the code!" },
                                                    {
                                                        pattern: /^[0-9]{5}$/,
                                                        message: "Code must be 5 digits.",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter the code" />
                                            </Form.Item>
                                        )}
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" >
                                                {isOtpStep ? "Submit OTP" : "Send Code"}
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </>
                        )}
                        <span>Vinay Singh</span>
                        <Avatar style={{ marginRight: "7px" }} size="small" icon={<UserOutlined />} />
                    </div>
                </div>
            </ConfigProvider>
        </>
    );
};

export default Navbar;
