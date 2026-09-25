import nodemailer from "nodemailer";
import { env } from "../../config/index.js";

let _transporter = null;

function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }
  return _transporter;
}

export async function sendEmail({ to, subject, html }) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Superstar Agency" <${env.SMTP_FROM}>`,
    to,
    subject,
    html,
  });
}
