import { DatePicker, Select, Switch, Input, Button, Modal, message } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Spinner from "../../utils/Spinner";
import QuillEditor from "../../utils/QuillEditor";
import { ApplyLeave, GenerateLeaveEmail, SendLeaveToGmail } from "../../services/leaveAPI";
import { ILeave } from "../../types/ILeaves";
import { useDispatch } from "react-redux";
import { fetchLeaves } from "../../redux/actions/leaveActions";

const Leaves = ({ visible, onClose }) => {
    const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
    const [numDays, setNumDays] = useState(1);
    const [leaveType, setLeaveType] = useState(null);
    const [sendMail, setSendMail] = useState(true);
    const [reason, setReason] = useState("");
    const [emailPreview, setEmailPreview] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state: RootState) => state.auth)
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY-MM-DD';
    const dispatch = useDispatch<AppDispatch>();


    const handleLeaveTypeChange = (value) => {
        setLeaveType(value);
        setError("");
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        if (dates) {
            const diffInDays = dates[1].diff(dates[0], 'day') + 1;
            setNumDays(diffInDays);
        } else {
            setNumDays(0);
        }
    };

    const handleGenerateEmail = async () => {
        if (sendMail && !reason) {
            setError("Reason is required");
            return;
        }
        if (sendMail && !leaveType) {
            setError("Leave type is required");
            return;
        }
        setError("");

        const payload: ILeave = {
            from: dateRange[0].format("YYYY-MM-DD"),
            to: dateRange[1].format("YYYY-MM-DD"),
            leaveType: leaveType,
            reason,
        }
        try {
            setLoading(true);
            const generateEmail = await GenerateLeaveEmail(payload);
            setEmailPreview(generateEmail);
            message.success("Enail Generated Successfully")
            setError("");
        } catch (error) {
            console.error('Error while generating email:', error);
            message.error("Error while generating email");
            return;
        }
        finally {
            setLoading(false);
        }
    }

    const handleApplyLeave = async () => {
        if (!dateRange || dateRange.length === 0) {
            setError("Date range is required");
            return;
        }
        if (!leaveType) {
            setError("Leave Type is required");
            return;
        }
        if (sendMail && !emailPreview) {
            setError("Email Preview is required");
            return;
        }
        setError("");
        try {
            const payload: ILeave = {
                from: dateRange[0].format("YYYY-MM-DD"),
                to: dateRange[1].format("YYYY-MM-DD"),
                leaveType: leaveType,
                noOfDays: numDays,
                reason,
            }
            setLoading(true);
            if (sendMail) {
                await SendLeaveToGmail(JSON.stringify({ emailContent: emailPreview }))
                await ApplyLeave(payload);
                dispatch(fetchLeaves());
                message.success('Leave Application Sent Successful!');
                if (message.success) {
                    setDateRange([dayjs(), dayjs()]);
                    setNumDays(1);
                    setLeaveType(null);
                    setSendMail(true);
                    setReason("");
                    setEmailPreview("");
                    onClose();
                }
            }
            else if (!sendMail) {
                await ApplyLeave(payload);
                dispatch(fetchLeaves());
                message.success('Leave Application Apply Successful!');
                if (message.success) {
                    setDateRange([dayjs(), dayjs()]);
                    setNumDays(1);
                    setLeaveType(null);
                    setSendMail(true);
                    onClose();
                }
            }
        } catch (error) {
            console.error('Error while applying leave:', error);
            message.error("Error while applying leave");
            return;
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Modal title={"Apply for Leave"} open={visible} onCancel={onClose} footer={null} centered width={1000}>
            {loading ? <Spinner /> :
                <div style={{ padding: "20px" }}>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", marginBottom: "15px" }}>
                        <div>
                            <div style={{ marginBottom: "7px" }}>
                                <label>
                                    <span style={{ color: 'red' }}>*</span> Date Range
                                </label><br />
                            </div>
                            <RangePicker
                                defaultValue={[dayjs(), dayjs()]}
                                format={dateFormat}
                                onChange={handleDateRangeChange}
                                value={dateRange as [dayjs.Dayjs, dayjs.Dayjs]}
                                disabledDate={(current) => current && current < dayjs().startOf("day")}
                            />
                            {error && !dateRange && error === "Date range is required" && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
                        </div>
                        <div>
                            <div style={{ marginBottom: "7px" }}>
                                <label>No. of days</label><br />
                            </div>
                            <Input disabled type="text" style={{ width: "100%" }} value={numDays} />
                        </div>
                        <div>
                            <div style={{ marginBottom: "7px", marginLeft: "10px" }}>
                                <label>
                                    <span style={{ color: 'red' }}>*</span> Leave Type
                                </label><br />
                            </div>
                            <Select placeholder="Select Leave Type" style={{ width: "100%", marginLeft: "10px" }} value={leaveType}
                                onChange={handleLeaveTypeChange}>
                                <Select.Option value="sick leave">Sick Leave</Select.Option>
                                <Select.Option value="casual leave">Casual Leave</Select.Option>
                                <Select.Option value="half leave">Half Leave</Select.Option>
                            </Select>
                            {error && !leaveType && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
                        </div>
                    </div>

                    <div style={{ display: "flex", marginBottom: "15px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                            <label>Want to send mail</label>
                            <Switch style={{ marginLeft: "10px", width: "20px" }} checked={sendMail} onChange={setSendMail} />
                        </div>

                        {
                            sendMail && (
                                <>
                                    <div style={{ marginLeft: "80px", display: "flex", justifyContent: "center", alignItems: "center", gap: "7px" }}>
                                        <div style={{
                                            marginRight: "7px",
                                            marginLeft: "7px",
                                            display: "flex",
                                            flexDirection: "column",
                                        }}>
                                            <label style={{ marginRight: "7px", marginBottom: "7px" }}>Mail to</label>
                                            <Input disabled type="text" style={{
                                                marginRight: "7px"
                                            }}
                                                value={user?.internshipDetails?.mentor?.mentorEmail}
                                            />
                                        </div>
                                        <div>
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}>
                                                <label style={{ marginRight: "7px", marginBottom: "7px" }}>CC</label>
                                                <Input disabled type="text"
                                                    value={"hr@toshalinfotech.com"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        {
                            sendMail && (
                                <>
                                    <div>
                                        <div style={{ marginBottom: "7px" }} >
                                            <label><span style={{ color: 'red' }}>*</span> Reason
                                            </label><br />
                                        </div>
                                        <Input
                                            value={reason}
                                            onChange={(e) => {
                                                setReason(e.target.value)
                                                setError("")
                                            }
                                            }
                                            style={{ width: "25%" }}
                                        />
                                        <Button onClick={handleGenerateEmail} style={{ marginLeft: '7px', borderRadius: "20px", height: "22px" }} type="primary" size="small"><span style={{ fontSize: "13px" }}>Generate Email with Ai </span><img style={{ height: "16px", filter: "brightness(0) invert(1)" }} src="/geminiIcon.svg" alt="" /></Button>
                                    </div>
                                    {error && !reason && sendMail && <span style={{ color: 'red', fontSize: '12px', marginLeft: "7px" }}>{error}</span>}
                                </>
                            )}
                    </div>
                    {
                        sendMail && (

                            <div style={{ marginBottom: "20px" }}>
                                <div style={{ marginBottom: '7px' }}>
                                    <label>
                                        <span style={{ color: 'red' }}>*</span> Email Preview
                                    </label><br />
                                </div>
                                <QuillEditor content={emailPreview} onChange={setEmailPreview} />
                                {error && !emailPreview && sendMail && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
                            </div>
                        )}

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button onClick={onClose} style={{ marginRight: "10px" }}>Cancel</Button>
                        <Button type="primary" onClick={handleApplyLeave} loading={loading} >Apply Leave</Button>
                    </div>
                </div>
            }
        </Modal >
    );
};

export default Leaves;