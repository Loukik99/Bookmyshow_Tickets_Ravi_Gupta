import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadTicketPdf(ticketElement, ticketId, customerName) {
  const canvas = await html2canvas(ticketElement, {
    scale: 3,
    backgroundColor: "#0f0f1a",
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const imgW = canvas.width;
  const imgH = canvas.height;

  // A4 landscape-ish: fit ticket centered on A4
  const pdf = new jsPDF("landscape", "mm", "a4");
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // Scale image to fit page with padding
  const padding = 20;
  const maxW = pageW - padding * 2;
  const maxH = pageH - padding * 2;
  const ratio = Math.min(maxW / imgW, maxH / imgH);
  const drawW = imgW * ratio;
  const drawH = imgH * ratio;
  const x = (pageW - drawW) / 2;
  const y = (pageH - drawH) / 2;

  // Dark background
  pdf.setFillColor(15, 15, 26);
  pdf.rect(0, 0, pageW, pageH, "F");

  pdf.addImage(imgData, "PNG", x, y, drawW, drawH);

  const safeName = customerName.replace(/\s+/g, "_").toLowerCase();
  pdf.save(`${ticketId}_${safeName}.pdf`);
}
