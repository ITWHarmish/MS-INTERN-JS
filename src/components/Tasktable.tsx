import { DeleteOutlined, EditOutlined, LeftOutlined, RightOutlined, } from '@ant-design/icons';
import { Button, Card, Col, ConfigProvider, Input, message, Row, Select, Table, TimePicker, Typography, } from 'antd';
import React, { useEffect, useState } from 'react';
import { AddTimelog, DeleteTimelog, UpdateTimelog } from '../services/timelogAPI';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import { fetchTimelogs } from '../app/actions/timelogActions';
import { AppDispatch, RootState } from '../app/store';

const Tasktable = () => {
    const [showCard, setShowCard] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        startTime: '',
        endTime: '',
        category: '',
        description: '',
    });
    const { timelogs } = useSelector((state: RootState) => state.timelog)

    const [editingId, setEditingId] = useState<string | null>(null);

    const { RangePicker } = TimePicker;

    const SetRow = ({ label, value, textStyle }: any) => (
        <Row gutter={16}>
            <Col md={12} span={18}>
                <Typography.Text style={textStyle}>{label}</Typography.Text>
            </Col>
            <Col md={12} span={6}>
                <Typography.Text style={textStyle}>{value}</Typography.Text>
            </Col>
        </Row>
    );

    const columns: any[] = [
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (startTime: string) =>
                new Date(startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }),
        },
        {
            title: 'End Time',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (endTime: string) =>
                new Date(endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }),
        },
        {
            title: 'Hours',
            dataIndex: 'hours',
            key: 'hours',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: 100,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 700,
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '20px', cursor: 'pointer' }}>
                    <Button
                        shape="circle"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => {
                            handleEdit(record);
                        }}
                    />
                    <Button
                        shape="circle"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => {
                           handleDelete(record._id);
                        }}
                    />
                </div>
            ),
        },
    ];

    const handleRangeChange = (value: any) => {
        if (value) {
            setFormData({
                ...formData,
                startTime: value[0]?.format('HH:mm'),
                endTime: value[1]?.format('HH:mm'),
            });
        }
    };

    const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, description: e.target.value });
    };

    const handleChangeCategory = (value: string) => {
        setFormData({ ...formData, category: value });
    };

    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async () => {
        if (!formData.startTime || !formData.endTime || !formData.category || !formData.description) {
            message.error("All fields are required!");
            return;
        }

        if (editingId) {
            try {
                await UpdateTimelog(editingId, formData);
                dispatch(fetchTimelogs())
                message.success('TimeLog Updated successful!');

            } catch (error) {
                console.error('Error While Updating the time log:', error);
                message.error('Updated Failed! Please try again.');
            }
        } else {
            try {
                await AddTimelog(formData);
                dispatch(fetchTimelogs())
                message.success('TimeLog Added successful!');
            } catch (error) {
                console.error('Error While Deleting the time log:', error);
                message.error('Submiision Failed! Please try again.');
            }
        }
        setFormData({
            startTime: '',
            endTime: '',
            category: '',
            description: '',
        }); 

        setEditingId(null);

    };

    const handleEdit = (record: any) => {
        setEditingId(record._id);

        const startTime = dayjs(record.startTime).format('HH:mm');
        const endTime = dayjs(record.endTime).format('HH:mm');

        setFormData({
            startTime,
            endTime,
            category: record.category,
            description: record.description,
        });
    };

    const handleDelete = async (record) => {
        try {
            await DeleteTimelog(record);
            dispatch(fetchTimelogs())
            message.success('TimeLog Deleted successful!');
        } catch (error) {
            message.error('Delete Failed! Please try again.');
            console.error('Error While Deleting the time log:', error);
        }
    };

    useEffect(() => {
        dispatch(fetchTimelogs());
    }, []);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#c9194b',
                    borderRadius: 20,
                },
            }}
        >
            <div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '0px',
                    }}
                >
                    <RangePicker
                        format="HH:mm"
                        style={{ borderRadius: '20px', width: '200px' }}
                        onChange={handleRangeChange}
                        value={
                            formData.startTime && formData.endTime
                                ? [dayjs(formData.startTime, 'HH:mm'), dayjs(formData.endTime, 'HH:mm')]
                                : null
                        }
                        required
                    />

                    <Select
                        style={{ width: '180px' }}
                        placeholder="Category"
                        options={[
                            { value: "", label: "Select Category", disabled: true },
                            { value: 'learning', label: 'Learning' },
                            { value: 'coding', label: 'Coding' },
                            { value: 'management', label: 'Management' },
                        ]}
                        onChange={handleChangeCategory}
                        value={formData.category}
                    />
                    <Input
                        placeholder="Description"
                        style={{ width: '400px' }}
                        value={formData.description}
                        onChange={handleChangeDescription}
                        required
                    />
                    <Button onClick={handleSubmit} type="primary">
                        Submit
                    </Button>
                </div>
                <div style={{ padding: '14px' }}>
                    <Table
                        columns={columns}
                        dataSource={timelogs}
                        pagination={false}
                        bordered
                        size="small"
                        loading={loading}
                    />
                </div>
                <div>
                    <Card
                        size="small"
                        title={
                            <SetRow
                                label="Vinay Singh"
                                value="Work Duration"
                                textStyle={{ fontWeight: 'bold' }}
                            />
                        }
                        className={`calculate-hours-card ${showCard ? 'show-card' : ''
                            }`}
                    >
                        <Button
                            type="primary"
                            icon={showCard ? <RightOutlined /> : <LeftOutlined />}
                            className="arrow-toggle"
                            onClick={() => setShowCard(!showCard)}
                        />
                        <SetRow
                            label="Total"
                            value={0}
                            textStyle={{ fontWeight: 'bold' }}
                        />
                    </Card>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default Tasktable;
