import { Typography } from "antd"

const Footer = () => {
    return (
        <div
            style={{
                backgroundColor: "#ebf2ed",
                justifySelf: "end",
                width: "100vw",
                padding: "10px 0",
            }}
        >
            <Typography.Text
                style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "15px",
                    marginTop: "auto 0 0 0",
                }}
            >
                @ToshalInfotech{new Date().getFullYear()}
            </Typography.Text>
        </div>
    )
}

export default Footer
