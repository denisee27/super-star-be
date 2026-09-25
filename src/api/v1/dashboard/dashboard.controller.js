export function makeDashboardController({ dashboardService }) {
  async function getStats(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const stats = await dashboardService.getDashboardStats({ startDate, endDate });
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  return { getStats };
}
