import nodemailer from "nodemailer";
import { Resend } from "resend";

const DEFAULT_NOTIFY_EMAIL = "minjizhao6@gmail.com";

export type InquiryEmailPayload = {
  name: string;
  phone: string;
  contactType: string;
  email: string;
  message: string;
};

function parseNotifyRecipients(): string[] {
  const raw = process.env.INQUIRY_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY_EMAIL;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailBodies(data: InquiryEmailPayload): { subject: string; text: string; html: string } {
  const subject = `New Hikuada inquiry — ${data.name}`;
  const text = [
    "You have a new website inquiry.",
    "",
    `Name: ${data.name}`,
    `Customer email: ${data.email}`,
    `Preferred contact: ${data.contactType}`,
    `WhatsApp / Zalo: ${data.phone}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html><body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.5;color:#0f172a">
  <h2 style="margin:0 0 12px;font-size:18px">New inquiry — Hikuada.com</h2>
  <table style="border-collapse:collapse;font-size:14px">
    <tr><td style="padding:4px 12px 4px 0;color:#64748b">Name</td><td>${escapeHtml(data.name)}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#64748b">Email</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#64748b">Contact via</td><td>${escapeHtml(data.contactType)}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#64748b">WhatsApp / Zalo</td><td>${escapeHtml(data.phone)}</td></tr>
  </table>
  <p style="margin:16px 0 6px;font-size:13px;color:#64748b">Message</p>
  <pre style="margin:0;padding:12px;background:#f1f5f9;border-radius:8px;white-space:pre-wrap;font-size:13px">${escapeHtml(
    data.message,
  )}</pre>
</body></html>`.trim();

  return { subject, text, html };
}

async function sendViaResend(to: string[], data: InquiryEmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from =
    process.env.RESEND_FROM?.trim() || "Hikuada Website <onboarding@resend.dev>";
  const { subject, text, html } = buildEmailBodies(data);

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("[inquiries] Resend failed:", error);
  }
}

async function sendViaSmtp(to: string[], data: InquiryEmailPayload): Promise<void> {
  const host = process.env.SMTP_HOST!.trim();
  const user = process.env.SMTP_USER!.trim();
  const pass = process.env.SMTP_PASS!.trim();
  const port = Number(process.env.SMTP_PORT?.trim() || "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const from = process.env.SMTP_FROM?.trim() || user;
  const { subject, text, html } = buildEmailBodies(data);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: to.join(", "),
    replyTo: data.email,
    subject,
    text,
    html,
  });
}

/**
 * Sends a notification when a new inquiry is stored. Does not throw — logs on failure.
 * Configure either `RESEND_API_KEY` (and ideally `RESEND_FROM` with a verified domain),
 * or `SMTP_HOST` + `SMTP_USER` + `SMTP_PASS` (+ optional `SMTP_PORT`, `SMTP_FROM`).
 * Recipients: `INQUIRY_NOTIFY_EMAIL` (comma-separated), default minjizhao6@gmail.com.
 */
export async function notifyNewInquiryEmail(data: InquiryEmailPayload): Promise<void> {
  const to = parseNotifyRecipients();
  if (to.length === 0) {
    console.warn("[inquiries] No valid INQUIRY_NOTIFY_EMAIL recipients; skipping notification.");
    return;
  }

  try {
    if (process.env.RESEND_API_KEY?.trim()) {
      await sendViaResend(to, data);
      return;
    }

    if (
      process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim()
    ) {
      await sendViaSmtp(to, data);
      return;
    }

    console.warn(
      "[inquiries] Set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS to enable inquiry notification emails.",
    );
  } catch (err) {
    console.error("[inquiries] Notification email failed:", err);
  }
}
