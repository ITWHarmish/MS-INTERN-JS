import { Badge, Col, Row, Space } from "antd"
import Home from "./Home"
import Dashboard from "./Dashboard"
import Timelog from "./Timelog"
import Tasktable from "./Tasktable"

const MainPage = () => {
    return (
        <>
            {/* <Space direction="vertical" size={16}> */}
            <Row gutter={16}>
                <Col md={12} span={24}>
                    {/* <Space direction="vertical" size={16}> */}
                    {/* <Badge.Ribbon color="#9666d6" text="New">
                                <Home />
                            </Badge.Ribbon> */}
                    {/* <Timelog /> */}
                    <Home />

                    {/* <Tasktable /> */}
                    {/* </Space> */}
                </Col>
                <Col md={12} span={24}>
                    {/* <Space direction="vertical" size={16}> */}
                    <Dashboard />
                    {/* </Space> */}
                </Col>
            </Row>
            {/* </Space> */}
        </>
    )
}

export default MainPage
