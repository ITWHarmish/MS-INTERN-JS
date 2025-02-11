import { Modal } from "antd"

const ModalCard = ({ title, ModalOpen, setModalOpen, onOk }) => {

    const handleCancel = () => {
        setModalOpen(false);
    };

    return (
        <>
            <Modal
                style={{ fontWeight: "600" }}
                title={title}
                open={ModalOpen}
                onOk={onOk}
                onCancel={handleCancel}
                okText="Yes"
                cancelText="No"
                width={370}
            />
        </>
    )
}

export default ModalCard
