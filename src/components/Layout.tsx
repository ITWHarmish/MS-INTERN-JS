import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "./shared/Navbar"
import { Verify } from "../services/authAPI";
import { useEffect, useState } from "react";
import { setUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import Footer from "./shared/Footer";
import { useSelector } from "react-redux";
import { ConfigProvider, theme, Layout as Layouts } from "antd";
const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentTheme, setCurrentTheme] = useState("light")
  const lightTheme = {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: "#474787",
      borderRadius: 16,
      fontFamily: "Rubik",
      colorBgLayout: "White",
    },
  };
  const darkTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      borderRadius: 16,
      fontFamily: "Rubik",
      colorBgLayout: "black",
      colorPrimaryBg: "black",
    },
  }
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await Verify();
        dispatch(setUser(response));
      } catch (error) {
        console.error("Verification failed:", error);
        navigate("/login");
      }
    };
    verifyToken();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!user?.fullName) {
      navigate("/login");
    }
  }, [user, navigate])

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ConfigProvider
      theme={currentTheme === "light" ? lightTheme : darkTheme}
    >
      <Layouts style={{height:"100vh"}}>
        <Navbar onToggleTheme={toggleTheme} currentTheme={currentTheme} />
        <Outlet />
        <Footer />
      </Layouts>
    </ConfigProvider>
  )
}

export default Layout
