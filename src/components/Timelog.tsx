import { Card, DatePicker, message } from 'antd'
import dayjs from 'dayjs'
import Tasktable from './Tasktable'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { fetchTimelogs } from '../redux/actions/timelogActions';
import Spinner from '../utils/Spinner';

const Timelog = ({ selectedDate, setSelectedDate }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isRunning, setIsRunning] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDateChange = (date) => {
        if (date) {
            const formattedDate = date.format("YYYY-MM-DD");
            setSelectedDate(dayjs(formattedDate));
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const formattedDate = selectedDate.format("YYYY-MM-DD");
            if (selectedDate) {
                setLoading(true);
                try {
                    await dispatch(fetchTimelogs({ date: formattedDate }));
                } catch {
                    message.error("Error fetching timelogs for this date.");
                } finally {
                    setLoading(false);
                }
            }
        };
    
        fetchData();
    }, [dispatch, selectedDate]);
    

    return (
        <>
            <Card style={{ position: "relative", height: "100%" }} title={"Timelog"} extra={
                <DatePicker disabled={isRunning ? true : false} defaultValue={selectedDate} onChange={handleDateChange} />
            }>
                {loading ? <Spinner /> :
                    <Tasktable selectedDate={selectedDate} setIsRunning={setIsRunning} isRunning={isRunning} />
                }
            </Card>
        </>
    )
}

export default Timelog
