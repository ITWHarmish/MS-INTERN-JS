import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Table, Card, Button, Select, message } from "antd";
import type { TableProps } from 'antd';
import { IColumnsReports } from "../../types/IReport";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProgressReport } from "../../redux/actions/progressReportActions";
import { DeleteProgressReport, UpdateProgressReportStatus } from "../../services/progressReportAPI";
import { GetInternReport, GetInternsByMentorId, GetMentorList } from "../../services/adminAPI";
import ModalCard from "../../utils/ModalCard";

const ProgressReports = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const { progressReport } = useSelector((state: RootState) => state.report)
    const { user } = useSelector((state: RootState) => state.auth)
    const [mentorListName, setMentorListName] = useState<{ mentorId: string; mentorFullName: string }[]>([]);
    const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
    const [students, setStudents] = useState<{ _id: string; fullName: string }[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [studentReports, setStudentReports] = useState<IColumnsReports[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await dispatch(fetchProgressReport());
            } catch (error) {
                console.error("Error fetching reports:", error);
                message.error("Failed to fetch progress reports.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);



    const columns: TableProps<IColumnsReports>['columns'] = [
        {
            title: 'Sr. No.',
            dataIndex: 'srNo',
            key: 'srNo',
            align: 'center',
            render: (_, __, index) => index + 1,
            width: "80px"
        },
        {
            title: 'File Name',
            dataIndex: 'duration',
            key: 'duration',
            render: (duration: { from: string; to: string }, record: { _id: string }) => (
                <a
                    onClick={() => handleFileClick(record._id)}
                    style={{ color: "inherit", cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {`${duration.from}-to-${duration.to}`}
                </a>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <div>
                    {
                        user?.admin ?
                            < Select
                                style={{ width: "25%" }}
                                defaultValue={record.status}
                                onChange={(value) => handleStatusChange(record._id, value)}
                                options={[
                                    { value: "pending", label: "Pending" },
                                    { value: "in preview", label: "In Preview" },
                                    { value: "approved", label: "Approved" },
                                    { value: "rejected", label: "Rejected" },
                                ]}
                            />
                            :
                            record.status
                    }
                </div>
            ),
        }, {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: "center", gap: '10px', cursor: 'pointer', alignItems: "center" }}>
                    <Button
                        className="check2"
                        icon={<EditOutlined className="check" />}
                        size="small"
                        onClick={() => {
                            handleEdit(record);
                        }}
                        disabled={user?.admin ? false : record?.status === "approved"}
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined className="check" />}
                        size="small"
                        onClick={() => {
                            handleDelete(record._id);
                        }}
                    />
                    <ModalCard
                        title="Are you sure do you want to delete this report?"
                        ModalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        onOk={confirmDelete}
                    />
                </div>
            ),
        },
    ];

    const handleFileClick = (id: string) => {
        navigate(`/report/pdf/${id}`);
    };

    const handleStatusChange = async (id: string, value: string) => {
        const payload = {
            status: value,
        }
        try {
            await UpdateProgressReportStatus(id, payload)
            dispatch(fetchProgressReport());
            message.success("Status updated successfully!");
        } catch (error) {
            console.error("Failed to update status", error);
            message.error("Failed to update status. Please try again.");
        }
    }

    const handleEdit = async (record) => {
        if (user?.admin) {
            try {
                await UpdateProgressReportStatus(record._id, { status: "in preview" });
                dispatch(fetchProgressReport());
            } catch (error) {
                console.error("Failed to update status", error);
                message.error("Failed to update status. Please try again.");
            }
        }
        navigate(`/reportuser/${record._id}`)
    }

    const handleDelete = async (id: string) => {
        setDeleteId(id);
        setModalOpen(true);
    }

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            setLoading(true);
            await DeleteProgressReport(deleteId);
            dispatch(fetchProgressReport());
            message.success("Report deleted successfully!");
        } catch (error) {
            console.error("Error While deleting Report", error);
            message.error("Failed to delete the report. Please try again.");
        } finally {
            setLoading(false);
            setModalOpen(false);
            setDeleteId(null);
        }
    };

    useEffect(() => {
        if (!user?.admin) return;
        const fetchMentorList = async () => {
            const res = await GetMentorList();
            setMentorListName(res.data);
        }
        fetchMentorList();
    }, [user?.admin])

    const handleMentorChange = async (mentorId: string) => {
        setSelectedMentor(mentorId);
        try {
            const res = await GetInternsByMentorId(mentorId);
            setStudents(res.data || []);
        } catch (error) {
            console.error("Error fetching interns:", error);
        }
    };

    const handleStudentChange = async (studentId: string) => {
        setSelectedStudent(studentId);
        try {
            if (user?.admin) {
                setLoading(true);
                const res = await GetInternReport(studentId);
                setStudentReports(res.data || []);
            }
        } catch (error) {
            console.error("Error fetching student reports:", error);
            message.error("Failed to fetch student reports.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div style={{ padding: "20px", height: "88vh" }}>

                <Card style={{ position: "relative", height: "calc(100vh - 150px)" }}
                    title={
                        "Progress Report"
                    }
                    extra={
                        <>
                            {user?.admin ?
                                <>
                                    <Select
                                        showSearch
                                        placeholder="Select Mentor"
                                        onChange={handleMentorChange}
                                        options={mentorListName?.map((mentor) => ({
                                            value: mentor.mentorId,
                                            label: mentor.mentorFullName,
                                        }))}
                                    />

                                    <Select
                                        showSearch
                                        style={{ marginLeft: "15px" }}
                                        placeholder="Select Student"
                                        options={students.map((student) => ({
                                            value: student._id,
                                            label: student.fullName,
                                        }))}
                                        disabled={!selectedMentor}
                                        onChange={handleStudentChange}
                                    />
                                </>
                                :
                                <Button onClick={() => { navigate("/reportuser") }} type="primary">
                                    Add New Report
                                </Button>
                            }
                        </>
                    }
                >
                    <div
                        style={{ paddingTop: "10px" }}
                    >
                        <Table<IColumnsReports>
                            columns={columns}
                            dataSource={user?.admin && selectedStudent ? studentReports : progressReport}
                            pagination={false}
                            bordered
                            size="small"
                            loading={loading}
                            sticky={true}
                            locale={{ emptyText: <></> }}
                            className="ScrollInProgress"
                            style={{
                                height: "calc(65vh - 88px)",
                                position: "absolute",
                                overflowY: "auto",
                                overflowX: "hidden",
                                left: "10px",
                                right: "0",
                                paddingRight: "10px",
                            }}
                        />
                    </div>
                </Card >
            </div>
        </>
    )
}

export default ProgressReports
