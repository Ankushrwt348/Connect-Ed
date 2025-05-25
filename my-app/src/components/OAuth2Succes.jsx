// src/components/OAuth2Success.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OAuth2Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const res = await axios.get("/api/user/me"); // Get current user
        const user = res.data;

        if (user.status === "PENDING_APPROVAL") {
          navigate("/profile");
        } else {
          navigate("/home"); // or wherever approved users go
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
