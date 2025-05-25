// src/components/OAuth2Success.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OAuth2Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const res = await axios.get("/api/user/me"); 
        const user = res.data;

        if (user.status === "PENDING_APPROVAL") {
          navigate("/profile");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("OAuth2 success error:", error);
        navigate("/signin");
      }
    };

    checkApprovalStatus();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default OAuth2Success;
