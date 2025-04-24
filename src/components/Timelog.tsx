import { Card, DatePicker, message, Select } from 'antd'
import dayjs from 'dayjs'
import Tasktable from './Tasktable'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchTimelogs } from '../redux/actions/timelogActions';
import { useSelector } from 'react-redux';
import { GetInternsByMentorId } from '../services/adminAPI';

const Timelog = ({ selectedDate, setSelectedDate, setInternId, internId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { timelogs } = useSelector((state: RootState) => state.timelog)
    const { user } = useSelector((state: RootState) => state.auth)
    const [students, setStudents] = useState<{ _id: string; fullName: string }[]>([]);

    const fetchInterns = async () => {
        if (!user || !user._id) {
            console.warn("User or Mentor ID is missing, skipping API call");
            return;
        }
        try {
            if (user && user.admin) {
                const res = await GetInternsByMentorId(user._id);
                setStudents(res.data || []);
            }
        } catch (error) {
            console.error("Error Intern List:", error);
            message.error("Failed to fetch Intern List.");
        }
    };

    useEffect(() => {
        fetchInterns();
    }, [user]);

    const handleDateChange = (date) => {
        if (date) {
            const formattedDate = date.format("YYYY-MM-DD");
            setSelectedDate(dayjs(formattedDate));
        }
    }

    const totalHours = timelogs.reduce((total, timelog) => {
        const hours = typeof timelog?.hours === 'number' ? timelog.hours : 0;
        return total + hours;
    }, 0);

    useEffect(() => {
        const formattedDate = selectedDate.format("YYYY-MM-DD");
        if (selectedDate) {
            dispatch(fetchTimelogs({ date: formattedDate, userId: user?.admin ? internId : user?._id }));
        }
    }, [dispatch, selectedDate, internId, user?._id, user?.admin])

    const handleStudentChange = (value) => {
        setInternId(value);
    }

    return (
        <>
            <Card style={{ position: "relative", height: "100%" }}
                title={
                    <div>
                        <span style={{ marginLeft: "8px" }}>TIMELOG :</span>
                        <span style={{ fontWeight: "normal", marginLeft: "7px" }}>{`${totalHours.toFixed(2)} HOURS`}</span>
                    </div>
                }
                extra={
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {user && user.admin &&
                            <div>
                                <Select
                                    showSearch
                                    style={{ marginLeft: "15px" }}
                                    placeholder="Select Student"
                                    options={students.map((student) => ({
                                        value: student._id,
                                        label: student.fullName,
                                    }))}
                                    onChange={handleStudentChange}
                                />
                            </div>
                        }
                        <DatePicker style={{ marginRight: "8px" }} className='picker-timelog' defaultValue={selectedDate} onChange={handleDateChange} />
                    </div>
                }>
                <Tasktable selectedDate={selectedDate} internId={internId} />
            </Card >
        </>
    )
}

export default Timelog
