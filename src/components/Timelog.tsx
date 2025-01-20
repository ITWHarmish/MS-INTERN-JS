import { Card, DatePicker } from 'antd'
import dayjs from 'dayjs'
import Tasktable from './Tasktable'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { fetchTimelogs } from '../app/actions/timelogActions';

const Timelog = ({ selectedDate, setSelectedDate }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleDateChange = (date) => {
        if (date) {
            const formattedDate = date.format("YYYY-MM-DD");
            setSelectedDate(dayjs(formattedDate));
        }
    }

    useEffect(() => {
        const formattedDate = selectedDate.format("YYYY-MM-DD");
        if (selectedDate) {
            dispatch(fetchTimelogs({ date: formattedDate }));
        }
    }, [dispatch, selectedDate])

    return (
        <>
            <Card title={"Timelog"} extra={
                <DatePicker defaultValue={selectedDate} onChange={handleDateChange} />
            }>
                <Tasktable selectedDate={selectedDate} />
            </Card>
        </>
    )
}

export default Timelog
