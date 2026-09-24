import { buildInquiryExcel } from "../../utils/excelBuilder.js";

export function makeExportService({ inquiryRepository }) {
  async function exportInquiries(filters) {
    const inquiries = await inquiryRepository.findAllForExport(filters);
    return buildInquiryExcel(inquiries);
  }

  return { exportInquiries };
}
