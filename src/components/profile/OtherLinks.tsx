import {
  GithubOutlined,
  LinkedinOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Flex, Input, Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const OtherLinks = ({ editMode, editedData, handleChange }) => {
  const { user } = useSelector((state: RootState) => state.auth)
  const { telegramUser } = useSelector((state: RootState) => state.telegramAuth);
  return (
    <Flex gap={20} vertical style={{ width: "auto" }} align="center">
      <Avatar
        src={telegramUser?.google?.profile?.picture}
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
              <Typography.Text strong style={{ fontSize: "16px" }} >
                {
                  editMode
                    ? <Input
                      value={editedData?.githubURL}
                      size="middle"
                      placeholder='Enter Your GithubURL'
                      onChange={(e) => handleChange(e, "githubURL")}
                    />
                    : user?.githubURL ? <a href={user?.githubURL} target="_blanck">{user?.githubURL}</a> : "Not Provided"
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
                {
                  editMode
                    ? <Input
                      value={editedData?.linkedinURL}
                      size="middle"
                      placeholder='Enter Your LinkedinURL'
                      onChange={(e) => handleChange(e, "linkedinURL")}
                    />
                    : user?.linkedinURL ? <a href={user?.linkedinURL} target="_blanck">{user?.linkedinURL}</a> : "Not Provided"
                }
              </Typography.Text>
            }
          />
        </Card>
      </Space>
    </Flex>
  );
};

export default OtherLinks;
