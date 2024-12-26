import {  DashboardOutlined, DeleteOutlined, EditOutlined, FieldTimeOutlined, LeftOutlined, LogoutOutlined, PlayCircleOutlined,  UserOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Drawer, Input, Menu, Popover, Select, Table } from 'antd'
import { Avatar } from "antd";
import { DatePicker } from "antd";
import { TimePicker } from "antd";
// import "./App.css"
import "./index.css"
import { useState } from 'react';

// function App() {
//   return (
//     <>

//       <div style={{
//         display: "flex",
//         justifyContent: "space-between",
//         borderBottom: "1px solid #ccc",
//         boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.2)",
//         alignItems: "center"
//       }}>
//         <Menu style={{ display: "flex", gap: "3px" }}
//           mode='horizontal'
//           items={[
//             { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
//             { key: 'timelog', icon: <FieldTimeOutlined />, label: 'Timelog' },

//           ]}
//         ></Menu>
//         <div style={{ display: "flex", alignItems: "center", marginRight: "7px" }}>
//           <div style={{ display: "flex", gap: "15px", marginRight: "7px" }}>
//             <Button style={{ borderRadius: "80px" }} >Connect Google</Button>
//             <Button type='text' style={{ borderRadius: "80px" }} >Vinay Singh</Button>
//           </div>
//           <Avatar size="large" icon={<UserOutlined />} />
//         </div>
//       </div>

//       <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}} >
//         <div style={{ margin: "20px", fontSize: "30px", fontWeight: "bold" }}>
//           Timelog
//         </div>
//         <div style={{ display: "flex", gap: "15px", marginRight: "7px" }}>
//          <DatePicker></DatePicker>
//           <Button  style={{ borderRadius: "80px", backgroundColor:"#c9194b", color:"white" }} >Send Timelog</Button>
//         </div>
//       </div>
//         <div style={{ borderBottom: "1px solid #ccc",}} ></div>


//     </>

//   )
// }

