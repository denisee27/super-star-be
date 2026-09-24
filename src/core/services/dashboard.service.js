const CATEGORY_LABEL = { MCN_AGENCY: "MCN Agency", PASUKAN_AFFILIATE: "Pasukan Affiliate", BRAND_SELLER: "Brand/Seller" };
const STATUS_LABEL = { NEW: "Baru", CONTACTED: "Dihubungi", QUALIFIED: "Qualified", REJECTED: "Ditolak" };
const PLATFORM_LABEL = { TIKTOK_SHOP: "TikTok Shop", SHOPEE: "Shopee" };

export function makeDashboardService({ dashboardRepository }) {
  async function getDashboardStats() {
    const [overview, trend, topDomicili, byPlatform, byGmvRange] = await Promise.all([
      dashboardRepository.getOverview(),
      dashboardRepository.getTrend(),
      dashboardRepository.getTopDomicili(),
      dashboardRepository.getByPlatform(),
      dashboardRepository.getByGmvRange(),
    ]);

    const qualified = overview.byStatus.find((s) => s.status === "QUALIFIED")?._count.id ?? 0;
    const newCount = overview.byStatus.find((s) => s.status === "NEW")?._count.id ?? 0;

    return {
      overview: {
        total: overview.total,
        thisMonth: overview.thisMonth,
        lastMonth: overview.lastMonth,
        newCount,
        qualified,
      },
      byCategory: overview.byCategory.map((r) => ({
        name: CATEGORY_LABEL[r.category] ?? r.category,
        value: r._count.id,
        key: r.category,
      })),
      byStatus: overview.byStatus.map((r) => ({
        name: STATUS_LABEL[r.status] ?? r.status,
        value: r._count.id,
        key: r.status,
      })),
      trend,
      topDomicili,
      byPlatform: byPlatform.map((r) => ({
        name: PLATFORM_LABEL[r.platform] ?? r.platform,
        value: r.count,
      })),
      byGmvRange,
    };
  }

  return { getDashboardStats };
}
