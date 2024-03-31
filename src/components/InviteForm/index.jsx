import { useState, useContext } from "react";
import { UserDetailsContext } from "../../contexts/UserDetailsContext";
import { generateMagicLink } from "../../lib/api";
import "./inviteform.css";

const InviteForm = ({ onInviteSent }) => {
  const { userDetails } = useContext(UserDetailsContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [householdId, setHouseholdId] = useState("");

  async function sendMagicLinkEmail(email, link) {
    const response = await fetch("/api/sendMagicLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, link }),
    });

    if (!response.ok) {
      throw new Error("Failed to send magic link email");
    }
  }

  const handleSendInvite = async () => {
    if (!userDetails?.household?.id) {
      setError("You must be part of a household to send an invite.");
      return;
    }
    setLoading(true);
    try {
      setLoading(true);
      const link = await generateMagicLink(userDetails.household.householdId);
      await sendMagicLinkEmail(email, link);
      onInviteSent();
      setLoading(false);
    } catch (error) {
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
      {error && <p>{error}</p>}
    </div>
  );
};

export default InviteForm;
