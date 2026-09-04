import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface SendReportEmailParams {
  to: string;
  candidateName: string;
  roleTitle: string;
  overallScore: number;
  technicalScore: number;
  behavioralScore: number;
  strengths: string[];
  improvements: string[];
}

export const sendInterviewReportEmail = async (params: SendReportEmailParams): Promise<{ sent: boolean; message: string }> => {
  const { to, candidateName, roleTitle, overallScore, technicalScore, behavioralScore, strengths, improvements } = params;

  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailFrom = process.env.EMAIL_FROM || "no-reply@mockmate.ai";

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 20px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">MockMate AI Interview Report</h1>
        <p style="color: #64748b; margin: 4px 0 0;">Performance Evaluation & AI Insights</p>
      </div>

      <p style="font-size: 16px; color: #1e293b;">Hello <strong>${candidateName}</strong>,</p>
      <p style="font-size: 14px; color: #475569;">Here is your comprehensive AI-evaluated performance summary for the <strong>${roleTitle}</strong> mock interview session.</p>

      <div style="display: flex; justify-content: space-around; background: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="margin: 0 10px;">
          <div style="font-size: 26px; font-weight: bold; color: #4f46e5;">${overallScore}%</div>
          <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">Overall Score</div>
        </div>
        <div style="margin: 0 10px;">
          <div style="font-size: 26px; font-weight: bold; color: #0284c7;">${technicalScore}%</div>
          <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">Technical</div>
        </div>
        <div style="margin: 0 10px;">
          <div style="font-size: 26px; font-weight: bold; color: #059669;">${behavioralScore}%</div>
          <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">Behavioral</div>
        </div>
      </div>

      <h3 style="color: #0f172a; border-left: 4px solid #10b981; padding-left: 8px; font-size: 16px;">Key Strengths</h3>
      <ul style="color: #334155; font-size: 14px; line-height: 1.6;">
        ${strengths.map((s) => `<li>${s}</li>`).join("")}
      </ul>

      <h3 style="color: #0f172a; border-left: 4px solid #f59e0b; padding-left: 8px; font-size: 16px;">Actionable Improvements</h3>
      <ul style="color: #334155; font-size: 14px; line-height: 1.6;">
        ${improvements.map((i) => `<li>${i}</li>`).join("")}
      </ul>

      <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
        <p>MockMate AI — Final Year B.E. Advanced Recruitment Platform</p>
      </div>
    </div>
  `;

  if (!smtpUser || !smtpPass) {
    console.log(`ℹ️ SMTP credentials not configured. Mock report generated successfully for ${to}`);
    console.log(`[Email Preview to ${to}]: Overall ${overallScore}%, Role: ${roleTitle}`);
    return {
      sent: true,
      message: `Report generated successfully. SMTP not configured; preview logged to server console for ${to}.`,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"MockMate AI" <${emailFrom}>`,
      to,
      subject: `MockMate AI Interview Performance Report — ${roleTitle}`,
      html: emailHtml,
    });

    return { sent: true, message: `Performance report successfully emailed to ${to}` };
  } catch (error) {
    console.error("Failed to send email via SMTP:", error);
    return { sent: false, message: (error as Error).message };
  }
};
