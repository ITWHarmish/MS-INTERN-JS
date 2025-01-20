import {
  GithubOutlined,
  LinkedinOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Flex, Space, Typography } from "antd";
import React from "react";

const OtherLinks = () => {
  return (
    <Flex gap={20} vertical style={{ width: "auto" }} align="center">
      <Avatar
        shape="square"
        size={300}
        icon={<UserOutlined />}
        style={{ border: "2px solid #c9101c" }}
      />
      <Space style={{ width: "100%" }} direction="vertical" size={15}>
        <Card className="cardWidth">
          <Card.Meta
            avatar={
              <Flex
                justify="center"
                align="center"
                style={{
                  fontSize: "25px",
                  width: "auto",
                  color: "#c9101c",
                }}
              >
                <GithubOutlined style={{ margin: "10px" }} />
              </Flex>
            }
            title={
              <Typography.Text style={{ fontSize: "12px", color: "grey" }}>
                Github
              </Typography.Text>
            }
            description={
              <Typography.Text strong style={{ fontSize: "16px" }}>
                github link
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
                  fontSize: "25px",
                  width: "auto",
                  color: "#c9101c",
                }}
              >
                <LinkedinOutlined style={{ margin: "10px" }} />
              </Flex>
            }
            title={
              <Typography.Text style={{ fontSize: "12px", color: "grey" }}>
                Linkdin
              </Typography.Text>
            }
            description={
              <Typography.Text strong style={{ fontSize: "16px" }}>
                profile link
              </Typography.Text>
            }
          />
        </Card>
      </Space>
    </Flex>
  );
};

export default OtherLinks;
