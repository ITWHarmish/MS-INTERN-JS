import { Table, Card, Button, message } from "antd";
import type { TableProps } from 'antd';
import { IColumnsReports } from "../../types/IReport";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { GetInternsByMentorId } from "../../services/adminAPI";
import AddIntern from "./AddIntern";

const InternList = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<{ _id: string; fullName: string }[]>([]);

    const fetchInterns = async () => {
        if (!user || !user._id) {
            console.warn("User or Mentor ID is missing, skipping API call");
            return;
        }
        setLoading(true);
        try {
            const res = await GetInternsByMentorId(user._id);
            setStudents(res.data || []);
        } catch (error) {
            console.error("Error Intern List:", error);
            message.error("Failed to fetch Intern List.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterns();
    }, [user]);



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
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (fullName, record: { _id: string }) => (
                <a
                    onClick={() => handleFileClick(record._id)}
                    style={{ color: "inherit", cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {`${fullName}`}
                </a>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
        },
    ];

    const handleFileClick = (id: string) => {
        navigate(`/profile/${id}`);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div style={{ padding: "20px", height: "88vh" }}>

                <Card style={{ position: "relative", height: "65vh" }}
                    title={
                        "Interns List"
                    }
                    extra={
                        <>
                            <Button
                                style={{ marginLeft: "15px" }}
                                onClick={showModal}
                                type="primary"
                            >
                                Add Intern
                            </Button>
                            <AddIntern visible={isModalOpen} onClose={handleCancel} fetchInterns={fetchInterns} />

                        </>
                    }
                >
                    <div
                        style={{ paddingTop: "10px" }}
                    >
                        <Table<IColumnsReports>
                            columns={columns}
                            dataSource={students}
                            pagination={false}
                            bordered
                            size="small"
                            loading={loading}
                            sticky={true}
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

export default InternList
