export function makeExportController({ exportService }) {
  async function exportInquiries(req, res, next) {
    try {
      const { category, status, search, startDate, endDate } = req.query;
      const buffer = await exportService.exportInquiries({ category, status, search, startDate, endDate });
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="superstar-inquiries-${date}.xlsx"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  return { exportInquiries };
}
