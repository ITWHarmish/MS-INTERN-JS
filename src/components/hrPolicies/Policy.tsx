import { Button, Input, message, Modal } from "antd"
import Spinner from "../../utils/Spinner";
import { useEffect, useState } from "react";
import QuillEditor from "../../utils/QuillEditor";
import { CreatePolicy, UpdatePolicy } from "../../services/hrPolicyAPI";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchPolicies } from "../../redux/actions/hrPolicyActions";

const toolBarOptions = [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']
]

const Policy = ({ visible, onClose, isEditMode, policyData }) => {
    const [loading, setLoading] = useState(false);
    const [editedText, setEditedText] = useState("");
    const [policyTitle, setPolicyTitle] = useState("");
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (isEditMode && policyData) {
            setPolicyTitle(policyData.policyTitle);
            setEditedText(policyData.policyDescription);
        } else {
            setPolicyTitle("");
            setEditedText("");
        }
    }, [isEditMode, policyData]);

    const handleSubmit = async () => {
        if (!policyTitle || !editedText) {
            message.error("Policy Title and Description are required!");
            return;
        }
        setLoading(true);
        try {
            if (isEditMode && policyData) {
                const updatedValues = {
                    policyTitle,
                    policyDescription: editedText,
                };
                await UpdatePolicy(policyData._id, updatedValues);
                message.success("Policy Updated Successfully");
            }
            else {
                const values = {
                    policyTitle: policyTitle,
                    policyDescription: editedText,
                };
                await CreatePolicy(values);
                message.success("Policy Added Successfully")
            }
            dispatch(fetchPolicies());
            if (message.success) {
                setPolicyTitle("");
                setEditedText("");
                onClose();
            }
        } catch (error) {
            console.error("Error submitting policy:", error);
            message.error("Failed Add the Policy");
        } finally {
            setLoading(false)
        }
    };


    return (
        <>
            <Modal title={"Add Policies"} open={visible} onCancel={onClose} footer={null} centered width={1000}>
                {loading ? <Spinner /> :
                    <div style={{ padding: "20px" }}>
                        <div style={{ marginBottom: "7px" }} >
                            <label style={{color:"white"}}><span style={{ color: 'red' }}>*</span> Policy Title
                            </label><br />
                        </div>
                        <Input
                            style={{ marginBottom: "20px" }}
                            value={policyTitle}
                            onChange={(e) => {
                                setPolicyTitle(e.target.value)
                            }
                            }
                            placeholder="Enter Policy Title"
                        />
                        <div style={{ marginBottom: "7px" }} >
                            <label style={{color:"white"}}><span style={{ color: 'red' }}>*</span> Policy Description
                            </label><br />
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <QuillEditor
                                content={editedText}

                                onChange={(value) => {
                                    setEditedText(value)
                                }}
                                toolbarOptions={toolBarOptions}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button onClick={onClose} style={{ marginRight: "10px" }}>Cancel</Button>
                            <Button onClick={handleSubmit} type="primary" loading={loading} >
                                {isEditMode ? "Update Policy" : "Add Policy"}
                            </Button>
                        </div>
                    </div>
                }
            </Modal >
        </>
    )
}

export default Policy
