import { FieldTimeOutlined, LogoutOutlined, PieChartOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Button, ConfigProvider, Menu, Popover } from "antd"
import { useState } from "react"
import { Link } from "react-router-dom"

const Navbar = () => {

    const [user, setUser] = useState(true)
    // const [current, setCurrent] = useState(""); // Set the default active key

    const [current, setCurrent] = useState("timelog"); // Initialize with the current path

    // useEffect(() => {
    //     setCurrent(location.pathname); // Update current whenever location changes
    // }, []);

    const onMenuClick = (e) => {
        setCurrent(e.key); // Update the active key on click
    };

    const popoverContent = (
        <div>
            <Button type="text" icon={<LogoutOutlined />} style={{}}>
                Logout
            </Button>
        </div>
    );

    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        // Seed Token
                        colorPrimary: '#c9194b',
                        borderRadius: 20,
                        margin: 20
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
                        padding: "0px 20px"
                    }}
                >
                    <Menu
                        onClick={onMenuClick}
                        selectedKeys={[current]}
                        style={{
                            display: "flex",
                            gap: "1px",
                            // padding: "15px"
                            // fontSize: "16px",
                            // fontWeight: "500",
                        }}
                        mode="horizontal"
                        items={[
                            { key: "dashboard", icon: <PieChartOutlined />, 
                                label: <Link to={"/dashboard"}>Dashboard</Link>
                             },
                            { key: "timelog", icon: <FieldTimeOutlined />, label: <Link to={"/timelog"}>Timelog</Link> },
                        ]}
                    ></Menu>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <Button
                            type="default">
                            Connect Google
                        </Button>
                        {
                            user ?
                                <>
                                    <Popover content={popoverContent} trigger="click">
                                        <div style={{ display: "flex", alignItems: "center", gap: "0px", cursor: "pointer" }}>

                                            <Button
                                                type="text">
                                                Vinay Singh
                                            </Button>
                                            <Avatar style={{ marginRight: "7px" }} size="small" icon={<UserOutlined />} />
                                            {/* </ConfigProvider> */}
                                        </div>
                                    </Popover>
                                </>
                                :
                                <Button
                                    type="default">
                                    Connect Telegram
                                </Button>
                        }
                    </div>
                </div>

            </ConfigProvider>
        </>
    )
}

export default Navbar
