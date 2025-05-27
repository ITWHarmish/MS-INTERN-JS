import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import { GetCurrentUser } from "../services/authAPI";
import { useEffect } from "react";
import { setUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import Footer from "./shared/Footer";
import { ConfigProvider, Layout as Layouts } from "antd";
import Cookies from "js-cookie";
import Spinner from "../utils/Spinner";
import { useQuery } from "@tanstack/react-query";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("ms_intern_jwt");

  // React Query hook to fetch user info
  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => GetCurrentUser(),
    enabled: !!token,
    retry: false,
  });

  // On successful data fetch, store user in Redux
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (data?.user) {
      dispatch(setUser(data.user));
    }

    if (isError) {
      console.error("Invalid token or fetch failed.");
      navigate("/login");
    }
  }, [token, data, isError, navigate, dispatch]);

  return (
    <ConfigProvider>
      {isLoading ? (
        <Spinner />
      ) : (
        <Layouts className="layout">
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Navbar />
            <Outlet />
            <Footer />
          </div>
        </Layouts>
      )}
    </ConfigProvider>
  );
};

export default Layout;
