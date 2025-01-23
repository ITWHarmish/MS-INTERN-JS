import { Card, DatePicker, Divider, Flex, Input, Layout, message, Space, Spin, Typography } from "antd";
import {
  CalendarOutlined,
  CodeOutlined,
  FieldTimeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import OtherLinks from "./OtherLinks";
import EmployeeDetails from "./EmployeeDetails";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import ProfileHeader from "./ProfileHeader";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { UpdateUserDetails } from "../../services/authAPI";
import { setUser } from "../../redux/slices/authSlice";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({
    fullName: user?.fullName || "",
    duration: user?.duration || "",
    stream: user?.stream || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
    githubURL: user?.githubURL || "",
    linkedinURL: user?.linkedinURL || "",
    hrEmail: user?.hrEmail || "",
    hrFullName: user?.hrFullName || "",
    mentorEmail: user?.mentorEmail || "",
    mentorFullName: user?.mentorFullName || "",
    dob: user?.dob ? dayjs(user?.dob).format("YYYY-MM-DD") : "",
    joiningDate: user?.joiningDate ? dayjs(user?.joiningDate).format("YYYY-MM-DD") : "",
  });

  useEffect(() => {
    if (user) {
      setEditedData({
        fullName: user?.fullName || "",
        duration: user?.duration || "",
        stream: user?.stream || "",
        phoneNumber: user?.phoneNumber || "",
        address: user?.address || "",
        githubURL: user?.githubURL || "",
        linkedinURL: user?.linkedinURL || "",
        hrEmail: user?.hrEmail || "",
        hrFullName: user?.hrFullName || "",
        mentorEmail: user?.mentorEmail || "",
        mentorFullName: user?.mentorFullName || "",
        dob: user?.dob ? dayjs(user?.dob).format("YYYY-MM-DD") : "",
        joiningDate: user?.joiningDate ? dayjs(user?.joiningDate).format("YYYY-MM-DD") : "",
      })
    }
  }, [user])

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await UpdateUserDetails(editedData);
      dispatch(setUser(response.user))
      message.success('Updated successful!');
      setEditMode(false);
    } catch (error) {
      message.error('Updation failed! Please try again.');
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, field: string) => {
    setEditedData({
      ...editedData,
      [field]: e.target.value,
    });
  };

  const handleDateChange = (date: dayjs.Dayjs | null, field: string) => {
    setEditedData({
      ...editedData,
      [field]: date ? date.toISOString() : null,
    });
  };

  return (
    <Spin
      spinning={loading}
      size="large"
      tip="Loading..."
      className="full-page-spin"
    >
      <Flex vertical style={{ height: "91.5vh" }}>
        <ProfileHeader
          editMode={editMode}
          setEditMode={setEditMode}
          handleSave={handleSave}
        />
        <Layout style={{ backgroundColor: "white", height: "auto" }}>
          <Content
            style={{
              backgroundColor: "white",
              width: "auto",
              margin: "auto",
            }}
          >
            <Flex style={{ width: "auto", height: "fit-content" }} gap={70}>
              <Flex>
                <OtherLinks
                  editMode={editMode}
                  editedData={editedData}
                  handleChange={handleChange}
                />
              </Flex>
              <Flex gap={70} style={{ width: "900px" }}>
                <Flex gap={30} vertical style={{ width: "100%" }}>
                  <EmployeeDetails
                    editMode={editMode}
                    editedData={editedData}
                    handleChange={handleChange}
                    handleDateChange={handleDateChange}
                  />
                </Flex>
                <Flex vertical style={{ width: "100%" }}>
                  <Space direction="vertical" size={15} style={{ width: "100%" }}>
                    <Typography.Text
                      style={{ color: "#c9101c", fontSize: "20px" }}
                      strong
                    >
                      Internship Details
                    </Typography.Text>

                    <Space
                      direction="vertical"
                      style={{ width: "100%" }}
                      size={15}
                    >
                      <Card style={{ width: "100%" }}>
                        <Card.Meta
                          avatar={
                            <Flex
                              justify="center"
                              align="center"
                              style={{
                                fontSize: "20px",
                                height: "100%",
                                width: "auto",
                                color: "#c9101c",
                              }}
                            >
                              <CalendarOutlined style={{ margin: "10px" }} />
                            </Flex>
                          }
                          title={
                            <Typography.Text
                              style={{ fontSize: "12px", color: "grey" }}
                            >
                              Joining Date
                            </Typography.Text>
                          }
                          description={
                            <Typography.Text strong style={{ fontSize: "16px" }}>
                              {
                                editMode
                                  ? <DatePicker
                                    value={editedData?.joiningDate ? dayjs(editedData.joiningDate) : null}
                                    size="middle"
                                    onChange={(e) => handleDateChange(e, "joiningDate")}
                                  />
                                  : user?.joiningDate
                                    ? dayjs(user.joiningDate).format("DD MMM YYYY")
                                    : "N/A"
                              }
                            </Typography.Text>
                          }
                        />
                      </Card>
                      <Card style={{ width: "100%" }}>
                        <Card.Meta
                          avatar={
                            <Flex
                              justify="center"
                              align="center"
                              style={{
                                fontSize: "20px",
                                height: "100%",
                                width: "auto",
                                color: "#c9101c",
                              }}
                            >
                              <FieldTimeOutlined style={{ margin: "10px" }} />
                            </Flex>
                          }
                          title={
                            <Typography.Text
                              style={{ fontSize: "12px", color: "grey" }}
                            >
                              Duration
                            </Typography.Text>
                          }
                          description={
                            <Typography.Text strong style={{ fontSize: "16px" }}>
                              {
                                editMode
                                  ? <Input
                                    value={editedData?.duration}
                                    size="middle"
                                    placeholder='Enter Duration Here'
                                    onChange={(e) => handleChange(e, "duration")}
                                  />
                                  : user?.duration
                              }
                            </Typography.Text>
                          }
                        />
                      </Card>

                      <Card className="cardWidth">
                        <Card.Meta
                          avatar={
                            <Flex
                              justify="center"
                              align="center"
                              style={{
                                fontSize: "20px",
                                height: "100%",
                                width: "auto",
                                color: "#c9101c",
                              }}
                            >
                              <CodeOutlined style={{ margin: "10px" }} />
                            </Flex>
                          }
                          title={
                            <Typography.Text
                              style={{ fontSize: "12px", color: "grey" }}
                            >
                              Intern/Trainee
                            </Typography.Text>
                          }
                          description={
                            <Typography.Text strong style={{ fontSize: "16px" }}>
                              {
                                editMode
                                  ? <Input
                                    value={editedData?.stream}
                                    size="middle"
                                    placeholder='Enter Stream Here'
                                    onChange={(e) => handleChange(e, "stream")}
                                  />
                                  : user?.stream
                              }
                            </Typography.Text>
                          }
                        />
                      </Card>
                      <Card className="cardWidth">
                        <Card.Meta
                          title={
                            <>
                              <Typography.Text
                                style={{ color: "#c9101c", fontSize: "20px" }}
                                strong
                              >
                                Team
                              </Typography.Text>
                              <Divider />
                            </>
                          }
                          description={
                            <Space direction="vertical" size={20}>
                              <Flex
                                align="center"
                                gap={10}
                                style={{ width: "100%" }}
                              >
                                <div
                                  style={{
                                    fontSize: "12px",
                                    borderRadius: "50%",
                                    backgroundColor: "#c9101c",
                                    height: "auto",
                                    margin: "10px",
                                  }}
                                >
                                  <UserOutlined
                                    style={{ margin: "8px", color: "white" }}
                                  />
                                </div>
                                <Flex vertical style={{ width: "100%" }} gap={2}>
                                  <Typography.Text
                                    style={{ fontSize: "12px", color: "grey" }}
                                    strong
                                  >
                                    HR
                                  </Typography.Text>
                                  <Flex justify="space-between" vertical>
                                    <Typography.Text
                                      strong
                                      style={{ fontSize: "14px" }}
                                    >
                                      {
                                        editMode
                                          ? <Input
                                            value={editedData?.hrFullName}
                                            size="middle"
                                            placeholder='Enter HR FullName'
                                            onChange={(e) => handleChange(e, "hrFullName")}
                                          />
                                          : user?.hrFullName
                                      }
                                    </Typography.Text>
                                    <Typography.Text
                                      style={{
                                        fontSize: "12px",
                                        color: "grey",
                                      }}
                                    >
                                      {
                                        editMode
                                          ? <Input
                                            value={editedData?.hrEmail}
                                            size="middle"
                                            placeholder='Enter HR Email'
                                            onChange={(e) => handleChange(e, "hrEmail")}
                                          />
                                          : user?.hrEmail
                                      }
                                    </Typography.Text>
                                  </Flex>
                                </Flex>
                              </Flex>
                              <Flex
                                align="center"
                                gap={10}
                                style={{ width: "100%" }}
                              >
                                <div
                                  style={{
                                    fontSize: "12px",
                                    borderRadius: "50%",
                                    backgroundColor: "#c9101c",
                                    height: "auto",
                                    margin: "10px",
                                  }}
                                >
                                  <UserOutlined
                                    style={{ margin: "8px", color: "white" }}
                                  />
                                </div>
                                <Flex vertical style={{ width: "100%" }} gap={2}>
                                  <Typography.Text
                                    style={{ fontSize: "12px", color: "grey" }}
                                    strong
                                  >
                                    Mentor
                                  </Typography.Text>
                                  <Flex justify="space-between" vertical>
                                    <Typography.Text
                                      strong
                                      style={{ fontSize: "14px" }}
                                    >
                                      {
                                        editMode
                                          ? <Input
                                            value={editedData?.mentorFullName}
                                            size="middle"
                                            placeholder='Enter Mentor FullName'
                                            onChange={(e) => handleChange(e, "mentorFullName")}
                                          />
                                          : user?.mentorFullName
                                      }
                                    </Typography.Text>
                                    <Typography.Text
                                      style={{
                                        fontSize: "12px",
                                        color: "grey",
                                      }}
                                    >
                                      {
                                        editMode
                                          ? <Input
                                            value={editedData?.mentorEmail}
                                            size="middle"
                                            placeholder='Enter Mentor Email'
                                            onChange={(e) => handleChange(e, "mentorEmail")}
                                          />
                                          : user?.mentorEmail
                                      }
                                    </Typography.Text>
                                  </Flex>
                                </Flex>
                              </Flex>
                            </Space>
                          }
                        />
                      </Card>
                    </Space>
                  </Space>
                </Flex>
              </Flex>
            </Flex>
          </Content>
        </Layout>
      </Flex>
    </Spin>
  );
};

export default Profile;
