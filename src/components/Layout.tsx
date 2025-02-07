import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "./shared/Navbar"
import { Verify } from "../services/authAPI";
import { useEffect } from "react";
import { setUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import Footer from "./shared/Footer";
const Layout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
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

    return (
        <div>
            <Navbar />
            <Outlet />
            <Footer/>
        </div>
    )
}

export default Layout
