export function makeDashboardController({ dashboardService }) {
  async function getStats(req, res, next) {
    try {
      const stats = await dashboardService.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  return { getStats };
}
