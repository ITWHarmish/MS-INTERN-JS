import { Card, Col, Row } from 'antd'
import "./Team.css"
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useState } from 'react'

const data = [
    {
        name: "HARSH PATEL",
        role: "SENIOR NODEJS DEVELOPER",
        description: "We're giving interns the freedom to be creative with their tasks, and management the minimal amount of involvement needed to look like we know what's going on.",
        tag: "To the intern, for the intern, by the intern",
        image: "/avatar/harsh-img.png"
    },
    {
        name: "HARMISH PATEL",
        role: "SENIOR REACTJS DEVELOPER",
        description: "Beyond the surface, this project represents a deep-seated dedication to fostering a supportive and efficient environment for intern development and success. I am honored to contribute to this meaningful journey of empowering future leaders, and I believe its impact on their growth will resonate with you.",
        image: "/avatar/harmish-img.png"
    },
    {
        name: "VINAY SINGH",
        role: "FULL STACK DEVELOPER",
        description: "Full Stack Developer with hands-on experience in building web apps using React and Node.js. I focus on clean UI, smooth user experience, and smart backend logic",
        tag: "I speak fluent React, occasionally yell at bugs, and magically fix things by adding a console.log()... Full Stack Dev by title, bug hunter by hobby.",
        image: "/avatar/vinay-img.png"
    },
    {
        name: "BHAVESH TELI",
        role: "FULL STACK DEVELOPER",
        description: "Contributed to key features in MS-Intern (InternFlow), including task management, leave requests, HR policies, and role-based access control. Integrated Google APIs for enhanced functionality, developed seamless Telegram integrations for daily updates, and optimized admin features to improve workflow and user experience.",
        image: "/avatar/bhavesh-img.png"
    },
    {
        name: "PRINCE CHAVDA",
        role: "UI/UX DEVELOPER",
        description: "As a UI/UX developer, I designed the TimeLog system with a clean, intuitive interface that makes time tracking effortless. Focused on usability and simplicity, the UI helps users stay productive and organized with ease.",
        image: "/avatar/prince-img.png"
    },
    {
        name: "URJIT JARIWALA",
        role: "UI/UX DEVELOPER",
        description: "As a UI/UX mentor, I guided the design process of a time log system UI, executed by a budding designer under my supervision. The outcome showcases a clean, intuitive interface that highlights both creative effort and thoughtful mentorship.",
        image: "/avatar/urjit-img.png"
    },
]

const Team = () => {
    const [index, setIndex] = useState(0)
    const [isScrolling, setIsScrolling] = useState(false);

    const handlePrev = () => {
        setIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1))
    }

    const current = data[index]

    return (
        <>
            <div style={{ height: "calc(100vh - 130px)" }}>
                <div style={{ padding: "10px 0px 0px 20px" }}>
                    <Row>
                        <Col md={10}>
                            <Card
                                className='custom-card-team-intro'
                                style={{ height: "calc(100vh - 150px)", position: "relative", transition: "all 0.3s ease-in-out" }}
                                title={
                                    <div style={{ fontWeight: "bold", fontSize: "16px", letterSpacing: "1px" }}>
                                        <span style={{ marginLeft: "8px" }}>ABOUT US</span>
                                    </div>
                                }
                                extra={
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                        <LeftOutlined onClick={handlePrev} />
                                        <span style={{ color: "white" }}>0{index + 1}/0{data.length}</span>
                                        <RightOutlined onClick={handleNext} />
                                    </div>
                                }
                                onWheel={(e) => {
                                    if (isScrolling) return;

                                    setIsScrolling(true);
                                    if (e.deltaY > 0) {
                                        handleNext();
                                    } else {
                                        handlePrev();
                                    }

                                    setTimeout(() => {
                                        setIsScrolling(false);
                                    }, 600);
                                }}

                            >
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    height: "100%",
                                    padding: "20px 30px",
                                    transition: "all 0.3s ease-in-out"
                                }}>
                                    <div style={{ fontSize: "14px" }}>
                                        <img style={{ height: "30px" }} src="/avatar/Vector.png" alt="" />
                                        <img style={{ height: "30px" }} src="/avatar/Vector.png" alt="" />
                                        <p style={{ fontSize: "18px" }}>
                                            {current.description}
                                        </p>
                                        <p style={{ fontSize: "18px" }}>
                                            {current?.tag}
                                        </p>
                                    </div>

                                    <div style={{ position: "absolute", bottom: "0px" }}>
                                        <p style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "0px" }}>{current.name}</p>
                                        <p style={{ marginTop: "0px", marginBottom:"5px", fontSize: "16px" }}>{current.role}</p>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card
                                className='custom-card-team-profile'
                                style={{ height: "calc(100vh - 150px)", transition: "all 0.3s ease-in-out" }}
                                onWheel={(e) => {
                                    if (isScrolling) return;

                                    setIsScrolling(true);
                                    if (e.deltaY > 0) {
                                        handleNext();
                                    } else {
                                        handlePrev();
                                    }

                                    setTimeout(() => {
                                        setIsScrolling(false);
                                    }, 600);
                                }}

                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "flex-end",
                                        height: "calc(100vh - 150px)",
                                        paddingBottom: "20px",
                                        transition: "all 0.3s ease-in-out"
                                    }}
                                >
                                    <img
                                        style={{ height: "300px",  transition: "all 0.3s ease-in-out" }}
                                        src={current.image}
                                        alt="avatar"
                                    />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="team-overlay"></div>
        </>
    )
}

export default Team
