import { UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Flex, Space, Typography } from 'antd'
import { RootState } from '../../redux/store'
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { IProfileHeaderProps } from '../../types/IProfile';
const ProfileTopBar = ({ editMode, setEditMode, handleSave }: IProfileHeaderProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showEditButton, setShowEditButton] = useState(false);
  const { telegramUser } = useSelector((state: RootState) => state.telegramAuth);
  useEffect(() => {
    if (user) {
        setShowEditButton(false);
    }
  }, [user])

  return (
    <>
      <Flex align="center" justify="space-between" style={{ padding: "15px 50px 20px 50px" }}>
        <Flex style={{ height: "100%" }} align="center" >
          <Avatar src={telegramUser?.google?.profile?.picture} size={35} icon={<UserOutlined />} style={{ marginRight: "10px" }} />
          <Space>
            <Space.Compact direction="vertical">
              <Typography.Text style={{ fontSize: "20px" }} strong>
                {user?.fullName}
              </Typography.Text>
            </Space.Compact>
          </Space>
        </Flex>
        {
          showEditButton &&
          <Button onClick={() => (editMode ? handleSave() : setEditMode(true))} type="primary">
            {editMode ? 'Save Profile' : 'Edit Profile'}
          </Button>
        }
      </Flex>

    </>
  )
}

export default ProfileTopBar
