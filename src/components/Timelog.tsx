import { Card, ConfigProvider, DatePicker } from 'antd'
import dayjs from 'dayjs'
import Tasktable from './Tasktable'

const Timelog = () => {
    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#c9194b',
                        borderRadius: 20,
                    },
                }}
            >
                <Card title={"Timelog"} extra={<DatePicker defaultValue={dayjs(Date.now())} />}>
                <Tasktable/>
                </Card>
            </ConfigProvider>
        </>
    )
}

export default Timelog
