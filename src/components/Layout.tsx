import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "./shared/Navbar"
import { Verify } from "../services/authAPI";
import { useEffect } from "react";
import { setUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import Footer from "./shared/Footer";
import { useSelector } from "react-redux";
const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
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


  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout
