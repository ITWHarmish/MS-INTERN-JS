import { Button, theme } from 'antd';
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
import { GetMonthlySummary } from '../../services/monthlySummary';

dayjs.extend(isBetween);
const MonthlySummary = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const localizer = dayjsLocalizer(dayjs)
    const [currentDate, setCurrentDate] = useState(new Date());
    const [monthlySummary, setMonthlySummary] = useState(null);
    const [calendarLoading, setCalendarLoading] = useState(false);
    const { token } = theme.useToken();
    const { leaves } = useSelector((state: RootState) => state.leave)
    // console.log("leave state: ", leaves);
    const dispatch = useDispatch<AppDispatch>();

    console.log("monthlySummary: ", monthlySummary);
    // console.log("todaysDate: ", todaysDate);

    const [eventList, setEventList] = useState([]);
    // console.log("eventList: ", eventList);
    useEffect(() => {
        if (leaves && leaves.length > 0 || (monthlySummary?.daysArray && monthlySummary.daysArray.length > 0)) {
            // console.log("leaves: ", leaves);
            const dynamicLeaves = leaves.map((leave) => ({
                start: new Date(leave.from),
                // end: dayjs(leave.to).add(1, 'day').toDate(),
                end: new Date(leave.to),
                // title: leave.leaveType,
                // title: "",
                type: leave.leaveType,
            })) || [];
            // console.log("dynamicLeaves: ", dynamicLeaves);
            const dynamicWorkHours = monthlySummary?.daysArray?.map((day) => ({
                start: new Date(day.date),
                end: new Date(day.date),
                title: `${day.totalHours}`,
                type: "workHours",
            })) || [];

            const allEvents = [...dynamicLeaves, ...dynamicWorkHours];

            setEventList(allEvents);
        }
    }, [leaves, monthlySummary]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const staticHolidays = [
        { title: "New Year", date: "2025-01-01" },
        { title: "Uttrayan", date: "2025-01-14" },
        { title: "Republic Day", date: "2025-01-26" },
        { title: "Maha Shivaratri", date: "2025-02-26" },
        { title: "Holi (Second Day) - Dhuleti", date: "2025-03-14" },
        { title: "Eid-Ul-Fitr (Ramzan)", date: "2025-03-31" },
        { title: "Shri Ram Navami", date: "2025-04-06" },
        { title: "Good Friday", date: "2025-04-18" },
        { title: "Raksha Bandhan", date: "2025-08-09" },
        { title: "Independence Day", date: "2025-08-15" },
        { title: "Shri Krishna Janmashtami", date: "2025-08-16" },
        { title: "Samvatsari (Chaturthi Paksha)", date: "2025-08-27" },
        { title: "Id A Milad (Milad-Un-Nabi)", date: "2025-09-05" },
        { title: "Mahatma Gandhi Jayanti", date: "2025-10-02" },
        { title: "Diwali", date: "2025-10-20" },
        { title: "Christmas Day", date: "2025-12-25" }
    ]
    const [officeHoliday, setOfficeHoliday] = useState(staticHolidays);


    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await OfficeHoliday();
                console.log("response Holidays: ", response);
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

    //    console.log("eventList: " + eventList);
    // console.log("eventList: ", JSON.stringify(eventList, null, 2));


    const dayProp = (date) => {
        const day = dayjs(date).day();
        const isWeekend = day === 0 || day === 6;
        // const isEventDay = eventList.some(event => dayjs(event.start).isSame(date, 'day'));
        const isHalfLeave = eventList.some(event => (event.type === 'half leave') &&
            dayjs(date).isBetween(event.start, event.end, 'day', '[]')
        );

        const isEventDay = eventList.some(event =>
            (event.type === 'casual leave' || event.type === 'sick leave') &&
            dayjs(date).isBetween(event.start, event.end, 'day', '[]')
        );


        const isHoliday = officeHoliday.some(holiday => dayjs(holiday.date).isSame(date, 'day'));

        if (isWeekend || isHoliday) {
            return {
                style: {
                    // backgroundColor: '#e6e6e6',
                    backgroundColor: token.colorBgLayout === "White" ? "#e6e6e6" : "#474646",
                    // color: token.colorBgLayout === "White" ? "" : "white",
                },
            };
        }
        if (isHalfLeave) {
            return {
                style: {
                    // backgroundColor: '#e6e6e6',
                    backgroundColor: "#FFD9004C",
                    // color: token.colorBgLayout === "White" ? "" : "white",
                },
            };
        }
        if (isEventDay) {
            return {
                style: {
                    backgroundColor: '#6c6ccda8',
                    // color: token.colorBgLayout === "White" ? "" : "white",
                },
            };
        }

        return {};

    }

    const handleNavigate = useCallback(async (date) => {
        try {
            setCurrentDate(date);
            setCalendarLoading(true);

            console.log("date: ", date);
            const selectedMonth = dayjs(date).month() + 1;
            const selectedYear = dayjs(date).year();

            const payload = { year: selectedYear, month: selectedMonth };

            const res = await GetMonthlySummary(payload);
            setMonthlySummary(res);

        }
        catch (error) {
            console.error("Error while fetching the monthly summary: ", error);
        }
        finally {
            setTimeout(() => setCalendarLoading(false), 500);
        }

    }, []);

    useEffect(() => {
        handleNavigate(currentDate);
    }, [handleNavigate, currentDate]);

    const CalendarToolbar = ({ label, onNavigate }) => (
        < div >
            <div className={token.colorBgLayout === "White" ? "" : "BgCard"} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: "18px" }}>
                <span onClick={() => onNavigate('PREV')} style={{ marginRight: "7px", cursor: "pointer" }}> <LeftOutlined /> </span>
                {label}
                <span onClick={() => onNavigate('NEXT')} style={{ marginLeft: "7px", cursor: "pointer" }}> <RightOutlined /> </span>
            </div>
        </div >
    );

    const eventPropGetter = (event) => {
        if (event.type === "workHours") {
            return {
                style: {
                    color: token.colorBgLayout === "White" ? "black" : "white",
                    display: "flex",
                    fontSize: "30px",
                    justifyContent: "center",
                    alignItems: "center",
                },
            };
        }
        return {};
    };

    // const CustomEvent = ({ event }) => {
    //     return (
    //         <Tooltip
    //             title={`${event.type}`}
    //             placement="top"
    //             overlayInnerStyle={{ backgroundColor: "#474787" }}
    //         >
    //             <div>{event.title}</div>
    //         </Tooltip>
    //     );
    //     // if (event.type === "workHours") {
    //     //     return <div>{event.title}</div>;
    //     // }

    //     // If event is a leave, show tooltip but don't display title in UI
    //     // return (
    //     //     <Tooltip title={`${event.type}`} placement="top">
    //     //         <div style={{ width: "100%", height: "100%", backgroundColor: "", borderRadius: "4px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
    //     //             <span style={{ display: "none", fontWeight: "bold" }}>L</span>
    //     //         </div>
    //     //     </Tooltip>
    //     // );

    //     // return (
    //     //     <Tooltip title={`${event.type}`}>
    //     //         <div>{event.title}</div>
    //     //     </Tooltip>
    //     // );
    // };

    return (
        <>
            {loading ? <Spinner /> :
                <div className={token.colorBgLayout === "White" ? "" : "BgCard"}>
                    <div style={{ display: 'flex', justifyContent: 'end', padding: '10px', marginBottom: "65px" }}>
                        <Button onClick={showModal} type="primary">
                            Apply Leave
                        </Button>
                        <Leaves visible={isModalOpen} onClose={handleCancel} />
                    </div>
                    <div style={{ width: '800px', margin: 'auto', marginTop: "20px", marginBottom: "65px" }}>
                        <div className='containerCalendar'>
                            {calendarLoading && (
                                <div className='spinner'>
                                    <Spinner />
                                </div>
                            )}
                            <Calendar
                                localizer={localizer}
                                events={eventList}
                                className={token.colorBgLayout === "White" ? "" : "Monthcalendar"}
                                startAccessor="start"
                                endAccessor="end"
                                date={currentDate}
                                onNavigate={handleNavigate}
                                eventPropGetter={eventPropGetter}
                                style={{ height: 450, width: 800 }}
                                components={{
                                    // event: CustomEvent,
                                    toolbar: CalendarToolbar,
                                    header: (props) => <div className={token.colorBgLayout === "White" ? "" : "BgCard"}>{props.label}</div>,
                                    month: {
                                        dateHeader: (props) => <div className={token.colorBgLayout === "White" ? "" : "dateColorWhite"}>{props.label}</div>
                                    },
                                }}
                                views={['month']}
                                selectable={false}
                                dayPropGetter={dayProp}
                            />
                        </div>
                        <div style={{ marginTop: '75px', backgroundColor: "#474787", color: "white", padding: '10px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <span style={{ marginRight: '15px' }}>Total Working Days: <b>{monthlySummary?.totalWorkingDays || 0}</b></span>
                            <span style={{ marginRight: '15px' }}>Total Hours: <b>{monthlySummary?.totalWorkingHours || 0}</b></span>
                            {/* <span>Shortage: <b style={{ color: '#E65A5A' }}>{monthlySummary?.shortage || 0} Hours</b></span> */}
                            <span>
                                {monthlySummary?.shortage < 0 ? (
                                    <>Extra: <b style={{ color: '#50C150' }}>{Math.abs(monthlySummary.shortage)} Hours</b></>
                                ) : (
                                    <>Shortage: <b style={{ color: '#E65A5A' }}>{monthlySummary?.shortage || 0} Hours</b></>
                                )}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '5px' }}>
                            <span style={{ marginRight: '15px', color: '#6C6CCD' }}>● <span className={token.colorBgLayout === "White" ? "BgText" : "BgCard"} style={{ color: "" }}>Leave</span></span>
                            <span style={{ marginRight: '15px', color: '#e6e6e6' }}>● <span className={token.colorBgLayout === "White" ? "BgText" : "BgCard"} style={{ color: "" }}>Holiday</span></span>
                            <span style={{ color: '#FFD9004C' }}>● <span className={token.colorBgLayout === "White" ? "BgText" : "BgCard"} style={{ color: "" }}>Halfday</span></span>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default MonthlySummary;
