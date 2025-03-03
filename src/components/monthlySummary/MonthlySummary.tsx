import { Button } from 'antd';
import Leaves from './Leaves';
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import "../../index.css"
import { useCallback, useEffect, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { OfficeHoliday } from '../../services/calendarApi';
import Spinner from '../../utils/Spinner';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { fetchLeaves } from '../../redux/actions/leaveActions';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);
const MonthlySummary = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const localizer = dayjsLocalizer(dayjs)
    const [currentDate, setCurrentDate] = useState(new Date());
    const [firstDay, setFirstDay] = useState("");
    const [todaysDate, setTodaysDate] = useState("");
    const [noOfDays, setNoOfDays] = useState(0);
    const [calendarLoading, setCalendarLoading] = useState(false);
    const { leaves } = useSelector((state: RootState) => state.leave)
    // console.log("leave state: ", leaves);
    const dispatch = useDispatch<AppDispatch>();

    console.log("firstDay: ", firstDay);
    console.log("todaysDate: ", todaysDate);

    const [eventList, setEventList] = useState([]);
    useEffect(() => {
        if (leaves && leaves.length > 0) {
            // console.log("leaves: ", leaves);
            leaves.map((leave) => {
                // console.log("leave map : ", dayjs(leave.to).add(1, 'day').toDate())
                console.log("leave map : ", new Date(leave.from))
            })
            const dynamicLeaves = leaves.map((leave) => ({
                start: new Date(leave.from),
                // end: dayjs(leave.to).add(1, 'day').toDate(),
                end: new Date(leave.to),
                // title: leave.leaveType,
                type: 'Leave',
            }));
            // console.log("dynamicLeaves: ", dynamicLeaves);

            setEventList(dynamicLeaves);
        }
    }, [leaves]);
    // console.log("eventList: ", eventList);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const staticHolidays = [
        { name: "New Year", date: "2025-01-01" },
        { name: "Uttrayan", date: "2025-01-14" },
        { name: "Republic Day", date: "2025-01-26" },
        { name: "Maha Shivaratri", date: "2025-02-26" },
        { name: "Holi (Second Day) - Dhuleti", date: "2025-03-14" },
        { name: "Eid-Ul-Fitr (Ramzan)", date: "2025-03-31" },
        { name: "Shri Ram Navami", date: "2025-04-06" },
        { name: "Good Friday", date: "2025-04-18" },
        { name: "Raksha Bandhan", date: "2025-08-09" },
        { name: "Independence Day", date: "2025-08-15" },
        { name: "Shri Krishna Janmashtami", date: "2025-08-16" },
        { name: "Samvatsari (Chaturthi Paksha)", date: "2025-08-27" },
        { name: "Id A Milad (Milad-Un-Nabi)", date: "2025-09-05" },
        { name: "Mahatma Gandhi Jayanti", date: "2025-10-02" },
        { name: "Diwali", date: "2025-10-20" },
        { name: "Christmas Day", date: "2025-12-25" }
    ]
    const [officeHoliday, setOfficeHoliday] = useState(staticHolidays);


    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await OfficeHoliday();
                // console.log("response Holidays: ", response);
                if (Array.isArray(response) && response.length > 0) {
                    setOfficeHoliday(response);
                }
            } catch (error) {
                console.error("Error While fetching the Holidays: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHolidays();
    }, []);

    useEffect(() => {
        dispatch(fetchLeaves())
    }, [dispatch])



    const dayProp = (date) => {
        const day = dayjs(date).day();
        const isWeekend = day === 0 || day === 6;
        // const isEventDay = eventList.some(event => dayjs(event.start).isSame(date, 'day'));
        const isEventDay = eventList.some(event =>
            dayjs(date).isBetween(event.start, event.end, 'day', '[]')
        );

        const isHoliday = officeHoliday.some(holiday => dayjs(holiday.date).isSame(date, 'day'));

        if (isWeekend || isHoliday) {
            return {
                style: {
                    backgroundColor: '#e6e6e6',
                },
            };
        }
        if (isEventDay) {
            return {
                style: {
                    backgroundColor: '#6c6ccda8',
                },
            };
        }

        return {};

    }

    const handleNavigate = useCallback((date) => {
        setCalendarLoading(true);

        const firstDayOfMonth = dayjs(date).startOf("month").format("DD-MM-YYYY");
        const today = dayjs();
        const selectedMonth = dayjs(date).month();
        const selectedYear = dayjs(date).year();

        let newDate;
        if (selectedMonth === today.month() && selectedYear === today.year()) {
            newDate = today.format("DD-MM-YYYY");
        } else {
            newDate = dayjs(date).endOf("month").format("DD-MM-YYYY");
        }
        setFirstDay(firstDayOfMonth);
        setCurrentDate(date);
        setTodaysDate(newDate);

        let daysCount = 0;
        if (dayjs(date).isAfter(today, "month")) {
            daysCount = 0;
        } else {
            // daysCount = dayjs(newDate, "DD-MM-YYYY").diff(dayjs(firstDayOfMonth, "DD-MM-YYYY"), "days") + 1;
            let currentDate = dayjs(firstDayOfMonth, "DD-MM-YYYY");
            const endDate = dayjs(newDate, "DD-MM-YYYY");

            while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
                const dayOfWeek = currentDate.day();
                const isHoliday = officeHoliday.some(holiday =>
                    dayjs(holiday.date).isSame(currentDate, "day")
                );
                const isLeave = eventList.some(leave =>
                    dayjs(leave.start).isSame(currentDate, "day") ||
                    dayjs(leave.end).isSame(currentDate, "day") ||
                    (dayjs(leave.start).isBefore(currentDate) && dayjs(leave.end).isAfter(currentDate))
                );

                if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday && !isLeave) {
                    daysCount++;

                }
                currentDate = currentDate.add(1, "day");
            }
        }

        setNoOfDays(daysCount);
        // console.log("No of Days: ", daysCount);
        // console.log("Todays date: ", todaysDate);
        // console.log("new Date:", newDate);
        // console.log("firstDayOfMonth: ", firstDayOfMonth);
        setTimeout(() => setCalendarLoading(false), 500);
    }, [officeHoliday, eventList]);

    // useEffect(() => {
    //     const fetchWorkingDays = () => {
    //         console.log("Selected: ", firstDay);
    //     };
    //     fetchWorkingDays();
    // }, [firstDay])

    useEffect(() => {
        handleNavigate(currentDate);
    }, [handleNavigate, currentDate]);


    const CalendarToolbar = ({ label, onNavigate }) => (
        < div >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: "18px" }}>
                <span onClick={() => onNavigate('PREV')} style={{ marginRight: "7px", cursor: "pointer" }}> <LeftOutlined /> </span>
                {label}
                <span onClick={() => onNavigate('NEXT')} style={{ marginLeft: "7px", cursor: "pointer" }}> <RightOutlined /> </span>
            </div>
        </div >
    );

    return (
        <>
            {loading ? <Spinner /> :
                <div>
                    <div style={{ display: 'flex', justifyContent: 'end', padding: '10px' }}>
                        <Button onClick={showModal} type="primary">
                            Apply Leave
                        </Button>
                        <Leaves visible={isModalOpen} onClose={handleCancel} />
                    </div>
                    <div style={{ width: '800px', margin: 'auto', marginTop: "20px", marginBottom: "49px" }}>
                        <div className='containerCalendar' style={{}}>
                            {calendarLoading && (
                                <div className='spinner'>
                                    <Spinner />
                                </div>
                            )}
                            <Calendar
                                localizer={localizer}
                                events={eventList}
                                startAccessor="start"
                                endAccessor="end"
                                date={currentDate}
                                onNavigate={handleNavigate}
                                style={{ height: 370, width: 800 }}
                                components={{
                                    toolbar: CalendarToolbar,
                                }}
                                views={['month']}
                                selectable={false}
                                dayPropGetter={dayProp}
                            />
                        </div>
                        <div style={{ marginTop: '35px', backgroundColor: "#474787", color: "white", padding: '10px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <span style={{ marginRight: '15px' }}>Total Working Days: <b>{noOfDays}</b></span>
                            <span style={{ marginRight: '15px' }}>Total Hours: <b>80</b></span>
                            <span>Shortage: <b style={{ color: 'yellow' }}>120 Hours</b></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '5px' }}>
                            <span style={{ marginRight: '15px', color: '#6C6CCD' }}>● <span style={{ color: "black" }}>Leave</span></span>
                            <span style={{ marginRight: '15px', color: '#e6e6e6' }}>● <span style={{ color: "black" }}>Holiday</span></span>
                            <span style={{ color: '#fc0' }}>● <span style={{ color: "black" }}>Halfday</span></span>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default MonthlySummary;
