import crypto from "crypto";
import supabase from "../src/lib/supabaseConfig.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, householdId } = req.body;
    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save the token into the database
    const { error } = await supabase.from("household_invitations").insert([
      {
        household_id: householdId,
        token: token,
        expires_at: expiresAt.toISOString(),
        used: false,
      },
    ]);

    if (error) {
      console.error("Error saving token:", error);
      return res
        .status(500)
        .json({ error: "Failed to save invitation token." });
    }

    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;
    const basePath = `${protocol}://${host}`;
    const invitationLink = `${basePath}/invite/${token}`;

    return res.status(200).json({ link: invitationLink });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
