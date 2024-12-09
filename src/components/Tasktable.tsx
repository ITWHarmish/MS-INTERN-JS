import { DeleteOutlined, EditOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Card, Col, ConfigProvider, Input, Row, Select, Table, TimePicker, Typography } from 'antd'
import { useState } from 'react';
// import React, { useState } from 'react'

const Tasktable = () => {
    // const [currentUser, setcurrentUser] = useState("vinay")
    const [showCard, setShowCard] = useState(false)
    const { RangePicker } = TimePicker;
    const SetRow = ({ label, value, textStyle }: any) => {
        return (
            <Row gutter={16}>
                <Col md={12} span={18}>
                    <Typography.Text style={textStyle}>{label}</Typography.Text>
                </Col>
                <Col md={12} span={6}>
                    <Typography.Text style={textStyle}>{value}</Typography.Text>
                </Col>
            </Row>
        );
    };
    // Define columns
    const columns = [
        { title: "Start Time", dataIndex: "startTime", key: "startTime" },
        { title: "End Time", dataIndex: "endTime", key: "endTime" },
        { title: "Hours", dataIndex: "hours", key: "hours" },
        { title: "Category", dataIndex: "category", key: "category" },
        { title: "Description", dataIndex: "description", key: "description", width: 700 },
        {
            title: "Actions", dataIndex: "actions", key: "actions", render: (_, data) => (
                <div>
                    {data ? (
                        <>
                            <div style={{ display: "flex", gap: "20px", cursor: "pointer" }} >
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            // Seed Token
                                            colorPrimary: '#c9194b',
                                            borderRadius: 20,
                                        },
                                    }}
                                >
                                    <Button shape='circle' icon={<EditOutlined />} size='small' ></Button>
                                    <Button shape='circle' danger icon={<DeleteOutlined />} size='small'></Button>
                                </ConfigProvider>
                            </div>
                        </>
                    ) : (
                        <span>No Data</span>
                    )}
                </div>
            ),
        },
    ];

    const data = [
        {
            key: "1",
            startTime: "09:00 ",
            endTime: "12:00 ",
            hours: 3,
            category: "Work",
            description: "Completed module 1",
            actions: <Button>Edit</Button>,
        },
        {
            key: "2",
            startTime: "01:00 ",
            endTime: "02:00 ",
            hours: 1,
            category: "Break",
            description: "Lunch break",
        },
        {
            key: "3",
            startTime: "02:00 ",
            endTime: "05:00 ",
            hours: 3,
            category: "Meeting",
            description: "Client discussion",
        },
    ];
    // const data  = []

    const [timeLog, setTimeLog] = useState({
        startTime: "",
        endTime: "",
        category: "",
        description: ""
    })

    const handleChange = (e) => {
        setTimeLog({ ...timeLog, [e.target.name]: e.target.value })
    }
    const handleChangeCategory = (e) => {
        const selectedCategory: string = e.target.value
        setTimeLog({...timeLog, category: selectedCategory })
    }

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
                <div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "20px",
                        }}
                    >
                        {/* Time Range Picker */}
                        <RangePicker
                            format="HH:mm"
                            style={{
                                borderRadius: "20px",
                                width: "200px",
                            }}
                            onChange={handleChange}
                        />

                        {/* Category Dropdown */}
                        <Select
                            style={{
                                width: "150px",
                            }}
                            placeholder="Category"
                            options={[
                                { value: "work", label: "Work" },
                                { value: "break", label: "Break" },
                                { value: "meeting", label: "Meeting" },
                            ]}
                            value={timeLog.category}
                            onChange={handleChangeCategory}
                        />

                        {/* Description Input */}
                        <Input
                            placeholder="Description"
                            style={{
                                width: "400px",
                            }}
                            name='description'
                            value={timeLog.description}
                            onChange={handleChange}
                        />

                        <Button
                            type="primary">
                            Submit
                        </Button>
                    </div >

                    <div style={{ padding: "20px" }}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={false} // No pagination for now
                            bordered
                            size='small'

                        />
                    </div>

                    <div>
                        <Card
                            size='small'
                            title={
                                <SetRow
                                    label={"Vinay Singh"}
                                    value={"Work Duration"}
                                    textStyle={{ fontWeight: "bold" }}
                                />
                            }
                            className={`calculate-hours-card ${showCard ? "show-card" : ""} `}
                        >
                            <Button
                                type="primary"
                                icon={showCard ? <RightOutlined /> : <LeftOutlined />}
                                className="arrow-toggle"
                                onClick={() => setShowCard(!showCard)}
                            />

                            <SetRow label={"Total"} value={0} textStyle={{ fontWeight: "bold" }} />
                        </Card>
                    </div>
                </div>
            </ConfigProvider>
        </>
    )
}

export default Tasktable
