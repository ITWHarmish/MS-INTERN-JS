import { Button, Card, Col, Row, Steps } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

const ReportSubmitted = () => {
  const { Step } = Steps;
  const [currentStep, setCurrentStep] = useState(3);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    navigate("/report");
  };

  return (
    <>
      <div style={{ height: "calc(100vh - 130px)", padding: "20px" }}>
        <Row gutter={6} style={{ height: "calc(100vh - 130px)" }}>
          <Col>
            <Steps
              direction="vertical"
              current={currentStep}
              style={{
                height: "calc(100vh - 160px)",
                background: "rgba(255, 255, 255, 0.5)",
                borderRadius: "30px",
              }}
            >
              <Step />
              <Step />
              {user?.admin && <Step />}
              <Step />
            </Steps>
          </Col>
          <Col>
            <Card
              title="REPORT SUBMIT"
              style={{
                width: "calc(100vw - 400px)",
                height: "calc(100vh - 160px)",
              }}
              extra={
                <Button onClick={() => handleNext()} type="primary">
                  NEXT
                </Button>
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <p style={{ fontSize: "30px", margin: 0 }}>
                  REPORT HAS BEEN SUBMITTED SUCCESSFULLY.
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="report-overlay"></div>
    </>
  );
};

export default ReportSubmitted;
