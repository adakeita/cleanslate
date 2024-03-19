import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { validateInvitationToken } from "../lib/api";

const InvitePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Manually parse query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    if (!token) {
      // Handle missing token
      navigate("/");
      return;
    }

    validateInvitationToken(token)
      .then((response) => {
        navigate("/dashboard"); // or wherever you want to redirect after successful invitation acceptance
      })
      .catch((error) => {
        // Handle invalid or used token
        console.error("Invitation Error:", error);
        navigate("/"); // Redirect to home or error page
      });
  }, [navigate]);

  return <div>Processing your invitation...</div>;
};

export default InvitePage;
