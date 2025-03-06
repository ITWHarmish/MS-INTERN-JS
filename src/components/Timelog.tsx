import { Card, DatePicker } from 'antd'
import dayjs from 'dayjs'
import Tasktable from './Tasktable'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchTimelogs } from '../redux/actions/timelogActions';
import { useSelector } from 'react-redux';

const Timelog = ({ selectedDate, setSelectedDate }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { timelogs } = useSelector((state: RootState) => state.timelog)

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
            dispatch(fetchTimelogs({ date: formattedDate }));
        }
    }, [dispatch, selectedDate])

    return (
        <>
            <Card style={{ position: "relative", height: "100%" }}
                title={<div>
                    <span>Timelog :</span>
                    <span style={{ fontWeight: "normal", marginLeft:"7px" }}>{`${totalHours.toFixed(2)} hours`}</span>
                </div>}
                extra={
                    <DatePicker defaultValue={selectedDate} onChange={handleDateChange} />
                }>
                <Tasktable selectedDate={selectedDate} />
            </Card >
        </>
    )
}

export default Timelog
