import { useState, useContext } from "react";
import { UserDetailsContext } from "../../contexts/UserDetailsContext";
import "./inviteform.css";

const InviteForm = ({ onInviteSent }) => {
  const { userDetails } = useContext(UserDetailsContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMagicLinkEmail(email, link) {
    try {
      const response = await fetch("/api/sendMagicLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, link }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error details:", errorDetails);
        throw new Error(
          errorDetails.error || "Failed to send magic link email"
        );
      }

      // Assuming the server responds with JSON indicating success
      const data = await response.json();
      console.log("Magic link email sent response:", data);
    } catch (error) {
      console.error("Error sending magic link email:", error);
      throw error; // Re-throw to be caught in handleSendInvite
    }
  }

  const handleSendInvite = async () => {
    if (!userDetails?.household?.id) {
      setError("You must be part of a household to send an invite.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Call the generateToken function via API
      const generateTokenResponse = await fetch("/api/generateToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, // Assuming you want to send the email to the invitee
          householdId: userDetails.household.id,
        }),
      });

      if (!generateTokenResponse.ok) {
        const errorDetails = await generateTokenResponse.json();
        throw new Error(
          errorDetails.error || "Failed to generate invitation link"
        );
      }

      const { link } = await generateTokenResponse.json();

      // Use the returned link to send the email
      await sendMagicLinkEmail(email, link);
      console.log("Invite sent successfully");
      setLoading(false);
      onInviteSent?.(); // Call onInviteSent callback if provided
    } catch (error) {
      console.error("Invite sending error:", error);
      setError("Failed to send the invite. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="inviteformcontainer">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter invitee's email"
        disabled={loading}
      />
      <button onClick={handleSendInvite} disabled={loading}>
        Send Invite
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default InviteForm;
