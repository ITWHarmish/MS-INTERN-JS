import { Card, DatePicker } from 'antd'
import dayjs from 'dayjs'
import Tasktable from './Tasktable'

const Timelog = () => {
    return (
        <>
            <Card title={"Timelog"} extra={<DatePicker defaultValue={dayjs(Date.now())} />}>
                <Tasktable />
            </Card>
        </>
    )
}

export default Timelog
