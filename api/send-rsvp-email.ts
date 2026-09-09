import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { generateRsvpEmailHtml } from '../src/lib/emailTemplate';

export async function sendRsvpEmailHandler(req: Request, res: Response) {
  try {
    const { guest, emailAddress } = req.body;

    if (!guest || !guest.fullName) {
      return res.status(400).json({ error: 'Missing guest details in request.' });
    }

    const recipient = emailAddress || guest.email;
    const PORT = 3000;
    const baseUrl = process.env.APP_URL || `http://localhost:${PORT}`;

    // Generate HTML email content with image assets
    const htmlContent = await generateRsvpEmailHtml(guest, baseUrl);

    let emailSent = false;
    let emailError: string | null = null;
    let serviceUsed = 'none';

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // Send via SMTP nodemailer if SMTP details provided
    if (recipient && smtpHost && smtpUser && smtpPass) {
      try {
        serviceUsed = 'SMTP';
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Venessa & Philemon Wedding" <${smtpUser}>`,
          to: recipient,
          subject: `✨ Official RSVP Confirmation & Wedding Pass for ${guest.fullName}`,
          html: htmlContent,
        });

        emailSent = true;
        emailError = null;
      } catch (err: any) {
        console.error('Failed to send email via SMTP transporter:', err);
        emailError = err?.message || 'SMTP delivery failed';
      }
    }

    let message = `RSVP Pass generated successfully!`;
    if (emailSent) {
      message = `Official RSVP Confirmation Email delivered to ${recipient}!`;
    }

    return res.json({
      success: true,
      emailSent,
      serviceUsed,
      emailError,
      recipient: recipient || null,
      message,
      previewHtml: htmlContent,
    });
  } catch (error: any) {
    console.error('Error handling send-rsvp-email endpoint:', error);
    return res.status(500).json({ error: 'Internal server error processing RSVP email.' });
  }
}
