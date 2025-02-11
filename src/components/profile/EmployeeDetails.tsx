import {
  BankOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Flex, Input, Space, theme, Typography } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const EmployeeDetails = ({ editMode, editedData, handleChange }) => {
  const { user } = useSelector((state: RootState) => state.auth)
  const { token } = theme.useToken();
  return (
    <>
      <Space direction="vertical" size={15} style={{ width: "100%" }}>
        <Typography.Text strong style={{ color: token.colorPrimary, fontSize: "20px" }}>
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
                    color: token.colorPrimary,
                  }}
                >
                  <UserOutlined style={{ margin: "10px" }} />
                </Flex>
              }
              title={
                <Typography.Text style={{ fontSize: "12px", color: "grey"  }}>
                  Name
                </Typography.Text>
              }
              description={
                <Typography.Text strong style={{ fontSize: "16px" }}>
                  {
                    editMode
                      ? <Input
                        style={{}}
                        value={editedData?.fullName}
                        size="middle"
                        placeholder='Enter Full Name'
                        onChange={(e) => handleChange(e, "fullName")}
                      />
                      : user?.fullName
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
                  {user?.email}
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
                  {
                    editMode
                      ? <Input
                        value={editedData?.phoneNumber}
                        size="middle"
                        placeholder='Enter phoneNumber'
                        onChange={(e) => handleChange(e, "phoneNumber")}
                      />
                      : user?.internsDetails?.phoneNumber
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
                  <BankOutlined style={{ margin: "10px" }} />
                </Flex>
              }
              title={
                <Typography.Text style={{ fontSize: "12px", color: "grey" }}>
                  College Name
                </Typography.Text>
              }
              description={
                <Typography.Text strong style={{ fontSize: "16px" }}>
                  {
                    editMode
                      ? <Input
                        value={editedData?.collegeName}
                        size="middle"
                        placeholder='Enter address'
                        onChange={(e) => handleChange(e, "address")}
                      />
                      : user?.internsDetails?.collegeName
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
                  {
                    editMode
                      ? <Input
                        value={editedData?.address}
                        size="middle"
                        placeholder='Enter address'
                        onChange={(e) => handleChange(e, "address")}
                      />
                      : user?.internsDetails?.address
                  }
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
