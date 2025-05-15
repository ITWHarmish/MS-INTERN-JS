import {
  GithubOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Flex, Space, theme } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const OtherLinks = ({ userDetails }) => {
  const { user } = useSelector((state: RootState) => state.auth)
  const { telegramUser } = useSelector((state: RootState) => state.telegramAuth);
  const { token } = theme.useToken();

  const selectedUser = userDetails || user;
  const fullName = selectedUser?.fullName;

  const getInitials = (name?: string) => {
    if (!name) return "";

    const words = name.trim().split(" ")

    if (words.length === 0) return "";
    if (words.length === 1) return words[0][0]?.toUpperCase() || "";
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(fullName);

  return (
    <Flex gap={20} vertical style={{ width: "auto", marginLeft: "15px" }} align="center">
      <Avatar
        src={telegramUser?.google?.profile?.picture || undefined}
        shape="square"
        size={100}
        icon={!telegramUser?.google?.profile?.picture ? initials : undefined}
        style={{ border: "2px solid #474787" }}
      />
      <Space style={{ width: "100%" }} direction="vertical" size={15}>
        {selectedUser?.internsDetails?.linkedinURL && selectedUser?.internsDetails?.githubURL &&
          <Card className="cardWidth custom-card">
            <Card.Meta
              avatar={
                <Flex
                  justify="center"
                  align="center"
                  style={{
                    fontSize: "25px",
                    width: "auto",
                    color: token.colorPrimary,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "26px" }}>
                    {
                      selectedUser?.internsDetails?.githubURL && <a href={selectedUser?.internsDetails?.githubURL} target="_blanck"><GithubOutlined style={{ color: token.colorPrimary }} /></a>
                    }
                    {
                      selectedUser?.internsDetails?.linkedinURL && <a href={selectedUser?.internsDetails?.linkedinURL} target="_blanck"><LinkedinOutlined style={{ color: token.colorPrimary }} /></a>
                    }
                  </div>
                </Flex>
              }
            />
          </Card>
        }
      </Space>
    </Flex>
  );
};

export default OtherLinks;
