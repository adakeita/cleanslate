import { useState, useContext } from "react";
import { UserDetailsContext } from "../../contexts/UserDetailsContext";
import { generateMagicLink } from "../../lib/api";

const InviteForm = ({ onInviteSent }) => {
  const { userDetails } = useContext(UserDetailsContext); // Accessing context
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendInvite = async () => {
    if (!userDetails?.household?.householdId) {
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
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter invitee's email"
        disabled={loading}
      />
      <button onClick={handleInvite} disabled={loading}>
        Send Invite
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default InviteForm;
