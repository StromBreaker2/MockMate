import { jsPDF } from "jspdf";

export interface PDFReportData {
  candidateName: string;
  roleTitle: string;
  overallScore: number;
  technicalScore: number;
  behavioralScore: number;
  confidenceScore?: number;
  emotion?: string;
  gazeStability?: number;
  fillerWordsPerMin?: number;
  strengths: string[];
  improvements: string[];
  date?: string;
}

export const generateInterviewPDFReport = (data: PDFReportData): void => {
  const doc = new jsPDF();
  const dateStr = data.date || new Date().toLocaleDateString();

  // Header Banner
  doc.setFillColor(79, 70, 229); // Indigo
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("MockMate AI — Performance Report", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${dateStr} | BE Final Year Recruitment Platform`, 14, 28);

  // Candidate Details Card
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Candidate Profile & Session", 14, 48);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${data.candidateName}`, 14, 56);
  doc.text(`Target Role: ${data.roleTitle}`, 14, 63);

  // Score Highlights
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 70, 182, 36, 3, 3, "FD");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text(`Overall Score: ${data.overallScore}%`, 22, 85);

  doc.setTextColor(2, 132, 199);
  doc.text(`Technical: ${data.technicalScore}%`, 84, 85);

  doc.setTextColor(5, 150, 105);
  doc.text(`Behavioral: ${data.behavioralScore}%`, 142, 85);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("AI Benchmark", 22, 94);
  doc.text("Coding & DSA", 84, 94);
  doc.text("Soft Skills & Fluency", 142, 94);

  // Behavioral Telemetry Metrics
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Behavioral & Non-Verbal Telemetry", 14, 120);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`• Confidence Score: ${data.confidenceScore ?? 85}%`, 18, 128);
  doc.text(`• Predominant Emotion: ${data.emotion ?? "Confident & Focused"}`, 18, 135);
  doc.text(`• Gaze Stability & Eye Contact: ${data.gazeStability ?? 88}%`, 18, 142);
  doc.text(`• Filler Words Per Minute (FWPM): ${data.fillerWordsPerMin ?? 1.2}`, 18, 149);

  // Strengths
  let yOffset = 165;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129);
  doc.text("Key Strengths", 14, yOffset);
  yOffset += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  data.strengths.forEach((strength) => {
    doc.text(`✔  ${strength}`, 18, yOffset);
    yOffset += 7;
  });

  // Actionable Improvements
  yOffset += 8;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(245, 158, 11);
  doc.text("Actionable Improvements & AI Feedback", 14, yOffset);
  yOffset += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  data.improvements.forEach((imp) => {
    doc.text(`→  ${imp}`, 18, yOffset);
    yOffset += 7;
  });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("MockMate AI — Final Year BE Project • Production-Grade AI Recruitment Platform", 14, 285);

  // Trigger browser download
  const safeFilename = `${data.candidateName.toLowerCase().replace(/\s+/g, "_")}_interview_report.pdf`;
  doc.save(safeFilename);
};

export default generateInterviewPDFReport;
