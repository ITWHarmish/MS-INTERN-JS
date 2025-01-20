import Navbar from "../shared/Navbar";
import { Avatar, Card, Divider, Flex, Layout, Space, Typography } from "antd";
import {
  CalendarOutlined,
  CodeOutlined,
  FieldTimeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Content, Footer } from "antd/es/layout/layout";
import OtherLinks from "./OtherLinks";
import ProfileHeader from "./profileHeader";
import EmployeeDetails from "./EmployeeDetails";

const profile = () => {
  return (
    <Flex vertical style={{ height: "91.5vh" }}>
      <ProfileHeader />
      <Layout style={{ backgroundColor: "white",height:"auto"}}>
        <Content
          style={{
            backgroundColor: "white",
            width: "auto",
            margin: "auto",
          }}
        >
          <Flex style={{ width: "auto", height: "fit-content" }} gap={70}>
            <Flex>
              <OtherLinks />
            </Flex>
            <Flex gap={70} style={{ width: "900px" }}>
              <Flex gap={30} vertical style={{ width: "100%" }}>
                <EmployeeDetails />
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
                            12 sep,2024
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
                            6 months
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
                            React Developer Intern
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
                                    Chetan pumbhadia
                                  </Typography.Text>
                                  <Typography.Text
                                    style={{
                                      fontSize: "12px",
                                      color: "grey",
                                    }}
                                  >
                                    chetan.pumbhadia@toshalinfotech.com
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
                                  HR
                                </Typography.Text>
                                <Flex justify="space-between" vertical>
                                  <Typography.Text
                                    strong
                                    style={{ fontSize: "14px" }}
                                  >
                                    Chetan pumbhadia
                                  </Typography.Text>
                                  <Typography.Text
                                    style={{
                                      fontSize: "12px",
                                      color: "grey",
                                    }}
                                  >
                                    chetan.pumbhadia@toshalinfotech.com
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
      <div
        style={{
          backgroundColor: "#ebf2ed",
          justifySelf: "end",
          width: "100vw",
          padding: "10px 0",
        }}
      >
        <Typography.Text
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "15px",
            marginTop: "auto 0 0 0",
          }}
        >
          @ToshalInfotech2025
        </Typography.Text>
      </div>
    </Flex>
  );
};

export default profile;
