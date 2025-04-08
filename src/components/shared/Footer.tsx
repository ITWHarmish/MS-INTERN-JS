import { Typography } from "antd"

const Footer = () => {
    return (
        <div id="footer"
            style={{
                backgroundColor: "rgba(60, 60, 60, 0.274)",
                borderTop:"1px solid #ffffffa1",
                width: "100%",
                height: "42px",
                position: "fixed",
                bottom: "0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography.Text
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "15px",
                    color: "white",
                }}
            >
                Toshal Management System ©{new Date().getFullYear()} Created by Toshal Infotech
            </Typography.Text>
        </div>
    )
}

export default Footer
