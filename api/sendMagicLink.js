import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req, res) => {
  if (req.method === "POST") {
    const { email, link } = req.body;
    const msg = {
      to: email,
      from: "hello@adakeita.dev",
      subject: "Join My Household App",
      text: `You've been invited to join a household! Click here to join: ${link}`,
      html: `You've been invited to join a household! Click <a href="${link}">here</a> to join.`,
    };

    try {
      await sgMail.send(msg);
      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Email sending error:", error);
      if (error.response) {
        console.error(error.response.body);
      }
      return res.status(500).json({ error: "Failed to send email" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
