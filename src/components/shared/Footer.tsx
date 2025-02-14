import { theme, Typography } from "antd"

const Footer = () => {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                backgroundColor: token.colorPrimaryBg,
                borderTop:"1px solid #fafafa",
                width: "100%",
                height: "50px",
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
                }}
            >
                Toshal Management System ©{new Date().getFullYear()} Created by Toshal Infotech
            </Typography.Text>
        </div>
    )
}

export default Footer
