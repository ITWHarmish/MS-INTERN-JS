import { Button, message, Select, theme, Tooltip } from 'antd';
import Leaves from './Leaves';
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import "../../index.css"
import { useCallback, useEffect, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Spinner from '../../utils/Spinner';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { fetchLeaves } from '../../redux/actions/leaveActions';
import isBetween from 'dayjs/plugin/isBetween';
import { GetMonthlySummary } from '../../services/monthlySummaryAPI';
import { GetInternsByMentorId } from '../../services/adminAPI';
import { GetLeaveRequests } from '../../services/leaveAPI';

dayjs.extend(isBetween);
const MonthlySummary = () => {
    const localizer = dayjsLocalizer(dayjs)
    const dispatch = useDispatch<AppDispatch>();
    const { leaves } = useSelector((state: RootState) => state.leave)
    const { user } = useSelector((state: RootState) => state.auth)
    const { token } = theme.useToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [monthlySummary, setMonthlySummary] = useState(null);
    const [calendarLoading, setCalendarLoading] = useState(false);
    const [officeHoliday, setOfficeHoliday] = useState(null);
    const [eventList, setEventList] = useState([]);
    const [internId, setInternId] = useState("");
    const [students, setStudents] = useState<{ _id: string; fullName: string }[]>([]);
    const [customLeaves, setCustomLeaves] = useState([]);

    const fetchInterns = async () => {
        if (!user || !user._id) {
            console.warn("User or Mentor ID is missing, skipping API call");
            return;
        }
        try {
            if (user.admin) {
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

    const handleNavigate = useCallback(async (date) => {
        try {
            setCurrentDate(date);
            setCalendarLoading(true);

            const selectedMonth = dayjs(date).month() + 1;
            const selectedYear = dayjs(date).year();
            const userId = user?.admin ? internId : user?._id;
            const payload = { year: selectedYear, month: selectedMonth, userId: userId };

            const response = await GetLeaveRequests(payload);
            setCustomLeaves(response);

            const res = await GetMonthlySummary(payload);
            setMonthlySummary(res);

        }
        catch (error) {
            console.error("Error while fetching the monthly summary: ", error);
        }
        finally {
            setTimeout(() => setCalendarLoading(false), 500);
        }

    }, [internId, user?._id, user?.admin]);



    useEffect(() => {
        dispatch(fetchLeaves());
    }, [dispatch])


    useEffect(() => {
        if (!user?.admin && leaves) {
            setCustomLeaves(leaves);
        }
    }, [leaves, user]);

    useEffect(() => {
        handleNavigate(currentDate);
    }, [handleNavigate, currentDate]);

    useEffect(() => {
        if (customLeaves && customLeaves.length > 0 || (monthlySummary?.daysArray && monthlySummary.daysArray.length > 0)) {
            const dynamicLeaves = customLeaves.map((leave) => ({
                start: new Date(leave.from),
                end: new Date(leave.to),
                title: "",
                type: leave.leaveType,
            })) || [];

            const dynamicWorkHours = (monthlySummary?.daysArray || [])
                .filter(day => Number(day.totalHours) > 0)
                .map(day => ({
                    start: new Date(day.date),
                    end: new Date(day.date),
                    title: `${Number(day.totalHours).toFixed(2)}`,
                }));

            const allEvents = [...dynamicLeaves, ...dynamicWorkHours];

            setEventList(allEvents);
        }
    }, [customLeaves, monthlySummary]);

    useEffect(() => {
        const holiday = monthlySummary?.daysArray?.filter(day => day.holiday)
        setOfficeHoliday(holiday);

    }, [monthlySummary]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dayProp = (date) => {
        const day = dayjs(date).day();
        const isWeekend = day === 0 || day === 6;
        const today = dayjs().startOf('day');
        const isCurrentDay = dayjs(date).isSame(today, 'day');

        const isHalfLeave = eventList?.some(event => (event.type === 'half leave') &&
            dayjs(date).isBetween(event.start, event.end, 'day', '[]')
        );

        const isEventDay = eventList?.some(event =>
            (event.type === 'casual leave' || event.type === 'sick leave') &&
            dayjs(date).isBetween(event.start, event.end, 'day', '[]')
        );


        const isHoliday = officeHoliday?.some(holiday => dayjs(holiday.date).isSame(date, 'day'));

        if (isWeekend || isHoliday) {
            return {
                style: {
                    backgroundColor: token.colorBgLayout === "White" ? "#e6e6e6" : "#474646",
                },
            };
        }

        if (isHalfLeave) {
            return {
                style: {
                    backgroundColor: "#FFD9004C",
                },
            };
        }

        else if (!isHalfLeave && !isEventDay && isCurrentDay) {
            return {
                style: {
                    backgroundColor: "transparent",
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

    const CalendarToolbar = ({ label, onNavigate }) => (
        < div >
            <div className={token.colorBgLayout === "White" ? "" : "BgCard"} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: "18px" }}>
                <span onClick={() => onNavigate('PREV')} style={{ marginRight: "7px", cursor: "pointer" }}> <LeftOutlined /> </span>
                {label}
                <span onClick={() => onNavigate('NEXT')} style={{ marginLeft: "7px", cursor: "pointer" }}> <RightOutlined /> </span>
            </div>
        </div >
    );

    const CustomEvent = ({ event }) => {

        const holiday = officeHoliday?.find(holiday =>
            dayjs(holiday.date).isSame(event.start, 'day')
        );

        const isHiddenEvent = ["half leave", "casual leave", "sick leave"].includes(event.type);

        let tooltipText = "";
        if (holiday) {
            tooltipText = holiday.holiday;
        } else if (isHiddenEvent) {
            tooltipText = event.type;
        }


        return (
            <Tooltip
                title={tooltipText || ``}
                placement="top"
                overlayInnerStyle={{ backgroundColor: "#474787" }}
            >
                <span style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "30px",
                    color: token.colorBgLayout === "White" ? "black" : "white",
                    height: (holiday || isHiddenEvent) ? 50 : "auto",
                }}>
                    {(event.title === "undefined" || event.title === "0") ? "" : event.title}
                </span>
            </Tooltip>
        );

    };

    const handleStudentChange = (value) => {
        setInternId(value);
    }

    return (
        <>

            <div style={{ height: "100vh" }} className={token.colorBgLayout === "White" ? "" : "BgCard"}>
                {user && !user.admin &&
                    < div style={{ display: 'flex', justifyContent: 'end', padding: '10px', marginBottom: "65px" }}>
                        <Button onClick={showModal} type="primary">
                            Apply Leave
                        </Button>
                        <Leaves visible={isModalOpen} onClose={handleCancel} />
                    </div>
                }
                {user && user.admin &&
                    < div style={{ display: 'flex', justifyContent: 'end', padding: '10px', marginBottom: "65px" }}>
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
                            style={{ height: 450, width: 800, position: "relative", zIndex: "0" }}
                            components={{
                                event: CustomEvent,
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
                        <span>
                            {monthlySummary?.shortage < 0 ? (
                                <>Extra: <b style={{ color: '#50C150' }}>{Math.abs(monthlySummary.shortage).toFixed(2)} Hours</b></>
                            ) : (
                                <>Shortage: <b style={{ color: '#E65A5A' }}>{(monthlySummary?.shortage || 0).toFixed(2)} Hours</b></>
                            )}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '8px', }}>
                        <span style={{ marginRight: '15px', color: '#6C6CCD' }}>● <span className={token.colorBgLayout === "White" ? "BgText" : "BgCard"} style={{ color: "" }}>Leave</span></span>
                        <span style={{ marginRight: '15px', color: '#e6e6e6' }}>● <span className={token.colorBgLayout === "White" ? "BgText" : "BgCard"} style={{ color: "" }}>Holiday</span></span>
                        <span style={{ color: '#FFD9004C' }}>● <span className={token.colorBgLayout === "White" ? "BgText" : "BgCard"} style={{ color: "" }}>Halfday</span></span>
                    </div>
                </div>
            </div >

        </>
    );
};

export default MonthlySummary;