// export default App

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(true)

  // Define columns
  const columns = [
    { title: "Start Time", dataIndex: "startTime", key: "startTime" },
    { title: "End Time", dataIndex: "endTime", key: "endTime" },
    { title: "Hours", dataIndex: "hours", key: "hours" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Description", dataIndex: "description", key: "description", width: 700 },
    {
      title: "Actions", dataIndex: "actions", key: "actions", render: (_, data) => (
        <div>
          {data ? (
            <>
              <div style={{ display: "flex", gap: "20px", cursor: "pointer" }} >
                <EditOutlined />
                <DeleteOutlined />
              </div>
            </>
          ) : (
            <span>No Data</span>
          )}
        </div>
      ),
    },
  ];

  // Empty data array
  const data = [
    {
      key: "1",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
      hours: 3,
      category: "Work",
      description: "Completed module 1",
      actions: <Button>Edit</Button>,
    },
    {
      key: "2",
      startTime: "01:00 PM",
      endTime: "02:00 PM",
      hours: 1,
      category: "Break",
      description: "Lunch break",
    },
    {
      key: "3",
      startTime: "02:00 PM",
      endTime: "05:00 PM",
      hours: 3,
      category: "Meeting",
      description: "Client discussion",
    },
  ];
  // const data:any = [];

  const { RangePicker } = TimePicker;
  const popoverContent = (
    <div>
      <Button type="text" icon={<LogoutOutlined />} style={{}}>
        Logout
      </Button>
    </div>
  );
  const [current, setCurrent] = useState("timelog"); // Set the default active key

  const onMenuClick = (e) => {
    setCurrent(e.key); // Update the active key on click
  };


  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: '#c9194b',
            borderRadius: 20,

          },

        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            padding: "0px 20px"
          }}
        >
          {/* <ConfigProvider
          theme={{
            token: {
              // Seed Token
              colorPrimary: '#c9194b',
              borderRadius: 20,
            },
          }}
        > */}
          <Menu
            onClick={onMenuClick}
            selectedKeys={[current]}
            style={{
              display: "flex",
              gap: "1px",
              // fontSize: "16px",
              // fontWeight: "500",
            }}

            mode="horizontal"
            items={[
              { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
              { key: "timelog", icon: <FieldTimeOutlined />, label: "Timelog" },
            ]}
          ></Menu>
          {/* </ConfigProvider> */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            {/* <ConfigProvider
            theme={{
              token: {
                // Seed Token
                colorPrimary: '#c9194b',
                borderRadius: 20,
              },
            }} */}
            {/* > */}
            <Button
              type="default">
              Connect Google
            </Button>
            {/* </ConfigProvider> */}

            {
              user ?
                <>
                  <Popover content={popoverContent} trigger="click">
                    <div style={{ display: "flex", alignItems: "center", gap: "0px", cursor: "pointer" }}>
                      {/* <ConfigProvider
                      theme={{
                        token: {
                          // Seed Token
                          colorPrimary: '#c9194b',
                          borderRadius: 20,
                        },
                      }}
                    > */}
                      <Button
                        type="text">
                        Vinay Singh
                      </Button>
                      <Avatar style={{ marginRight: "7px" }} size="large" icon={<UserOutlined />} />
                      {/* </ConfigProvider> */}
                    </div>
                  </Popover>
                </>
                :
                // <ConfigProvider
                //   theme={{
                //     token: {
                //       // Seed Token
                //       colorPrimary: '#c9194b',
                //       borderRadius: 20,
                //       margin: 20
                //     },
                //   }}
                // >
                <Button
                  type="default">
                  Connect Telegram
                </Button>
              // </ConfigProvider>

            }

          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: "600",
              color: "#333333",
            }}
          >
            Timelog
          </div>
          <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>

            <DatePicker></DatePicker>
            {/* </ConfigProvider> */}

            {/* <ConfigProvider
            theme={{
              token: {
                // Seed Token
                colorPrimary: '#c9194b',
                borderRadius: 20,
              },
            }}
          > */}
            <Button
              type="primary">
              Send Timelog
            </Button>
            {/* </ConfigProvider> */}
          </div>
        </div>
        <div
          style={{
            borderBottom: "1px solid #e0e0e0",
            margin: "0 20px",
          }}
        >
        </div>
        {/* <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: '#c9194b',
            borderRadius: 20,
          },
        }}
      > */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "20px",
          }}
        >
          {/* Time Range Picker */}
          <RangePicker
            format="HH:mm"
            style={{
              borderRadius: "20px",
              width: "200px",
            }}
          />

          {/* Category Dropdown */}
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  
                },
              },
            }}
          >
            <Select
              style={{
                // width: "150px",
              }}
              placeholder="Category"
              options={[
                { value: "work", label: "Work" },
                { value: "break", label: "Break" },
                { value: "meeting", label: "Meeting" },
              ]}
            />
          </ConfigProvider>


          {/* Description Input */}
          <Input
            placeholder="Description"
            style={{
              width: "400px",
            }}
          />

          <Button
            type="primary">
            Submit
          </Button>

          {/* Icon Button */}

          <Button
            icon={<PlayCircleOutlined />}
            type="primary">
          </Button>
        </div >
        {/* </ConfigProvider> */}

        <div style={{ padding: "20px" }}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false} // No pagination for now
            bordered
          />
        </div>

        {/* niche wala Duration */}
        <div style={{ maxHeight: "300px", }}>
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              borderRadius: '50%',
              backgroundColor: "#c9194b",
              color: "white"
            }}
            onClick={() => setDrawerOpen(true)}
          >

          </Button>

          {/* Drawer */}
          <div
            style={{ maxHeight: "300px", }}
            className="site-drawer-render-in-current-wrapper"
          >

            <Drawer
              title="Work Duration"
              placement="right"
              onClose={() => setDrawerOpen(false)}
              open={drawerOpen}
              style={{
                maxHeight: '300px', // Ensures the drawer height stays limited
              }}
            >
              <p>Total: 0</p>
              <p>Coding: 0</p>
              <p>hours: 0</p>
              <p>Learning: 0</p>
            </Drawer>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
}

export default App;

