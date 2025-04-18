import { Avatar, Card, Col, message, Row, theme, Typography } from "antd";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { UpdateUserDetails } from "../../services/authAPI";
import { setUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { BankOutlined, BarsOutlined, CalendarOutlined, CodeOutlined, FieldTimeOutlined, FileTextOutlined, GithubOutlined, LinkedinOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { telegramUser } = useSelector((state: RootState) => state.telegramAuth);
  const { Text } = Typography;
  const [activeTab, setActiveTab] = useState("internship");
  console.log("user:", user); // Log unused variable

  const fullName = user?.fullName;

  const getInitials = (name?: string) => {
    if (!name) return "";

    const words = name.trim().split(" ")

    if (words.length === 0) return "";
    if (words.length === 1) return words[0][0]?.toUpperCase() || "";
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(fullName);


  const navigate = useNavigate();
  console.log("navigate:", navigate); // Log unused variable

  const dispatch = useDispatch();
  console.log("dispatch:", dispatch); // Log unused variable

  const [loading, setLoading] = useState(true);
  console.log("loading:", loading); // Log unused variable

  const [editMode, setEditMode] = useState(false);
  console.log("editMode:", editMode); // Log unused variable
  const { token } = theme.useToken();
  console.log("token:", token); // Log unused variable

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
  console.log("handleSave:", handleSave); // Log unused variable

  const handleChange = (e, field: string) => {
    setEditedData({
      ...editedData,
      [field]: e.target.value,
    });
  };

  console.log("handleChange", handleChange)

  const handleDateChange = (date: dayjs.Dayjs | null, field: string) => {
    setEditedData({
      ...editedData,
      [field]: date ? date.toISOString() : null,
    });
  };

  console.log("handleChange", handleDateChange)


  useEffect(() => {
    if (user) {
      if (user.internsDetails === undefined || user.internsDetails === "") {
        navigate("/fillUpForm");
      } else {
        navigate("/profile");
      }
    }
    setLoading(false);
  }, [user, navigate])

  return (
    <>
      <div className="image-container">
        <div>
          <Row className="" style={{ height: "calc(100vh - 125px )", padding: "10px 18px 10px 18px", }}>
            <Col md={6}>
              <div>
                <Card
                  style={{
                    height: "calc(100vh - 150px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      padding: "2rem",
                      width: "300px",
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      src={telegramUser?.google?.profile?.picture || undefined}
                      shape="circle"
                      size={100}
                      icon={!telegramUser?.google?.profile?.picture ? initials : undefined}
                      style={{
                      }}
                    />
                    <h3 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
                      {(user?.fullName ?? "").toUpperCase()}
                    </h3>
                    <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />

                    <div style={{ marginTop: "1rem", textAlign: "left" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "10px 15px",
                          color: "white",
                          maxWidth: "320px",
                        }}
                      >
                        <MailOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid #ddd", paddingRight: "10px" }} />
                        <div>
                          <Text type="secondary" style={{ fontSize: "12px", color: "#ddd" }}>
                            E-MAIL
                          </Text>
                          <br />
                          <Text strong style={{ color: "#fff", fontSize: "14px" }}>
                            {user?.email}
                          </Text>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "10px 15px",
                          color: "white",
                          maxWidth: "320px",
                        }}
                      >
                        <PhoneOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid #ddd", paddingRight: "10px" }} />
                        <div>
                          <Text type="secondary" style={{ fontSize: "12px", color: "#ddd" }}>
                            PHONE NUMBER:
                          </Text>
                          <br />
                          <Text strong style={{ color: "#fff", fontSize: "14px" }}>
                            {user?.internsDetails?.phoneNumber}
                          </Text>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "10px 15px",
                          color: "white",
                          maxWidth: "320px",
                        }}
                      >
                        <BankOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid #ddd", paddingRight: "10px" }} />
                        <div>
                          <Text type="secondary" style={{ fontSize: "12px", color: "#ddd" }} >
                            COLLEGGE NAME:
                          </Text>
                          <br />
                          <Text strong style={{ color: "#fff", fontSize: "14px" }}>
                            {user?.internsDetails?.collegeName}
                          </Text>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
                      <a href={user?.internsDetails?.linkedinURL} target="_blank"><LinkedinOutlined style={{ fontSize: "30px" }} /></a>
                      <a href={user?.internsDetails?.githubURL} target="_blank"><GithubOutlined style={{ fontSize: "30px" }} /></a>
                    </div>
                  </div>
                </Card>

                {/* compo */}
              </div>
            </Col>
            <Col md={10}>
              {/* coponent */}
              <Card
                className="custom-card"
                style={{
                  height: "calc(100vh - 150px)",
                  padding: "1rem",
                }}
              >
                <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
                  {/* Internship tab */}
                  <div
                    onClick={() => setActiveTab("internship")}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      color: "white",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "4px" }}>
                      <FileTextOutlined style={{ fontSize: "16px" }} />
                      <span>INTERNSHIP DETAILS</span>
                    </div>
                    {activeTab === "internship" && (
                      <div
                        style={{
                          width: "100%",
                          height: "2px",
                          backgroundColor: "white",
                          marginTop: "6px", // this adds the space between text and border
                        }}
                      />
                    )}
                  </div>

                  {/* Monthly tab */}
                  <div
                    onClick={() => setActiveTab("monthly")}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      color: "white",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "4px" }}>
                      <BarsOutlined style={{ fontSize: "16px" }} />
                      <span>USER ANALYTICS</span>
                    </div>
                    {activeTab === "monthly" && (
                      <div
                        style={{
                          width: "100%",
                          height: "2px",
                          backgroundColor: "white",
                          marginTop: "6px",
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* You can add the content below here based on activeTab */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: "12px",
                      color: "white",
                      maxWidth: "320px",
                    }}
                  >
                    <CalendarOutlined  style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid #ddd", paddingRight: "10px" }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: "12px", color: "#ddd" }}>
                        JOINING DATE
                      </Text>
                      <br />
                      <Text strong style={{ color: "#fff", fontSize: "14px" }}>
                        {dayjs(user?.internsDetails?.joiningDate).format("DD MMM YYYY")}
                      </Text>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: "12px",
                      color: "white",
                      maxWidth: "320px",
                    }}
                  >
                    <FieldTimeOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid #ddd", paddingRight: "10px" }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: "12px", color: "#ddd" }}>
                        DURATION
                      </Text>
                      <br />
                      <Text strong style={{ color: "#fff", fontSize: "14px" }}>
                        {user?.internsDetails?.duration} MONTHS
                      </Text>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: "12px",
                      color: "white",
                      maxWidth: "320px",
                    }}
                  >
                    <CodeOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid #ddd", paddingRight: "10px" }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: "12px", color: "#ddd" }} >
                        STREAM
                      </Text>
                      <br />
                      <Text strong style={{ color: "#fff", fontSize: "14px" }}>
                        {(user?.internsDetails?.stream ?? "").toUpperCase()}
                      </Text>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                    <UserOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid #ddd", paddingRight: "10px" }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: "12px", color: "#bbb" }}>HR</Text><br />
                      <Text strong style={{ color: "white" }}>RIDDHI JARIWALA</Text><br />
                      <Text style={{ color: "white" }}>hr@toshalinfotech.com</Text>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <UserOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid #ddd", paddingRight: "10px" }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: "12px", color: "#bbb" }}>MENTOR</Text><br />
                      <Text strong style={{ color: "white" }}>HARSH PATEL</Text><br />
                      <Text style={{ color: "white" }}>hr@toshalinfotech.com</Text>
                    </div>
                  </div>
                </div>
              </Card>

            </Col>
          </Row>
        </div>


      </div>
        <div className="overlay"></div>


    </>
  );
};

export default Profile;
