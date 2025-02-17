
import { tailChase } from 'ldrs'

tailChase.register()

const Spinner = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "65vh"}}>
            <l-tail-chase
                size="40"
                speed="1.75"
                color="#474787" 
            ></l-tail-chase>
        </div>
    )
}

export default Spinner
