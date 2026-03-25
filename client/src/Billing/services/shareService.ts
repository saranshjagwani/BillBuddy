import { sharePDF } from "./pdfService";

export async function shareOnWhatsApp(filePath: string, billNo: string) {
  await sharePDF(filePath, billNo);
}

export async function downloadBill(filePath: string, billNo: string) {
  await sharePDF(filePath, billNo);
}