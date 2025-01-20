import { UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Flex, Space, Typography } from 'antd'
import React from 'react'

const profileHeader = () => {
  return (
    <>
    <Flex align="center" justify="space-between" style={{padding:"15px 50px 20px 50px"}}>
          <Flex style={{ height: "100%" }} align="center" >
            <Avatar size={35} icon={<UserOutlined />} style={{marginRight:"10px"}} />
            <Space>
              <Space.Compact direction="vertical">
                <Typography.Text style={{ fontSize: "20px" }} strong>
                  Ujjval patel
                </Typography.Text>
              </Space.Compact>
            </Space>
          </Flex>
          <Button type="primary">Edit profile</Button>
        </Flex>
  
    </>
  )
}

export default profileHeader
