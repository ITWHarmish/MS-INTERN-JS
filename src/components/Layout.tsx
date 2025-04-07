import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import { GetCurrentUser } from "../services/authAPI";
import { useEffect, useState } from "react";
import { setUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import Footer from "./shared/Footer";
import { ConfigProvider, Layout as Layouts } from "antd";
import Cookies from "js-cookie";
import Spinner from "../utils/Spinner";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

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
    };
    fetchData();
    setLoading(false);
  }, [navigate, dispatch, token]);

  return (
    <ConfigProvider>
      {loading ? (
        <Spinner />
      ) : (
        // <Layouts className="layout">
        //   <Navbar />
        //   <Outlet />
        //   <Footer />
        // </Layouts>
        <div className="video-layout">
          <video autoPlay loop muted playsInline className="bg-video"
            ref={(videoRef) => {
              if (videoRef) videoRef.playbackRate = 0.5; // 0.5 means 50% speed
            }}
          >
            {/* <source src="/Gen-3.mp4" type="video/mp4" /> */}
          </video>

          <div className="content-over-video">
            <Layouts className="layout">
              <Navbar />
              <Outlet />
              <Footer />
            </Layouts>
          </div>
        </div>
      )}
    </ConfigProvider>
  );
};

export default Layout;
