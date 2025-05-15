import "./ProgressReportPdf.css"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetProgressReport } from "../../services/progressReportAPI";
import Spinner from "../../utils/Spinner";
import dayjs from "dayjs";
import { Button } from "antd";

const ProgressReportPDF = () => {
    const { reportId } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return dayjs(dateString).format("DD/MM/YYYY");
    };

    const getRegularityLabel = (percentage) => {
        if (!percentage) return "";
        const numericValue = parseFloat(percentage);
        if (numericValue == 100) return `${percentage}% (Excellent)`;
        if (numericValue >= 70) return `${percentage}% (Good)`;
        if (numericValue >= 50) return `${percentage}% (Average)`;
        return `${percentage}% (Poor)`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await GetProgressReport(reportId);
                setData(res)
            } catch (error) {
                console.error("Error fetching progress report:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [reportId])

    const externalGuideRemarks = Array.from({ length: 4 }, (_, index) => data?.externalGuideRemarks[index] || "");
    const internalGuideRemarks = Array.from({ length: 4 }, () => "");

    const tasksHtml = [];
    const taskCount = data?.tasks?.length || 0;
    for (let i = 0; i < 7; i++) {
        if (i < taskCount) {
            const task = data?.tasks[i];
            tasksHtml.push(
                <tr key={task._id}>
                    <td>{task?.taskDescription}</td>
                    <td>{formatDate(task?.assignedDate)}</td>
                    <td>{formatDate(task?.expectedCompletionDate)}</td>
                    <td>{formatDate(task?.actualCompletionDate)}</td>
                </tr>
            );
        } else {
            tasksHtml.push(
                <tr key={`empty-${i}`}>
                    <td>&nbsp;</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            );
        }
    }

    const strikeThroughOptions = (selected) => {
        const options = ["good", "average", "poor"];
        return options.map((option, index) => (
            <span
                key={index}
                className={option === selected ? "selected-option" : "strike-through"}
            >
                <span style={{ marginRight: "3px" }}>{option}</span>
                {index !== options.length - 1 && "/"}
            </span>
        ));
    };

    return (
        loading ? <Spinner /> :
            <div className="ScrollInProgress" style={{ height: "100vh", overflow: "auto" }}>
                <div style={{ marginBottom: "25px", padding: "120px" }} className="report">
                    <Button
                        id="pdf-button"
                        type="primary"
                        onClick={() => window.print()}
                        style={{
                            position: "absolute",
                            right: "15px",
                            top: "15px",
                        }}
                    >
                        Download PDF
                    </Button>
                    <div style={{ width: "43rem" }}>
                        <div className="section name">
                            <div className="name"><span>Student Name:</span> {data?.studentName}</div>
                        </div>
                        <div className="section">
                            <div className="company"><span>Company Name:</span> Toshal Infotech</div>
                        </div>
                        <div className="section">
                            <div className="company">
                                <span>Enrollment No.:</span> {data?.enrollmentNo}
                                <span style={{ marginLeft: "40px" }}>Class:</span> {data?.course}
                                <span style={{ marginLeft: "40px" }}>Div:</span> {data?.division}
                            </div>
                            <span style={{ marginBottom: "14px" }}>Project Title:</span> {data?.projectTitle}
                        </div>
                        <div className="section">
                            <span>Duration:</span> <span>From:</span> {formatDate(data?.duration?.from)}
                            <span style={{ marginLeft: "150px" }}>To:</span> {formatDate(data?.duration?.to)}
                        </div>

                        <table className="table">
                            <thead className="table-thead">
                                <tr>
                                    <th>Task Assigned</th>
                                    <th>Date Assigned</th>
                                    <th>Expected date of completion</th>
                                    <th>Actual date of completion</th>
                                </tr>
                            </thead>
                            <tbody className="table-tbody">
                                {tasksHtml}
                            </tbody>
                        </table>

                        <div className="section single-line">
                            <div style={{ display: "flex", justifyContent: "center", gap: "3px" }} className="regular">
                                <span>Regularity:</span>
                                <span style={{ width: "max-content" }} className="blank-remarks">{getRegularityLabel(data?.selfEvaluation?.regularity)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0px", marginLeft: "18px" }} className="regular">
                                <span style={{ marginRight: "3px" }}>Punctuality:</span> {strikeThroughOptions(data?.selfEvaluation?.punctuality)}
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0px", marginLeft: "20px" }} className="regular">
                                <span style={{ marginRight: "3px" }}>Discipline:</span> {strikeThroughOptions(data?.selfEvaluation?.discipline)}
                            </div>
                        </div>

                        <div className="section">
                            <span>Learning Ability:</span> {strikeThroughOptions(data?.selfEvaluation?.learningAbility)}
                            <span style={{ marginLeft: "118px" }}>Implementation Ability:</span> {strikeThroughOptions(data?.selfEvaluation?.implementationAbility)}
                        </div>

                        <div>
                            <div className="remark">Remark by External Guide:</div>
                            {externalGuideRemarks.map((text, index) => (
                                <div key={index} className="line">
                                    {index + 1}.
                                    <div className="blank-remarks">{text}</div>
                                </div>
                            ))}
                        </div>

                        <div className="signatures">
                            <div>Student Sign: _____________</div>
                            <div>External Guide Sign: _____________</div>
                            <div>Date: _____________</div>
                        </div>

                        <div>
                            <div className="remark">Remark by Internal Guide:</div>
                            {internalGuideRemarks.map((text, index) => (
                                <div key={index} className="line">
                                    {index + 1}.
                                    <div className="blank-remarks">{text}</div>
                                </div>
                            ))}
                        </div>

                        <div className="signatures">
                            <div>Student Sign: _____________</div>
                            <div>Internal Guide Sign: _____________</div>
                            <div>Date: _____________</div>
                        </div>

                        <div className="hr-signature">
                            <span className="hr">HR Executive</span>
                            <span className="hr_name">Riddhi Jariwala</span>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default ProgressReportPDF;
