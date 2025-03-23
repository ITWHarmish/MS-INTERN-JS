import { Button, Card, Steps, theme } from "antd"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

const ReportSubmitted = () => {
    const { Step } = Steps;
    const { token } = theme.useToken();
    const [currentStep, setCurrentStep] = useState(3);
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth)

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
        navigate("/report");
    }

    return (
        <>
            <div style={{ backgroundColor: token.colorBgLayout === "White" ? "#f0f2f5" : "#1a1c1f", marginBottom: "50px", height: "82vh" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", flexDirection: "column" }}>
                    <Steps current={currentStep} style={{ width: "80%", maxWidth: "800px", marginBottom: "20px" }}>
                        <Step title="Fill Details" />
                        <Step title="Add Tasks" />
                        {user?.admin &&
                            <Step title="Intern Evaluation" />
                        }
                        <Step title="Review & Submit" />
                    </Steps>
                    <Card
                        title="Interns Evaluation"
                        extra={
                            <Button onClick={() => handleNext()} type="primary" htmlType="submit">
                                Next
                            </Button>
                        }
                        style={{ width: "80%", maxWidth: "900px", padding: "24px", marginBottom: "40px" }}
                    >
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <p style={{ fontSize: "30px" }}>Report has been submitted successfully. 🎉</p>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default ReportSubmitted
