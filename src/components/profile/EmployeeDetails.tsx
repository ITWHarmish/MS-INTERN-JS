import {
  BankOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, DatePicker, Flex, Input, Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import dayjs from "dayjs";

const EmployeeDetails = ({ editMode, editedData, handleChange, handleDateChange }) => {
  const { user } = useSelector((state: RootState) => state.auth)

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
                  {
                    editMode
                      ? <Input
                        value={editedData?.fullName}
                        size="middle"
                        placeholder='Enter Full Name'
                        onChange={(e) => handleChange(e, "fullName")}
                      />
                      : user?.fullName ? user?.fullName : <span style={{ color: "gray" }}>"Enter your Full Name"</span>
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
                  {
                    editMode
                      ? <DatePicker
                        value={editedData?.dob ? dayjs(editedData.dob) : null}
                        size="middle"
                        onChange={(e) => handleDateChange(e, "dob")}
                      />
                      : user?.dob
                        ? dayjs(user.dob).format("DD MMM YYYY")
                        : "N/A"
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
                  {
                    editMode
                      ? <Input
                        value={editedData?.phoneNumber}
                        size="middle"
                        placeholder='Enter phoneNumber'
                        onChange={(e) => handleChange(e, "phoneNumber")}
                      />
                      : user?.phoneNumber
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
                      : user?.collegeName
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
                      : user?.address
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
