import { Typography } from "antd"

const Footer = () => {
    return (
        <div
            style={{
                backgroundColor: "#ebf2ed",
                width: "100%",
                height:"5vh",
                padding: "10px 0",
                position:"fixed",
                bottom: "0px",
                display:"flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography.Text
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems:"center",
                    fontSize: "15px",
                }}
            >
                Toshal Management System ©{new Date().getFullYear()} Created by Toshal Infotech 
            </Typography.Text>
        </div>
    )
}

export default Footer
