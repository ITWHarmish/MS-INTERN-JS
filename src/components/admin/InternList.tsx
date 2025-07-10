import { Table, Card, Button, Switch, message } from "antd";
import type { TableProps } from "antd";
import { IColumnsReports } from "../../types/IReport";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import AddIntern from "./AddIntern";
import { getInternsHook, spaceListHook } from "../../Hooks/internListhook";
import Spinner from "../../utils/Spinner";
import "./InternList.css";
import { IntenDisable } from "../../services/adminAPI";

const InternList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [switchLoading, setSwitchLoading] = useState<string | null>(null);

  const { data: space = [], isLoading: spaceLoading } = spaceListHook(user);

  const {
    data: students = [],
    isLoading: internsLoading,
    refetch,
  } = getInternsHook(user);

  const studentsWithKeys = students.map((student) => ({
    ...student,
    key: student._id,
  }));

  const handleFileClick = (id: string) => {
    navigate(`/profile/${id}`);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleStatusChange = async (
    internId: string,
    currentStatus: boolean
  ) => {
    setSwitchLoading(internId);
    try {
      await IntenDisable(internId);
      if (currentStatus) {
        message.success("Intern has been disabled successfully");
      } else {
        message.success("Intern has been enabled successfully");
      }
    } catch (error) {
      console.error("Error updating intern status:", error);
      message.error("Failed to update intern status");
    } finally {
      setSwitchLoading(null);
      refetch();
    }
  };

  const columns: TableProps<IColumnsReports>["columns"] = [
    {
      title: "Sr. No.",
      dataIndex: "srNo",
      key: "srNo",
      align: "center",
      render: (_, __, index) => index + 1,
      width: "80px",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",

      render: (fullName, record: { _id: string }) => (
        <a
          onClick={() => handleFileClick(record._id)}
          style={{
            color: "inherit",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {fullName}
        </a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",

      render: (email, record: { _id: string }) => (
        <a
          onClick={() => handleFileClick(record._id)}
          style={{
            color: "inherit",
            cursor: "pointer",
            textDecoration: "underline",
            textAlign: "left",
          }}
        >
          {email}
        </a>
      ),
    },

    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      key: "joiningDate",
      align: "center",
      render: (_, record) =>
        record.internsDetails?.joiningDate?.slice(0, 10) || "-",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      align: "center",
      render: (_, record) =>
        record.internsDetails?.duration
          ? `${record.internsDetails.duration} months`
          : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record: { _id: string; status: boolean }) => (
        <Switch
          checked={record.status}
          loading={switchLoading === record._id}
          onChange={() => handleStatusChange(record._id, record.status)}
        />
      ),
    },
  ];

  return (
    <>
      <div style={{ padding: "20px", height: "84vh" }}>
        <Card
          className="internlist"
          style={{ position: "relative", height: "77vh" }}
          title={"Interns List"}
          extra={
            <>
              <Button
                style={{ marginLeft: "15px" }}
                onClick={showModal}
                type="primary"
              >
                Add Intern
              </Button>
              <AddIntern
                space={space}
                visible={isModalOpen}
                onClose={handleCancel}
              />
            </>
          }
        >
          {internsLoading || spaceLoading ? (
            <Spinner />
          ) : (
            <div style={{ paddingTop: "10px" }}>
              <Table<IColumnsReports>
                columns={columns}
                dataSource={studentsWithKeys}
                pagination={false}
                loading={internsLoading || spaceLoading}
                bordered
                size="small"
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
          )}
        </Card>
      </div>
    </>
  );
};

export default InternList;
