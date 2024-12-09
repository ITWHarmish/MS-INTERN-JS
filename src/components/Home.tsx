import Timelog from './Timelog'
import Tasktable from './Tasktable'
import "../index.css"
import { Card, ConfigProvider } from 'antd'
const Home = () => {
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
                        padding: "20px",
                    }}
                >
                    <Card>
                        <Timelog />
                        <Tasktable />
                    </Card>
                </div>
            </ConfigProvider>
        </>
    )
}

export default Home
