import {
  Input,
  Button,
  Modal,
  Form,
  Row,
  Col,
  message,
  Switch,
  Select,
} from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../../utils/Spinner";
import { UserRegister } from "../../services/authAPI";
import { RootState } from "../../redux/store";
import { IProfile } from "../../types/ILogin";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddIntern = ({ space, visible, onClose }) => {
  // const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: any) => {
      let payload: IProfile = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      };

      if (isAdmin) {
        payload.admin = true;
      } else {
        payload = {
          ...payload,
          spreadId: values.spreadId,
          spaceId: values.spaceId,
          mentorId: user._id,
        };
      }

      return await UserRegister(payload);
    },
    onSuccess: () => {
      message.success("Intern Added Successfully!");
      queryClient.invalidateQueries({ queryKey: ["interns"] });
      onClose();
    },
    onError: (error: any) => {
      console.error("Error While Adding Intern: ", error);
      message.error("Intern failed to add!");
    },
  });

  return (
    <Modal
      title={"Add Intern"}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={1000}
    >
      {isPending ? (
        <Spinner />
      ) : (
        <div style={{ padding: "20px" }}>
          <Form onFinish={mutate} layout="vertical">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[
                    { required: true, message: "Please Enter Full Name!" },
                  ]}
                >
                  <Input placeholder="Roman Reigns" />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password!" },
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>
                {!isAdmin && (
                  <Form.Item
                    label="Spread Id"
                    name="spreadId"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter the Spread Id!",
                      },
                    ]}
                  >
                    <Input placeholder="1608285224" />
                  </Form.Item>
                )}
                <Form.Item>
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "7px",
                      }}
                    >
                      <label>Admin</label>
                      <Switch
                        style={{ width: "20px" }}
                        checked={isAdmin}
                        onChange={setIsAdmin}
                      />
                    </div>
                  </>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="E-Mail"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input placeholder="E-Mail" />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirm Password" />
                </Form.Item>
                {!isAdmin && (
                  <Form.Item
                    label="Space Id"
                    name="spaceId"
                    rules={[
                      { required: true, message: "Please Enter the Space Id!" },
                    ]}
                  >
                    <Select showSearch placeholder="Select a space">
                      {space &&
                        space.map((item) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Form.Item>
              <div>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      )}
    </Modal>
  );
};

export default AddIntern;
