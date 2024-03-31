import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { joinHouseholdUsingToken } from "../lib/api";

function InvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Processing your invitation...");

  useEffect(() => {
    const processInvitation = async () => {
      if (!token) {
        setMessage("Invalid invitation link.");
        return;
      }

      try {
        const response = await joinHouseholdUsingToken(token);
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
  }, [token, navigate]);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default InvitePage;
