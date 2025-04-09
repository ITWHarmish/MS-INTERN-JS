import { Typography } from "antd"

const Footer = () => {
    return (
        <div id="footer"
            style={{
                margin:"0px 20px",
                borderTop:"1px solid #ffffffa1",
                width: "-webkit-fill-available",
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
