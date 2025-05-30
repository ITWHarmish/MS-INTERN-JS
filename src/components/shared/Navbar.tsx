import { FieldTimeOutlined, FilePptOutlined, FileTextOutlined, LogoutOutlined, ProfileOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Menu, Modal, Popover, Form, message, Space } from "antd";
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

const Navbar = () => {

    const { user } = useSelector((state: RootState) => state.auth)
    const { telegramUser } = useSelector((state: RootState) => state.telegramAuth)
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
                    !user?.admin && <a style={{ color: "white" }} onClick={() => onMenuClick({ key: "profile" })} type="text">
                        <span style={{ display: "flex", alignItems: "center", gap: "7px", borderBottom: "1px solid white", paddingBottom: "10px", marginBottom: "3px" }}>
                            <ProfileOutlined style={{ fontSize: "16px" }} />
                            PROFILE
                        </span>
                    </a>
                }
                <a style={{ color: "white" }} onClick={handleLogout} type="text">
                    <span style={{ display: "flex", alignItems: "center", gap: "7px", marginTop: "0px" }}>
                        <LogoutOutlined style={{ fontSize: "16px" }} />
                        LOGOUT
                    </span>
                </a>
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
        else if (location.pathname === "/developing/team") {
            setCurrent("about us");
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
            <div id="navbar" className="nav">
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
                            { key: "timelog", icon: <FieldTimeOutlined />, label: <Link to={"/"}>TIMELOG</Link> },
                            { key: "monthly summary", icon: <FieldTimeOutlined />, label: <Link to={"/monthlySummary"}>MONTHLY SUMMARY</Link> },
                            { key: "hr policy", icon: <FileTextOutlined />, label: <Link to={"/hrPolicy"}>WORK POLICIES</Link> },
                            { key: "progress report", icon: <FilePptOutlined />, label: <Link to={"/report"}>PROGRESS REPORT</Link> },
                            user?.admin && { key: "intern list", icon: <UserOutlined />, label: <Link to={"/intern/list"}>INTERN LIST</Link> },
                            { key: "about us", icon: <TeamOutlined />, label: <Link to={"/developing/team"}>ABOUT US</Link> },
                        ]}
                    ></Menu>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>

                    {
                        user && (
                            telegramUser?.google?.tokens?.access_token ?
                                <Button style={{ fontFamily: "Rubik", color: "white", background: "transparent", display: "none" }} className="btn" disabled type="default"><span style={{ color: "grey" }}></span></Button>
                                :
                                <Button style={{ fontFamily: "Rubik" }} className="btn" onClick={googleLogin} type="default">
                                    {/* <GoogleOutlined style={{ fontSize: "20px", color: "#49494B", fill: 
                                    "#49494B" }}/> */}
                                    <img src="/svg/flat-color-icons_google.svg" alt="" />
                                </Button>
                        )
                    }
                    {telegramUser?.telegram?.session_id ? (
                        <Button style={{ fontFamily: "Rubik", display: "none" }} disabled>
                            <span style={{ color: "grey" }}>TELEGRAM CONNECTED</span>
                        </Button>
                    ) : (
                        <>
                            {
                                user && !user?.admin &&
                                <Button style={{ fontFamily: "Rubik", color: "#49494B", marginRight: "12px" }} onClick={showModal} type="default">
                                    {/* <GoogleOutlined style={{ fontSize: "20px", color: "#49494B", fill: "#49494B" }} /> */}
                                    <img src="/svg/telegram.png" alt="" />
                                </Button>
                            }
                            <Modal
                                title={isOtpStep ? "Enter OTP" : "Connect Telegram"}
                                open={isModalOpen}
                                footer={null}
                                onCancel={handleCancel}
                                width={450}
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
                                    <Form.Item style={{ marginBottom: "10px", textAlign: "right" }}>
                                        <Button type="primary" htmlType="submit" >
                                            {isOtpStep ? "Submit OTP" : "Send Code"}
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </>
                    )}
                    {/* {user &&
                        <div>
                            <Button onClick={onToggleTheme} style={{ border: "none" }}>
                                {currentTheme === "light" ? <MoonOutlined style={{ fontSize: "22px" }} /> : <SunOutlined style={{ fontSize: "22px" }} />}
                            </Button>
                        </div>
                    } */}
                    {user &&
                        <Popover style={{ marginLeft: "20px" }} content={popoverContent} trigger="click">
                            <span>
                                {/* <span style={{
                                    marginRight: "7px", cursor: "pointer", fontFamily: "Rubik"
                                }}
                                    className={token.colorBgLayout === "White" ? "" : "navbarSpanDark"}
                                >{user.fullName}</span> */}
                                <Avatar src={telegramUser?.google?.profile?.picture || undefined} style={{ marginRight: "20px", cursor: "pointer" }} icon={!telegramUser?.google?.profile?.picture ? initials : undefined} />
                            </span>
                        </Popover>
                    }
                </div>
            </div >
        </>
    );
};

export default Navbar;
