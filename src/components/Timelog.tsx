import {ConfigProvider, DatePicker } from 'antd'
import dayjs from 'dayjs'

const Timelog = () => {
    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        // Seed Token
                        colorPrimary: '#c9194b',
                        borderRadius: 20,
                    },
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        // marginBottom: "20px",
                        // padding: "20px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "28px",
                            fontWeight: "600",
                            color: "#333333",
                        }}
                    >
                        Timelog
                    </div>
                    <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>

                        <DatePicker  defaultValue={dayjs(Date.now() )} ></DatePicker>

                    </div>
                </div>
                <div
                    style={{
                        borderBottom: "1px solid #e0e0e0",
                        margin: "0px 0px 5px 0px",
                    }}
                >
                </div>
            </ConfigProvider>
        </>
    )
}

export default Timelog
