import { grid } from 'ldrs'
grid.register()

const Spinner = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "65vh" }}>
            <l-grid
                size="80"
                speed="1.5"
                color="#474787"
            ></l-grid>
        </div>
    )
}

export default Spinner
