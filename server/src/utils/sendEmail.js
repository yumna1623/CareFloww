import transporter from "../config/mail.js";

export const sendEmail = async ({ to, subject, text, html }) => {
  console.log("============= EMAIL DEBUG =============");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("User:", process.env.EMAIL_USER);
  console.log("Pass Exists:", !!process.env.EMAIL_PASS);

  try {
    await transporter.verify();
    console.log("Transport verified successfully.");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.log("EMAIL ERROR:");
    console.log(err);
    throw err;
  }
};