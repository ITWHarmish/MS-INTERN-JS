import { FieldTimeOutlined, FilePptOutlined, FileTextOutlined, LogoutOutlined, MoonOutlined, SunOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Menu, Modal, Popover, Form, message, Space, theme } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginApiTelegram, SubmitApiTelegram } from "../../services/telegramAPI";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchTelegram } from "../../redux/actions/telegramActions";
import { LogoutApi } from "../../services/authAPI";
import { setUser } from "../../redux/slices/authSlice";
import { clearTelegramData } from "../../redux/slices/telegramSlice";
import { API_END_POINT } from "../../utils/constants";
import Cookies from "js-cookie";
import { VerifyRevokedToken } from "../../services/googleApi";

const Navbar = ({ onToggleTheme, currentTheme }) => {

    const { user } = useSelector((state: RootState) => state.auth)
    const { telegramUser } = useSelector((state: RootState) => state.telegramAuth)
    const { token } = theme.useToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [current, setCurrent] = useState(user?.admin ? "hr policy" : "timelog");

    useEffect(() => {
        const checkGoogleToken = async () => {
            await VerifyRevokedToken();
        };
        checkGoogleToken();
    }, []);

    const fullName = user?.fullName;

    const getInitials = (name?: string) => {
        if (!name) return "";

        const words = name.trim().split(" ")

        if (words.length === 0) return "";
        if (words.length === 1) return words[0][0]?.toUpperCase() || "";
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };

    const initials = getInitials(fullName);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsOtpStep(false);
        setPhoneNumber("");
    };

    const showModal = () => {
        setIsModalOpen(true);
    };


    const onMenuClick = (e) => {
        if (e.key === "logo") return;
        setCurrent(e.key);

        if (e.key === "profile") {
            navigate("/profile");
        } else if (e.key === "timelog") {
            navigate("/");
        }
        else if (e.key === "monthly summary") {
            navigate("/monthlySummary");
        }
    };

    const handleLogout = async () => {
        await LogoutApi()
        dispatch(setUser(null));
        dispatch(clearTelegramData());
        Cookies.remove("ms_intern_jwt");
        navigate("/login");
        message.success("Logged out successfully!");
    }

    const popoverContent = (
        <div>
            <Space direction="vertical">
                {
                    !user?.admin && <Button onClick={() => onMenuClick({ key: "profile" })} type="text" icon={<UserOutlined />}>
                        Profile
                    </Button>
                }
                <Button onClick={handleLogout} type="text" icon={<LogoutOutlined />}>
                    Logout
                </Button>
            </Space>
        </div>
    );

    const handleLogin = async (values) => {
        setIsOtpStep(true);
        try {
            const phoneWithCountryCode = `+91${values.phone}`;
            setPhoneNumber(phoneWithCountryCode);
            await LoginApiTelegram(phoneWithCountryCode);
            dispatch(fetchTelegram())
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

    const googleLogin = async () => {
        window.location.href = `${API_END_POINT}/G_login`
    };


    useEffect(() => {
        dispatch(fetchTelegram());
        if (location.pathname === "/profile") {
            setCurrent("profile");
        }
        else if (location.pathname === "/monthlySummary") {
            setCurrent("monthly summary");
        }
        else if (location.pathname === "/report") {
            setCurrent("progress report");
        }
        else if (location.pathname === "/hrPolicy") {
            setCurrent("hr policy");
        }
        else if (location.pathname === "/intern/list") {
            setCurrent("intern list");
        }
        else if (!user?.admin) {
            setCurrent("timelog");
        }
        else {
            setCurrent("progress report");
        }
    }, [dispatch, user?.admin]);

    return (
        <>
            <div id="navbar"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #e0e0e0",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    padding: "0px 20px",
                }}
            >
                {user && (
                    <Menu
                        onClick={onMenuClick}
                        selectedKeys={[current]}
                        className="check"
                        style={{
                            gap: "1px",
                        }}
                        mode="horizontal"
                        items={[
                            {
                                key: "logo",
                                label: <img style={{ height: "30px", width: "auto", verticalAlign: "middle", cursor: "pointer", pointerEvents: "none", }} src="/toshalLogo.png" alt="Logo" />,
                            },
                            { key: "timelog", icon: <FieldTimeOutlined />, label: <Link to={"/"}>Timelog</Link> },
                            { key: "monthly summary", icon: <FieldTimeOutlined />, label: <Link to={"/monthlySummary"}>Monthly Summary</Link> },
                            { key: "hr policy", icon: <FileTextOutlined />, label: <Link to={"/hrPolicy"}>Work Policies</Link> },
                            { key: "progress report", icon: <FilePptOutlined />, label: <Link to={"/report"}>Progress Report</Link> },
                            user?.admin && { key: "intern list", icon: <UserOutlined />, label: <Link to={"/intern/list"}>Intern List</Link> },
                        ]}
                    ></Menu>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>

                    {
                        telegramUser?.google?.tokens?.access_token ?
                            <Button style={{ fontFamily: "Rubik" }} disabled type="default">Google Connected</Button>
                            :
                            <Button style={{ fontFamily: "Rubik" }} onClick={googleLogin} type="default">Connect Google</Button>
                    }
                    {telegramUser?.telegram?.session_id ? (
                        <Button style={{ fontFamily: "Rubik" }} type="default" disabled>
                            Telegram Connected
                        </Button>
                    ) : (
                        <>
                            {
                                user && !user?.admin &&
                                <Button style={{ fontFamily: "Rubik" }} onClick={showModal} type="default">
                                    Connect Telegram
                                </Button>
                            }
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
                                            label="Code (For OTP See the Telegram Chat) "
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
                                    <Form.Item style={{ marginBottom: "10px" }}>
                                        <Button type="primary" htmlType="submit" >
                                            {isOtpStep ? "Submit OTP" : "Send Code"}
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </>
                    )}
                    {user &&
                        <div>
                            <Button onClick={onToggleTheme} style={{ border: "none" }}>
                                {currentTheme === "light" ? <MoonOutlined style={{ fontSize: "22px" }} /> : <SunOutlined style={{ fontSize: "22px" }} />}
                            </Button>
                        </div>
                    }
                    {user &&
                        <Popover content={popoverContent} trigger="click">
                            <span>
                                <span style={{
                                    marginRight: "7px", cursor: "pointer", fontFamily: "Rubik"
                                }}
                                    className={token.colorBgLayout === "White" ? "" : "navbarSpanDark"}
                                >{user.fullName}</span>
                                <Avatar src={telegramUser?.google?.profile?.picture || undefined} style={{ marginRight: "7px", cursor: "pointer" }} icon={!telegramUser?.google?.profile?.picture ? initials : undefined} />
                            </span>
                        </Popover>
                    }
                </div>
            </div >
        </>
    );
};

export default Navbar;
