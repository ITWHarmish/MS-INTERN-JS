import { Avatar, Card, Col, Row, Typography } from "antd";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { GetCurrentUser } from "../../services/authAPI";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";
import { AccountBookOutlined, BankOutlined, BarsOutlined, CalendarOutlined, CheckSquareOutlined, CodeOutlined, FieldTimeOutlined, FileTextOutlined, GithubOutlined, LinkedinOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { GetFullAttendanceSummary } from "../../services/monthlySummaryAPI";
import { CalculateCompletionRate } from "../../services/todoAPI";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { telegramUser } = useSelector((state: RootState) => state.telegramAuth);
  const { Text } = Typography;
  const [activeTab, setActiveTab] = useState("internship");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  console.log("loading:", loading); // Log unused variable
  const [selectedUser, setSelectedUser] = useState(user);
  const [attendanceSummary, setAttendanceSummary] = useState<{ totalLeaves?: number; halfLeaves?: number; attendanceRate?: number } | null>(null)
  const [completionRate, setCompletionRate] = useState<{ completionRate: number } | null>(null)
  const { id } = useParams();

  const getInitials = (name?: string) => {
    if (!name) return "";

    const words = name.trim().split(" ")

    if (words.length === 0) return "";
    if (words.length === 1) return words[0][0]?.toUpperCase() || "";
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const fullName = selectedUser?.fullName;
  const initials = getInitials(fullName);

  const fetchAttedanceSummary = async () => {
    const res = await GetFullAttendanceSummary({ userId: id });
    setAttendanceSummary(res);
  }

  const fetchCompletionRate = async () => {
    const res = await CalculateCompletionRate(id);
    setCompletionRate(res);
  }

  useEffect(() => {
    fetchAttedanceSummary();
    fetchCompletionRate();
  }, [id])


  useEffect(() => {
    setSelectedUser(user)
  }, [user])

  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchUser = async () => {
        if (user) {
          if (user.admin) {
            try {
              const res = await GetCurrentUser(id);
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
    <>
      <div className="image-container">
        <div>
          <Row className="" style={{ height: "calc(100vh - 125px )", padding: "10px 18px 10px 18px", }}>
            <Col md={6}>
              <div>
                <Card
                  style={{
                    height: "calc(100vh - 135px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "5px"
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      padding: "2rem",
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
                      {(selectedUser?.fullName ?? "").toUpperCase()}
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
                        <MailOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid white", paddingRight: "10px" }} />
                        <div>
                          <Text type="secondary" style={{ fontSize: "12px", color: "white" }}>
                            E-MAIL
                          </Text>
                          <br />
                          <Text strong style={{ color: "#fff", fontSize: "14px" }}>
                            {selectedUser?.email}
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
                        <PhoneOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid white", paddingRight: "10px" }} />
                        <div>
                          <Text type="secondary" style={{ fontSize: "12px", color: "white" }}>
                            PHONE NUMBER:
                          </Text>
                          <br />
                          <Text strong style={{ color: "#fff", fontSize: "14px" }}>
                            {selectedUser?.internsDetails?.phoneNumber}
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
                        <BankOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid white", paddingRight: "10px" }} />
                        <div>
                          <Text type="secondary" style={{ fontSize: "12px", color: "white" }} >
                            COLLEGGE NAME:
                          </Text>
                          <br />
                          <Text strong style={{ color: "#fff", fontSize: "14px" }}>
                            {selectedUser?.internsDetails?.collegeName}
                          </Text>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
                      <a href={selectedUser?.internsDetails?.linkedinURL} target="_blank"><LinkedinOutlined style={{ fontSize: "30px" }} /></a>
                      <a href={selectedUser?.internsDetails?.githubURL} target="_blank"><GithubOutlined style={{ fontSize: "30px" }} /></a>
                    </div>
                  </div>
                </Card>
              </div>
            </Col>
            <Col md={10}>
              <Card
                className="custom-card"
                style={{
                  height: "calc(100vh - 135px)",
                  padding: "1rem",
                }}
              >
                <div style={{ display: "flex", gap: "2rem", paddingBottom: "4px" }}>
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
                          marginTop: "6px",
                        }}
                      />
                    )}
                  </div>

                  <div
                    onClick={() => setActiveTab("userAnalytics")}
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
                    {activeTab === "userAnalytics" && (
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

                {activeTab === "internship" && (
                  <>
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
                        <CalendarOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid white", paddingRight: "10px" }} />
                        <div>
                          <Text type="secondary" style={{ fontSize: "12px", color: "white" }}>
                            JOINING DATE
                          </Text>
                          <br />
                          <Text strong style={{ color: "#fff", fontSize: "14px" }}>
                            {dayjs(selectedUser?.internsDetails?.joiningDate).format("DD MMM YYYY")}
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
                        <FieldTimeOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid white", paddingRight: "10px" }} />
                        <div>
                          <Text type="secondary" style={{ fontSize: "12px", color: "white" }}>
                            DURATION
                          </Text>
                          <br />
                          <Text strong style={{ color: "#fff", fontSize: "14px" }}>
                            {selectedUser?.internsDetails?.duration} MONTHS
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
                        <CodeOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid white", paddingRight: "10px" }} />
                        <div>
                          <Text type="secondary" style={{ fontSize: "12px", color: "white" }} >
                            STREAM
                          </Text>
                          <br />
                          <Text strong style={{ color: "#fff", fontSize: "14px" }}>
                            {(selectedUser?.internsDetails?.stream ?? "").toUpperCase()}
                          </Text>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: "2rem" }}>
                      <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                        <UserOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid white", paddingRight: "10px" }} />
                        <div>
                          <Text type="secondary" style={{ fontSize: "12px", color: "#fff" }}>HR</Text><br />
                          <Text strong style={{ color: "white" }}>RIDDHI JARIWALA</Text><br />
                          <Text style={{ color: "white" }}>hr@toshalinfotech.com</Text>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <UserOutlined style={{ fontSize: "24px", marginRight: "12px", borderRight: "1px solid white", paddingRight: "10px" }} />
                        <div>
                          <Text type="secondary" style={{ fontSize: "12px", color: "#fff" }}>MENTOR</Text><br />
                          <Text strong style={{ color: "white" }}>{selectedUser?.internshipDetails?.mentor?.fullName}</Text><br />
                          <Text style={{ color: "white" }}>{selectedUser?.internshipDetails?.mentor?.email}</Text>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "userAnalytics" && (
                  <div style={{}}>
                    <Row gutter={[16, 16]} style={{ marginTop: "1rem" }}>
                      <Col span={12}>
                        <Card
                          className="custom-card-img1"
                          style={{
                            height: "100px",
                            position: "relative",
                            borderRadius: "12px",
                            borderColor: "transparent",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", }}>
                            <Text style={{ color: "#fff", position: "absolute", left: "7px", bottom: "0px", fontSize: "25px" }}>{attendanceSummary?.halfLeaves}</Text>
                            <Text style={{ color: "#fff", position: "absolute", right: "7px", bottom: "0" }}><span style={{ fontWeight: "100px", fontSize: "12px" }}>HALF DAY</span> <span style={{ fontSize: "25px", marginLeft: "7px", }}><AccountBookOutlined /></span></Text>
                          </div>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card
                          className="custom-card-img2"
                          style={{
                            height: "100px",
                            position: "relative",
                            borderRadius: "12px",
                            borderColor: "transparent"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", }}>
                            <Text style={{ color: "#fff", position: "absolute", left: "7px", bottom: "0px", fontSize: "25px" }}>{attendanceSummary ? attendanceSummary.totalLeaves : "N/A"}</Text>
                            <Text style={{ color: "#fff", position: "absolute", right: "7px", bottom: "0px" }}> <span style={{ fontWeight: "100px", fontSize: "12px" }}>LEAVE</span> <span style={{ fontSize: "25px", marginLeft: "7px" }}><AccountBookOutlined /></span></Text>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]} style={{ marginTop: "1rem" }}>
                      <Col span={12}>
                        <Card
                          className="custom-card-img3"
                          style={{
                            height: "100px",
                            position: "relative",
                            borderRadius: "12px",
                            borderColor: "transparent"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", }}>
                            <Text style={{ color: "#fff", position: "absolute", left: "7px", bottom: "0px", fontSize: "25px" }}>{completionRate ? `${Math.round(completionRate.completionRate)}%` : "N/A"}
                            </Text>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", }}>
                              <Text style={{ color: "#fff", position: "absolute", right: "7px", bottom: "7px", fontSize: "12px" }}> <span style={{ fontWeight: "100px" }}>TASK COMPLETION</span>
                                <span style={{}}><CheckSquareOutlined style={{ fontSize: "25px", marginLeft: "7px" }} /></span>
                              </Text>
                            </div>
                          </div>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card
                          className="custom-card-img4"
                          style={{
                            height: "100px",
                            position: "relative",
                            borderRadius: "12px",
                            borderColor: "transparent"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", }}>
                            <Text style={{ color: "#fff", position: "absolute", left: "7px", bottom: "0px", fontSize: "25px" }}>{attendanceSummary && `${Math.round(attendanceSummary?.attendanceRate)}%`}</Text>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", }}>
                              <Text style={{ color: "#fff", position: "absolute", right: "7px", bottom: "7px", fontWeight: "100px", fontSize: "12px" }}>ATTENDANCE <span style={{ marginLeft: "7px" }}><CheckSquareOutlined style={{ fontSize: "25px" }} /></span></Text>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                )}

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
