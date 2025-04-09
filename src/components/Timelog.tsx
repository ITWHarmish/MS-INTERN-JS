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
                    <span style={{marginLeft:"8px"}}>TIMELOG :</span>
                    <span style={{ fontWeight: "normal", marginLeft: "7px" }}>{`${totalHours.toFixed(2)} HOURS`}</span>
                </div>}
                extra={
                    <div
                        style={{
                            background: "transparent",
                            borderBottomRightRadius: "12px",
                            borderTopLeftRadius: "12px",
                            borderTopRightRadius: "12px",
                            borderBottomLeftRadius: "12px",
                        }}
                    >
                        <DatePicker style={{marginRight:"8px",}}
                            // style={{ border: '2px solid #1890ff', borderRadius: '8px 12px 7px 5px' }}
                            className='picker-timelog' defaultValue={selectedDate} onChange={handleDateChange} />
                    </div>
                }>
                <Tasktable selectedDate={selectedDate} />
            </Card >
        </>
    )
}

export default Timelog
