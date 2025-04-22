import { Button, Col, Row, theme, Tooltip } from 'antd';
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

    const handleNavigate = useCallback(async (date) => {
        try {
            setCurrentDate(date);
            setCalendarLoading(true);

            const selectedMonth = dayjs(date).month() + 1;
            const selectedYear = dayjs(date).year();

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

        else if (!isHalfLeave && isCurrentDay) {
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

        if (isInVisibleMonth && !isWeekend && !isEventDay && !isHoliday && !isHalfLeave && !isCurrentDay) {
            return {
                style: {
                    backgroundColor: "#ffffff80",
                },
            };
        }

        return {};

    }

    const CalendarToolbar = ({ label, onNavigate }) => (
        < div >
            <div className="calendar-toolbar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: "18px", }}>
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
                    marginLeft: "10px",
                }}>
                    {(event.title === "undefined" || event.title === "0") ? "" : event.title}
                </span>
            </Tooltip>
        );

    };

    return (
        <>
            <div
                className='ScrollInProgress'
                style={{ height: "calc(100vh - 100px)", overflowY: "auto", overflowX: "hidden" }}>
                <Row gutter={16} style={{ padding: '', }}>
                    <Col md={20}>
                        <div

                            style={{ display: "flex", alignItems: "center", padding: "10px 0px 0px 70px" }}>

                            <div style={{}}>
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
                                        style={{ height: 500, width: 800, position: "relative", zIndex: "0" }}
                                        components={{
                                            event: CustomEvent,
                                            toolbar: CalendarToolbar,
                                            header: (props) => <div className={token.colorBgLayout === "White" ? "" : "BgCard"}>{props.label}</div>,
                                            // month: {
                                            //     dateHeader: (props) => <div className={token.colorBgLayout === "White" ? "" : "dateColorWhite"}>{props.label}</div>
                                            // },
                                            month: {
                                                dateHeader: ({ date, label }) => {
                                                    const isWeekend = dayjs(date).day() === 0 || dayjs(date).day() === 6;
                                                    const isHoliday = officeHoliday?.some(holiday => dayjs(holiday.date).isSame(date, 'day'));
                                                    const isWhite = isWeekend || isHoliday;

                                                    return (
                                                        <div style={{ color: isWhite ? 'white' : "" }}>
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
                                        width: '800px',
                                        color: "white",
                                        padding: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-around   ',
                                        alignItems: 'center',
                                        backgroundColor: "#ffffff80",
                                        height: "40px",
                                        borderRadius: "12px",
                                    }}>
                                        <span style={{ marginRight: '15px', color: "black" }}>Total Working Days: <b>{monthlySummary?.totalWorkingDays || 0}</b></span>
                                        <span style={{ marginRight: '15px', color: "black" }}>Total Hours: <b>{monthlySummary?.totalWorkingHours || 0}</b></span>
                                        <span>
                                            {monthlySummary?.shortage < 0 ? (
                                                <><span style={{ color: "black" }}>Extra Hours:</span> <b style={{ color: '#50C150' }}>{Math.abs(monthlySummary.shortage)}</b></>
                                            ) : (
                                                <><span style={{ color: "black" }}>Shortage Hours:</span> <b style={{ color: '#E65A5A' }}>{monthlySummary?.shortage || 0}</b></>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div style={{
                            display: 'flex', justifyContent: 'end', padding: '10px',
                        }}>
                            <Button onClick={showModal} type="primary">
                                Apply Leave
                            </Button>
                            <Leaves visible={isModalOpen} onClose={handleCancel} />
                        </div>
                    </Col>
                </Row>
            </div>
            <div
                style={{
                    WebkitMaskImage: `url('/${monthImage}.png')`,
                    maskImage: `url('/${monthImage}.png')`,
                }}
                className="Monthly-Summary-overlay"></div>


        </>
    );
};

export default MonthlySummary;
