import { useState, useContext } from "react";
import { UserDetailsContext } from "../../contexts/UserDetailsContext";
import { generateMagicLink } from "../../lib/api";
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
      const link = await generateMagicLink(userDetails.household.id); // Ensure correct property access
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
