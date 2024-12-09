import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Card, Col, ConfigProvider, Row, Space } from "antd"
// import {} from "react-beautiful-dnd"

const Dashboard = () => {
  return (
    <>
      <div style={{ padding: "20px" }}>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token
              colorPrimary: '#c9194b',
              borderRadius: 20,
              margin: 20,
              // colorError: "#c9194b",
            },
          }}
        >
          <Card title="Card title" extra={<Button type="primary">Send todos on chat</Button>}  >

            <div style={{ display: "flex", gap: "20px" }}>
              {/* <Card type="inner" >
                In Progress
              </Card> */}

              {/* <DragDropContext> */}

              <Card
                style={{ flex: 1 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  In Progress
                  <ConfigProvider
                    theme={{
                      token: {
                        // Seed Token
                        colorPrimary: '#c9194b',
                        borderRadius: 10,
                      },
                    }}
                  >
                    <span style={{}}>
                      <Button type="primary" icon={<PlusOutlined />}></Button>
                    </span>
                  </ConfigProvider>
                </div>
                <Card
                  type="inner"
                  style={{ marginBottom: 16 }}

                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap:"15px" }} >
                    <div>
                      <div>Making Dashboard Desgin</div>
                      <div style={{ fontSize: "12px", color: "#888" }}>Vinay Singh</div>
                    </div>
                    <Button
                      size="small"
                      shape="circle"
                      // type="primary"
                      icon={<DeleteOutlined />}
                      danger
                    />

                  </div>

                </Card>

              </Card>

              <Card style={{ flex: 1 }}>
                Done
              </Card>
            </div>
          </Card >
        </ConfigProvider >
      </div >
    </>
  )
}

export default Dashboard
