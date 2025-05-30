import { Table, Card, Button, Switch } from "antd";
import type { TableProps } from "antd";
import { IColumnsReports } from "../../types/IReport";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import AddIntern from "./AddIntern";
import { getInternsHook, spaceListHook } from "../../hooks/internlistHook";

const InternList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: space = [], isLoading: spaceLoading } = spaceListHook(user);

  const { data: students = [], isLoading: internsLoading } =
    getInternsHook(user);

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
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record: { _id: string }) => <Switch />,
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
          <div style={{ paddingTop: "10px" }}>
            <Table<IColumnsReports>
              columns={columns}
              dataSource={studentsWithKeys}
              pagination={false}
              bordered
              size="small"
              loading={internsLoading || spaceLoading}
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
        </Card>
      </div>
    </>
  );
};

export default InternList;
