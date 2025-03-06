import { DeleteOutlined, EditOutlined, WechatWorkOutlined, } from '@ant-design/icons';
import { Button, Card, Input, message, Select, Table, TimePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { AddTimelog, DeleteTimelog, UpdateTimelog } from '../services/timelogAPI';
import dayjs from 'dayjs';
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchTimelogs } from '../redux/actions/timelogActions';
import { AppDispatch, RootState } from '../redux/store';
import type { TableProps } from 'antd';
import { IColumns, TimeLog } from '../types/ITimelog';

dayjs.extend(localizedFormat);

const Tasktable = ({ selectedDate }) => {

    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const [showCard, setShowCard] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        startTime: '',
        endTime: '',
        category: 'coding',
        description: '',
        date: formattedDate,
    });
    const { timelogs } = useSelector((state: RootState) => state.timelog)

    const [editingId, setEditingId] = useState<string | null>(null);

    const { RangePicker } = TimePicker;

    useEffect(() => {
        let startTime, endTime;

        if (timelogs.length > 0) {
            const lastEntryEndTime = dayjs(timelogs[timelogs.length - 1].endTime);
            startTime = lastEntryEndTime;
            endTime = lastEntryEndTime.add(1, 'hour');
        } else {
            startTime = dayjs('09:00', 'HH:mm');
            endTime = dayjs('10:00', 'HH:mm');
        }

        setFormData(prevFormData => ({
            ...prevFormData,
            startTime: startTime.format('HH:mm'),
            endTime: endTime.format('HH:mm'),
        }));
    }, [timelogs]);

    const columns: TableProps<IColumns>['columns'] = [
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            width: 100,
            key: 'startTime',
            render: (startTime: string) =>
                dayjs(startTime).format('hh:mm A'),
        },
        {
            title: 'End Time',
            dataIndex: 'endTime',
            width: 100,
            key: 'endTime',
            render: (endTime: string) =>
                dayjs(endTime).format('hh:mm A'),
        },
        {
            title: 'Hours',
            dataIndex: 'hours',
            key: 'hours',
            width: 70,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: 120,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: "center", gap: '20px', cursor: 'pointer', alignItems: "center" }}>
                    <Button
                        shape="circle"
                        icon={<EditOutlined className="check" />}
                        size="small"
                        onClick={() => {
                            handleEdit(record);
                        }}
                    />
                    <Button
                        shape="circle"
                        danger
                        icon={<DeleteOutlined className="check" />}
                        size="small"
                        onClick={() => {
                            handleDelete(record._id);
                        }}
                    />
                </div>
            ),
        },
    ];

    const handleRangeChange = (value: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
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
        if (!formData.startTime || !formData.endTime || !formData.category || !formData.description || !formData.date) {
            message.error("All fields are required!");
            return;
        }

        const startTimeObj = dayjs(formData.startTime, "HH:mm");
        const endTimeObj = dayjs(formData.endTime, "HH:mm");
        const duration = endTimeObj.diff(startTimeObj, "minutes") / 60;

        if (duration > 1) {
            message.error("Time should not be more than 1 hour!");
            return;
        }
        const payload = {
            ...formData,
            startTime: dayjs(formData.startTime, "HH:mm").format(),
            endTime: dayjs(formData.endTime, "HH:mm").format(),
            hours: Number(duration).toFixed(2),
        };
        setLoading(true);
        if (editingId) {
            try {
                await UpdateTimelog(editingId, payload);
                dispatch(fetchTimelogs({ date: formattedDate }))
                message.success('TimeLog Updated successful!');

            } catch (error) {
                console.error('Error While Updating the time log:', error);
                message.error('Updated Failed! Please try again.');
            }
        } else {
            try {
                await AddTimelog(payload);
                dispatch(fetchTimelogs({ date: formattedDate }))
                message.success('TimeLog Added successful!');
            } catch (error) {
                console.error('Error While Submitting the time log:', error);
                message.error('Submiision Failed! Please try again.');
            }
        }
        setLoading(false);
        setFormData({
            startTime: '',
            endTime: '',
            category: 'coding',
            description: '',
            date: formattedDate,
        });

        setEditingId(null);

    };

    const handleEdit = (record: TimeLog) => {
        setEditingId(record._id);

        const startTime = dayjs(record.startTime).format('HH:mm');
        const endTime = dayjs(record.endTime).format('HH:mm');

        setFormData({
            startTime,
            endTime,
            category: record.category,
            description: record.description,
            date: formattedDate,
        });
    };

    const handleDelete = async (record) => {
        try {
            setLoading(true);
            await DeleteTimelog(record);
            dispatch(fetchTimelogs({ date: formattedDate }))
            message.success('TimeLog Deleted successful!');
        } catch (error) {
            message.error('Delete Failed! Please try again.');
            console.error('Error While Deleting the time log:', error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFormData((prev) => ({ ...prev, date: formattedDate }));
    }, [formattedDate]);

    return (
        <div style={{ minHeight: "65vh" }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}
            >
                <RangePicker
                    format="HH:mm A"
                    minuteStep={15}
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
                    showSearch
                    placeholder="Select Category"
                    optionFilterProp="label"
                    options={[
                        { value: 'learning', label: 'Learning' },
                        { value: 'coding', label: 'Coding' },
                        { value: 'management', label: 'Management' },
                    ]}
                    onChange={handleChangeCategory}
                    value={formData.category || undefined}
                />
                <Input
                    placeholder="Description"
                    style={{ width: '450px' }}
                    value={formData.description}
                    onChange={handleChangeDescription}
                    required
                />
                <Button onClick={handleSubmit} type="primary">
                    Submit
                </Button>
            </div>
            <div style={{
                paddingTop: '10px',
            }}>
                <Table<IColumns>
                    columns={columns}
                    dataSource={timelogs}
                    pagination={false}
                    bordered
                    size="small"
                    loading={loading}
                    sticky={true}
                    className="ScrollInProgress"
                    style={{
                        height: "calc(65vh - 50px)",
                        position: "absolute",
                        overflowY: "auto",
                        overflowX: "hidden",
                        left: "10px",
                        right: "0",
                        paddingRight: "10px",
                    }}
                />
            </div>
            <div>
                <Card
                    size="small"
                    className={`calculate-hours-card ${showCard ? 'show-card' : ''
                        }`}
                >
                    <Button
                        type="primary"
                        icon={showCard ? <WechatWorkOutlined className="check" /> : <WechatWorkOutlined className="check" />}
                        className="arrow-toggle"
                        onClick={() => setShowCard(!showCard)}
                    />
                    <iframe
                        src="https://www.chatbase.co/chatbot-iframe/F_pd4JUjqJyLMwM__lSOx"
                        width="100%"
                        style={{ minHeight: "450px", fontSize:"2px" }}
                        frameBorder="0"
                    ></iframe>
                </Card>
            </div>
        </div>
    );
};

export default Tasktable;
