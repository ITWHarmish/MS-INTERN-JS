import { Button, Flex, Space, Typography } from 'antd'
import { RootState } from '../../redux/store'
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { IProfileHeaderProps } from '../../types/IProfile';
const ProfileTopBar = ({ editMode, setEditMode, handleSave }: IProfileHeaderProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showEditButton, setShowEditButton] = useState(false);
  useEffect(() => {
    if (user) {
      setShowEditButton(false);
    }
  }, [user])

  return (
    <>
      <Flex align="center" justify="space-between" style={{ padding: "15px 50px 20px 50px" }}>
        <Flex style={{ height: "100%" }} align="center" >
          <Space>
            <Space.Compact direction="vertical">
              <Typography.Text style={{ fontSize: "20px" }} strong>
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
