import { dotWave } from 'ldrs'
dotWave.register()

const Spinner = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "65vh" }}>
            <l-dot-wave
                size="60"
                speed="2"
                color="#fff"
            ></l-dot-wave>
        </div>
    )
}

export default Spinner