import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "./shared/Navbar"
import { GetCurrentUser } from "../services/authAPI";
import { useEffect, useState } from "react";
import { setUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import Footer from "./shared/Footer";
import { ConfigProvider, theme, Layout as Layouts } from "antd";
import Cookies from "js-cookie"
import Spinner from "../utils/Spinner";

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

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light")

  const token = Cookies.get("ms_intern_jwt");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const userInfo = await GetCurrentUser();
        dispatch(setUser(userInfo.user));

      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/login");
      }
    }
    fetchData();
    setLoading(false);
  }, [navigate, dispatch, token]);

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ConfigProvider
      theme={currentTheme === "light" ? lightTheme : darkTheme}
    >
      {loading ? <Spinner /> :
        <Layouts style={{ height: "" }}>
          <Navbar onToggleTheme={toggleTheme} currentTheme={currentTheme} />
          <Outlet />
          <Footer />
        </Layouts>
      }
    </ConfigProvider>
  )
}

export default Layout