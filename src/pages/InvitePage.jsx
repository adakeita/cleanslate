import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { joinHouseholdUsingToken } from "../lib/api";
import { UserDetailsContext } from "../contexts/UserDetailsContext";

function InvitePage() {
  const { token } = useParams();
  const [message, setMessage] = useState("Processing your invitation...");
  const { fetchAndSetUserDetails } = useContext(UserDetailsContext);

  const navigate = useNavigate();

  useEffect(() => {
    const processInvitation = async () => {
      if (!token) {
        setMessage("Invalid invitation link.");
        return;
      }

      try {
        const response = await joinHouseholdUsingToken(token);
        await fetchAndSetUserDetails();
        console.log("Invitation accepted:", response);
        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to accept invitation:", error);
        setMessage(
          "Failed to accept the invitation. It might be expired or invalid."
        );
      }
    };

    processInvitation();
  }, [token, navigate, fetchAndSetUserDetails]);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default InvitePage;
