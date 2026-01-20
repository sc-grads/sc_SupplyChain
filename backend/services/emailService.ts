/**
 * Simple Email Service for the prototype.
 * In a real app, this would use Nodemailer, SendGrid, Amazon SES, etc.
 */

export async function sendEmail(to: string, subject: string, body: string) {
  console.log(`--- EMAIL SENT ---`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  console.log(`------------------`);

  // For the prototype, we log it. In a real scenario, we'd call an SMTP/API.
  return { success: true, messageId: `mock-${Date.now()}` };
}

export async function sendDelayNotificationEmail(
  orderNumber: string,
  revisedETA: string,
  reason: string,
) {
  const staticEmail = "mzu.nqwiliso@gmail.com";
  const subject = `⚠️ Delay Update: Order #${orderNumber}`;
  const body = `Hi,\n\nYour order #${orderNumber} has been delayed.\n\nRevised ETA: ${revisedETA}\nReason: ${reason}\n\nPlease check the dashboard for more details.`;

  return await sendEmail(staticEmail, subject, body);
}
