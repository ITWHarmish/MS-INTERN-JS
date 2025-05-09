import { Typography } from "antd"
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Footer = () => {
    const footerRef = useRef(null);

    useEffect(() => {
        const animateNavbar = () => {
            const menuItems = document.querySelectorAll('#footer');

            if (menuItems.length > 0 && footerRef.current) {

                gsap.fromTo(
                    footerRef.current,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power2.out",
                    }
                );
            } else {
                requestAnimationFrame(animateNavbar);
            }
        };

        requestAnimationFrame(animateNavbar);
    }, []);

    return (
        <div id="footer" ref={footerRef}
            style={{
                borderTop: "1px solid #ffffffa1",
                width: "-webkit-fill-available",
                height: "65px",
                bottom: "0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "18px",
                marginLeft: "18px",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderTopRightRadius: "20px",
                borderTopLeftRadius: "20px",
            }}
        >
            <Typography.Text
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "15px",
                    color: "#49494B",
                }}
            >
                Toshal Management System ©{new Date().getFullYear()} Created By Toshal Infotech
            </Typography.Text>
        </div>
    )
}

export default Footer
