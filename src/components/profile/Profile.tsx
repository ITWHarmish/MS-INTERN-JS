import { message, theme } from "antd";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { UpdateUserDetails } from "../../services/authAPI";
import { setUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  console.log("user:", user); // Log unused variable

  const navigate = useNavigate();
  console.log("navigate:", navigate); // Log unused variable

  const dispatch = useDispatch();
  console.log("dispatch:", dispatch); // Log unused variable

  const [loading, setLoading] = useState(true);
  console.log("loading:", loading); // Log unused variable

  const [editMode, setEditMode] = useState(false);
  console.log("editMode:", editMode); // Log unused variable
  const { token } = theme.useToken();
  console.log("token:", token); // Log unused variable

  const [editedData, setEditedData] = useState({
    fullName: user?.fullName || "",
    duration: user?.internsDetails?.duration || "",
    stream: user?.internsDetails?.stream || "",
    phoneNumber: user?.internsDetails?.phoneNumber || "",
    address: user?.internsDetails?.address || "",
    githubURL: user?.internsDetails?.githubURL || "",
    linkedinURL: user?.internsDetails?.linkedinURL || "",
    hrEmail: user?.hrEmail || "",
    hrFullName: user?.hrFullName || "",
    mentorEmail: user?.internshipDetails?.mentorEmail || "",
    mentorFullName: user?.internshipDetails?.mentorFullName || "",
    collegeName: user?.internsDetails?.collegeName || "",
    dob: user?.dob ? dayjs(user?.dob).format("YYYY-MM-DD") : "",
    joiningDate: user?.internshipDetails?.joiningDate ? dayjs(user?.internshipDetails?.joiningDate).format("YYYY-MM-DD") : "",
  });

  useEffect(() => {
    if (user) {
      setEditedData({
        fullName: user?.fullName || "",
        duration: user?.internsDetails?.duration || "",
        stream: user?.internsDetails?.stream || "",
        phoneNumber: user?.internsDetails?.phoneNumber || "",
        address: user?.internsDetails?.address || "",
        githubURL: user?.internsDetails?.githubURL || "",
        linkedinURL: user?.internsDetails?.linkedinURL || "",
        hrEmail: user?.hrEmail || "",
        hrFullName: user?.hrFullName || "",
        mentorEmail: user?.internshipDetails?.mentorEmail || "",
        mentorFullName: user?.internshipDetails?.mentorFullName || "",
        collegeName: user?.internsDetails?.collegeName || "",
        dob: user?.dob ? dayjs(user?.dob).format("YYYY-MM-DD") : "",
        joiningDate: user?.internshipDetails?.joiningDate ? dayjs(user?.internshipDetails?.joiningDate).format("YYYY-MM-DD") : "",
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      const response = await UpdateUserDetails(editedData);
      dispatch(setUser(response.user))
      message.success('Updated successful!');
      setEditMode(false);
    } catch (error) {
      message.error('Updation failed! Please try again.');
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };
  console.log("handleSave:", handleSave); // Log unused variable

  const handleChange = (e, field: string) => {
    setEditedData({
      ...editedData,
      [field]: e.target.value,
    });
  };

  console.log("handleChange", handleChange)

  const handleDateChange = (date: dayjs.Dayjs | null, field: string) => {
    setEditedData({
      ...editedData,
      [field]: date ? date.toISOString() : null,
    });
  };

  console.log("handleChange", handleDateChange)


  useEffect(() => {
    if (user) {
      if (user.internsDetails === undefined || user.internsDetails === "") {
        navigate("/fillUpForm");
      } else {
        navigate("/profile");
      }
    }
    setLoading(false);
  }, [user, navigate])

  return (
    <>
      <div className="image-container">
        <div className="overlay">
          kjdfhkj
        </div>

      </div>


    </>
  );
};

export default Profile;
