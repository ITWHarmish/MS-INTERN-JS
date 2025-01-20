import {
  CalendarOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Flex, Space, Typography } from "antd";
import React from "react";

const EmployeeDetails = () => {
  return (
    <>
      <Space direction="vertical" size={15} style={{ width: "100%" }}>
        <Typography.Text strong style={{ color: "#c9101c", fontSize: "20px" }}>
          Personal Details
        </Typography.Text>
        <Space style={{ width: "100%" }} direction="vertical" size={15}>
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
                  <UserOutlined style={{ margin: "10px" }} />
                </Flex>
              }
              title={
                <Typography.Text style={{ fontSize: "12px", color: "grey" }}>
                  Name
                </Typography.Text>
              }
              description={
                <Typography.Text strong style={{ fontSize: "16px" }}>
                  Ujjval Patel
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
                  <GiftOutlined style={{ margin: "10px" }} />
                </Flex>
              }
              title={
                <Typography.Text style={{ fontSize: "12px", color: "grey" }}>
                  Date of birth
                </Typography.Text>
              }
              description={
                <Typography.Text strong style={{ fontSize: "16px" }}>
                  9 sep,2001
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
                  <MailOutlined style={{ margin: "10px" }} />
                </Flex>
              }
              title={
                <Typography.Text style={{ fontSize: "12px", color: "grey" }}>
                  E-mail
                </Typography.Text>
              }
              description={
                <Typography.Text strong style={{ fontSize: "16px" }}>
                  Example@email.com
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
                  <PhoneOutlined style={{ margin: "10px" }} />
                </Flex>
              }
              title={
                <Typography.Text style={{ fontSize: "12px", color: "grey" }}>
                  Mobile No
                </Typography.Text>
              }
              description={
                <Typography.Text strong style={{ fontSize: "16px" }}>
                  1800045000
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
                  <EnvironmentOutlined style={{ margin: "10px" }} />
                </Flex>
              }
              title={
                <Typography.Text style={{ fontSize: "12px", color: "grey" }}>
                  Location
                </Typography.Text>
              }
              description={
                <Typography.Text strong style={{ fontSize: "16px" }}>
                  Surat,Gujrat
                </Typography.Text>
              }
            />
          </Card>
        </Space>
      </Space>
    </>
  );
};

export default EmployeeDetails;
