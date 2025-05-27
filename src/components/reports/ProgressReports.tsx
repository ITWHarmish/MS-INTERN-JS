import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Table, Card, Button, Select, message } from "antd";
import type { TableProps } from "antd";
import { IColumnsReports } from "../../types/IReport";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import {
  DeleteProgressReport,
  UpdateProgressReportStatus,
} from "../../services/progressReportAPI";

import ModalCard from "../../utils/ModalCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RootState } from "../../redux/store";
import {
  internsHook,
  internsReportHook,
  mentorsHook,
} from "../../hooks/progressReportsHook";

const ProgressReports = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { progressReport } = useSelector((state: RootState) => state.report);
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: mentors = [] } = mentorsHook(user);

  const { data: students = [] } = internsHook(user, selectedMentor);

  const { data: studentReports = [] } = internsReportHook(
    selectedStudent,
    user
  );

  const statusUpdateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      UpdateProgressReportStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentReports"] });
      message.success("Status updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update status", error);
      message.error("Failed to update status. Please try again.");
    },
  });

  const deleteReportMutation = useMutation({
    mutationFn: (id: string) => DeleteProgressReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentReports"] });
      message.success("Report deleted successfully!");
      setModalOpen(false);
    },
    onError: (error) => {
      console.error("Error While deleting Report", error);
      message.error("Failed to delete the report. Please try again.");
    },
  });

  const columns: TableProps<IColumnsReports>["columns"] = [
    {
      title: "SR. NO.",
      dataIndex: "srNo",
      key: "srNo",
      align: "center",
      render: (_, __, index) => index + 1,
      width: "80px",
    },
    {
      title: "FILE NAME",
      dataIndex: "duration",
      key: "duration",
      render: (
        duration: { from: string; to: string },
        record: { _id: string }
      ) => (
        <a
          onClick={() => handleFileClick(record._id)}
          style={{
            color: "inherit",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {`${duration.from}-to-${duration.to}`}
        </a>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <div>
          {user?.admin ? (
            <Select
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
          ) : (
            record.status
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            cursor: "pointer",
            alignItems: "center",
          }}
        >
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

  const handleStatusChange = (id: string, value: string) => {
    statusUpdateMutation.mutate({ id, status: value });
  };

  const handleEdit = async (record) => {
    if (user?.admin) {
      statusUpdateMutation.mutate({ id: record._id, status: "in preview" });
    }
    navigate(`/reportuser/${record._id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteReportMutation.mutate(deleteId);
    }
  };

  const handleMentorChange = (mentorId: string) => {
    setSelectedMentor(mentorId);
    setSelectedStudent(null);
  };

  const handleStudentChange = (studentId: string) => {
    setSelectedStudent(studentId);
  };

  return (
    <div
      style={{ padding: "10px 20px 0px 20px", height: "calc(100vh - 130px)" }}
    >
      <Card
        className="progressreport"
        style={{ position: "relative", height: "calc(100vh - 150px)" }}
        title={"PROGRESS REPORT"}
        extra={
          <>
            {user?.admin ? (
              <>
                <Select
                  showSearch
                  placeholder="Select Mentor"
                  onChange={handleMentorChange}
                  options={mentors?.map((mentor) => ({
                    value: mentor._id,
                    label: mentor.fullName,
                  }))}
                />

                <Select
                  showSearch
                  style={{ marginLeft: "15px" }}
                  placeholder="Select Student"
                  options={students?.map((student) => ({
                    value: student._id,
                    label: student.fullName,
                  }))}
                  disabled={!selectedMentor}
                  onChange={handleStudentChange}
                />
              </>
            ) : (
              <Button
                onClick={() => {
                  navigate("/reportuser");
                }}
                type="primary"
              >
                ADD NEW REPORT
              </Button>
            )}
          </>
        }
      >
        <div style={{ paddingTop: "10px" }}>
          <Table<IColumnsReports>
            columns={columns}
            dataSource={
              user?.admin && selectedStudent ? studentReports : progressReport
            }
            pagination={false}
            bordered
            size="small"
            loading={
              statusUpdateMutation.isPending || deleteReportMutation.isPending
            }
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
      </Card>
    </div>
  );
};

export default ProgressReports;
