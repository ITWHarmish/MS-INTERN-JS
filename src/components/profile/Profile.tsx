import { Card, DatePicker, Divider, Flex, Input, Layout, message, Space, theme, Typography } from "antd";
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
import ProfileHeader from "./ProfileTopBar";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GetCurrentUserId, UpdateUserDetails } from "../../services/authAPI";
import { setUser } from "../../redux/slices/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../utils/Spinner";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(user);
  const { token } = theme.useToken();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchUser = async () => {
        if (user) {
          if (user.admin) {
            try {
              const res = await GetCurrentUserId(id);
              setSelectedUser(res.user);
            } catch (error) {
              console.error("Error fetching user:", error);
            } finally {
              setLoading(false);
            }
          }
        }
      }
      fetchUser();
    }
  }, [user, id])


  const [editedData, setEditedData] = useState({
    fullName: user?.fullName || "",
    duration: user?.internsDetails?.duration || "",
    stream: user?.internsDetails?.stream || "",
    phoneNumber: user?.internsDetails?.phoneNumber || "",
    address: user?.internsDetails?.address || "",
    githubURL: user?.internsDetails?.githubURL || "",
    linkedinURL: user?.internsDetails?.linkedinURL || "",
    hrEmail: user?.hrEmail || "",
    hrFullName: user?.hrFullName || "",
    mentorEmail: user?.internshipDetails?.mentorEmail || "",
    mentorFullName: user?.internshipDetails?.mentorFullName || "",
    collegeName: user?.internsDetails?.collegeName || "",
    dob: user?.dob ? dayjs(user?.dob).format("YYYY-MM-DD") : "",
    joiningDate: user?.internshipDetails?.joiningDate ? dayjs(user?.internshipDetails?.joiningDate).format("YYYY-MM-DD") : "",
  });

  useEffect(() => {
    if (user) {
      setEditedData({
        fullName: user?.fullName || "",
        duration: user?.internsDetails?.duration || "",
        stream: user?.internsDetails?.stream || "",
        phoneNumber: user?.internsDetails?.phoneNumber || "",
        address: user?.internsDetails?.address || "",
        githubURL: user?.internsDetails?.githubURL || "",
        linkedinURL: user?.internsDetails?.linkedinURL || "",
        hrEmail: user?.hrEmail || "",
        hrFullName: user?.hrFullName || "",
        mentorEmail: user?.internshipDetails?.mentorEmail || "",
        mentorFullName: user?.internshipDetails?.mentorFullName || "",
        collegeName: user?.internsDetails?.collegeName || "",
        dob: user?.dob ? dayjs(user?.dob).format("YYYY-MM-DD") : "",
        joiningDate: user?.internshipDetails?.joiningDate ? dayjs(user?.internshipDetails?.joiningDate).format("YYYY-MM-DD") : "",
      })
    }
  }, [user])

  const handleSave = async () => {
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

  useEffect(() => {
    if (user) {
      if (!user.admin) {
        if (user.internsDetails === undefined || user.internsDetails === "") {
          navigate("/fillUpForm");
        } else {
          navigate("/profile");
        }
      }
    }
    setLoading(false);
  }, [user, navigate])

  return (
    <div
      style={{ backgroundColor: token.colorBgLayout }}
    >
      {
        loading ? <Spinner /> :
          <Flex vertical style={{ marginBottom: "65px", overflowX: "hidden" }}>
            <ProfileHeader
              editMode={editMode}
              setEditMode={setEditMode}
              handleSave={handleSave}
            />
            <Layout style={{ height: "auto", overflow: "hidden" }}>
              <Content
                style={{
                  backgroundColor: "white",
                  width: "auto",
                  margin: "auto",
                }}
              >
                <Flex style={{ width: "auto", height: "fit-content", backgroundColor: token.colorBgLayout }} gap={70}>
                  <Flex>
                    <OtherLinks
                      userDetails={selectedUser}
                    />
                  </Flex>
                  <Flex gap={70} style={{ width: "900px" }}>
                    <Flex gap={30} vertical style={{ width: "100%" }}>
                      <EmployeeDetails
                        editMode={editMode}
                        editedData={editedData}
                        handleChange={handleChange}
                        userDetails={selectedUser}
                      />
                    </Flex>
                    <Flex vertical style={{ width: "100%", marginRight: "35px" }}>
                      <Space direction="vertical" size={15} style={{ width: "100%" }}>
                        <Typography.Text
                          style={{ color: token.colorPrimary, fontSize: "20px" }}
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
                                    color: token.colorPrimary,
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
                                        value={editedData?.joiningDate ? dayjs(editedData?.joiningDate) : null}
                                        size="middle"
                                        onChange={(e) => handleDateChange(e, "joiningDate")}
                                      />
                                      : selectedUser?.internsDetails?.joiningDate
                                        ? dayjs(selectedUser?.internsDetails?.joiningDate).format("DD MMM YYYY")
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
                                    color: token.colorPrimary,
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
                                      : `${selectedUser?.internsDetails?.duration} months`
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
                                    color: token.colorPrimary,
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
                                      : selectedUser?.internsDetails?.stream
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
                                    style={{ color: token.colorPrimary, fontSize: "20px" }}
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
                                        backgroundColor: token.colorPrimary,
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
                                          Ridhhi Jariwala
                                        </Typography.Text>
                                        <Typography.Text
                                          style={{
                                            fontSize: "12px",
                                            color: "grey",
                                          }}
                                        >
                                          hr@toshalinfotech.com
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
                                        backgroundColor: token.colorPrimary,
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
                                              : selectedUser?.internshipDetails?.mentor?.mentorFullName
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
                                              : selectedUser?.internshipDetails?.mentor?.mentorEmail
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
      }
    </div>
  );
};

export default Profile;
