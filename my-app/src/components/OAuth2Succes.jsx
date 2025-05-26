import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OAuth2Success = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const res = await axios.get("/api/user/me", { withCredentials: true }); 
        const user = res.data;

        // Optional: store user in app state
        if (setUser) {
          setUser(user);
        }

        if (user.status === "PENDING_APPROVAL") {
          navigate("/profile");
        } else if (user.status === "APPROVED") {
          navigate("/");
        } else {
          navigate("/signin");
        }

      } catch (error) {
        console.error("OAuth2 success error:", error);
        navigate("/signin");
      }
    };

    checkApprovalStatus();
  }, [navigate, setUser]);

  return <div>Loading...</div>;
};

export default OAuth2Success;
