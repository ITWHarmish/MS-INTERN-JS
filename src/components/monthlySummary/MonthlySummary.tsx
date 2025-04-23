import { Button, Col, Row, theme, Tooltip } from 'antd';
import Leaves from './Leaves';
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
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
import "./MonthlySummary.css"

dayjs.extend(isBetween);
const MonthlySummary = () => {
    const localizer = dayjsLocalizer(dayjs)
    const dispatch = useDispatch<AppDispatch>();
    const { leaves } = useSelector((state: RootState) => state.leave)
    const { token } = theme.useToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [monthlySummary, setMonthlySummary] = useState(null);
    const [calendarLoading, setCalendarLoading] = useState(false);
    const [officeHoliday, setOfficeHoliday] = useState(null);
    const [eventList, setEventList] = useState([]);
    const [monthImage, setMonthImage] = useState("JAN");
    const [visibleMonthRange, setVisibleMonthRange] = useState({
        start: dayjs().startOf("month"),
        end: dayjs().endOf("month")
    });
    const [calendarLabel, setCalendarLabel] = useState("");

    const [calendarDimensions, setCalendarDimensions] = useState({
        height: document.documentElement.clientHeight - 197,
        width: document.documentElement.clientWidth - 600,
    });

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setCalendarDimensions({
                height: document.documentElement.clientHeight - 197,
                width: document.documentElement.clientWidth - 600,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const handleNavigate = useCallback(async (date) => {
        try {
            setCurrentDate(date);
            setCalendarLoading(true);

            const selectedMonth = dayjs(date).month() + 1;
            const selectedYear = dayjs(date).year();
            setCalendarLabel(dayjs(date).format("YYYY"));

            const payload = { year: selectedYear, month: selectedMonth };
            setVisibleMonthRange({
                start: dayjs(date).startOf("month"),
                end: dayjs(date).endOf("month"),
            });

            const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            setMonthImage(monthNames[dayjs(date).month()]);

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
        dispatch(fetchLeaves());
    }, [dispatch])

    useEffect(() => {
        handleNavigate(currentDate);
    }, [handleNavigate, currentDate]);

    useEffect(() => {
        if (leaves && leaves.length > 0 || (monthlySummary?.daysArray && monthlySummary.daysArray.length > 0)) {
            const dynamicLeaves = leaves.map((leave) => ({
                start: new Date(leave.from),
                end: new Date(leave.to),
                title: "",
                type: leave.leaveType,
            })) || [];

            const dynamicWorkHours = monthlySummary?.daysArray?.map((day) => ({
                start: new Date(day.date),
                end: new Date(day.date),
                title: `${day.totalHours}`,
            })) || [];

            const allEvents = [...dynamicLeaves, ...dynamicWorkHours];

            setEventList(allEvents);
        }
    }, [leaves, monthlySummary]);

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
        const isInVisibleMonth = dayjs(date).isBetween(visibleMonthRange.start.subtract(1, "day"), visibleMonthRange.end.add(1, "day"));

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
                    backgroundColor: "#3c3c3c46",
                    margin: "4px 4px 0px 0px",
                },
            };
        }

        if (isHalfLeave) {
            return {
                style: {
                    backgroundColor: "#515151",
                },
            };
        }

        else if (!isHalfLeave && isCurrentDay) {
            return {
                style: {
                    backgroundColor: "#ffffff80",
                },
            };
        }

        if (isEventDay) {
            return {
                style: {
                    backgroundColor: 'black',
                },
            };
        }

        if (isInVisibleMonth && !isWeekend && !isEventDay && !isHoliday && !isHalfLeave && !isCurrentDay) {
            return {
                style: {
                    backgroundColor: "#ffffff80",
                },
            };
        }

        return {};

    }

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
                overlayInnerStyle={{ backgroundColor: "#fff", color: "black" }}
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

    return (
        <>
            <div
                style={{ height: "calc(100vh - 130px)" }}>
                <Row gutter={16}>
                    <Col md={20}>
                        <div
                            style={{ display: "flex", alignItems: "center", padding: "10px 0px 0px 70px" }}>
                            <div>
                                <div className='containerCalendar'>
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
                                        style={{
                                            height: `${calendarDimensions.height}px`,
                                            width: `${calendarDimensions.width}px`,
                                            position: "relative",
                                            zIndex: "0",
                                        }}
                                        components={{
                                            event: CustomEvent,
                                            header: ({ date }) => <div style={{ color: "#49494B" }} >
                                                {dayjs(date).format('dddd').toUpperCase()}
                                            </div>,
                                            // month: {
                                            //     dateHeader: (props) => <div className={token.colorBgLayout === "White" ? "" : "dateColorWhite"}>{props.label}</div>
                                            // },
                                            month: {
                                                dateHeader: ({ date, label }) => {
                                                    const isWeekend = dayjs(date).day() === 0 || dayjs(date).day() === 6;
                                                    const isHoliday = officeHoliday?.some(holiday => dayjs(holiday.date).isSame(date, 'day'));
                                                    const isEventDay = eventList?.some(event =>
                                                        (event.type === 'casual leave' || event.type === 'sick leave') &&
                                                        dayjs(date).isBetween(event.start, event.end, 'day', '[]')
                                                    );
                                                    const isHalfLeave = eventList?.some(event => (event.type === 'half leave') &&
                                                        dayjs(date).isBetween(event.start, event.end, 'day', '[]')
                                                    );

                                                    const isWhite = isWeekend || isHoliday || isEventDay || isHalfLeave;

                                                    return (
                                                        <div style={{
                                                            color: isWhite ? 'white' : "",
                                                            margin: "5px 5px 0px 0px",
                                                        }}>
                                                            {label}
                                                        </div>
                                                    );
                                                }
                                            },
                                        }}
                                        views={['month']}
                                        selectable={false}
                                        dayPropGetter={dayProp}
                                    />
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "8px", marginBottom: "8px" }}>
                                    <div style={{
                                        // width: 'calc(100vw - 490px)',
                                        width: `${calendarDimensions.width}px`,
                                        color: "white",
                                        padding: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-around   ',
                                        alignItems: 'center',
                                        backgroundColor: "#ffffff80",
                                        height: "40px",
                                        borderRadius: "12px",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                            <span style={{ color: "#49494B" }}>TOTAL WORKING DAYS: </span>
                                            <span style={{ color: "black", marginRight: '15px' }}>
                                                {monthlySummary?.totalWorkingDays || 0}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                            <span style={{ color: "#49494B" }}>TOTAL HOURS:</span>
                                            <span style={{ color: "black", marginRight: '15px' }}>
                                                {monthlySummary?.totalWorkingHours || 0}
                                            </span>
                                        </div>
                                        <span>
                                            {monthlySummary?.shortage < 0 ? (
                                                <>
                                                    <span style={{ color: "#49494B" }}>EXTRA HOURS:</span>
                                                    <span style={{ color: "black" }}>
                                                        {Math.abs(monthlySummary.shortage)}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span style={{ color: "#49494B" }}>SHORTAGE HOURS:</span>  <span style={{ color: "black" }}>
                                                        {monthlySummary?.shortage || 0}
                                                    </span>
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div style={{
                            display: 'flex', justifyContent: 'end', padding: '10px', marginRight: "8px",
                        }}>
                            <Button onClick={showModal} type="primary" style={{ backgroundColor: "#323791" }}>
                                APPLY LEAVE
                            </Button>
                            <Leaves visible={isModalOpen} onClose={handleCancel} />
                        </div>
                    </Col>
                </Row>
            </div>
            <span className='month-up-nav' onClick={() => handleNavigate(dayjs(currentDate).add(1, 'month').toDate())}>
                <UpOutlined className="custom-up-icon" />
            </span>
            <span className='month-down-nav' style={{ cursor: "pointer" }} onClick={() => handleNavigate(dayjs(currentDate).subtract(1, 'month').toDate())}>
                <DownOutlined className="custom-up-icon" />
            </span>

            <div className='year-nav'>
                {calendarLabel}
            </div>
            <span className='year-down-nav' onClick={() => handleNavigate(dayjs(currentDate).subtract(1, 'year').toDate())}>
                <DownOutlined />
            </span>

            <span className='year-up-nav' style={{ cursor: "pointer" }} onClick={() => handleNavigate(dayjs(currentDate).add(1, 'year').toDate())}>
                <UpOutlined />
            </span>


            <div
                className="Monthly-Summary-overlay"
                style={{
                    position: "absolute",
                    WebkitMaskImage: `url('/${monthImage}.png')`,
                    maskImage: `url('/${monthImage}.png')`,
                }}
            >
            </div>



        </>
    );
};

export default MonthlySummary;
