export function makeDashboardRepository({ prisma }) {
  async function getOverview() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [total, thisMonth, lastMonth, byStatus, byCategory] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.inquiry.count({ where: { createdAt: { gte: lastMonthStart, lt: monthStart } } }),
      prisma.inquiry.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.inquiry.groupBy({ by: ["category"], _count: { id: true } }),
    ]);

    return { total, thisMonth, lastMonth, byStatus, byCategory };
  }

  // Raw query returns BigInt — convert to Number for JSON serialization
  async function getTrend() {
    const rows = await prisma.$queryRaw`
      SELECT DATE(created_at) AS date, COUNT(*)::int AS count
      FROM inquiries
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
    return rows.map((r) => ({ date: r.date.toISOString().slice(0, 10), count: Number(r.count) }));
  }

  async function getTopDomicili() {
    const rows = await prisma.inquiry.groupBy({
      by: ["domicile"],
      _count: { id: true },
      where: { domicile: { not: null } },
      orderBy: { _count: { id: "desc" } },
      take: 8,
    });
    return rows.map((r) => ({ domicile: r.domicile, count: r._count.id }));
  }

  async function getByPlatform() {
    const rows = await prisma.inquiry.groupBy({
      by: ["platform"],
      _count: { id: true },
      where: { category: "MCN_AGENCY", platform: { not: null } },
    });
    return rows.map((r) => ({ platform: r.platform, count: r._count.id }));
  }

  async function getByGmvRange() {
    const rows = await prisma.inquiry.groupBy({
      by: ["gmvRange"],
      _count: { id: true },
      where: { gmvRange: { not: null } },
      orderBy: { _count: { id: "desc" } },
    });
    return rows.map((r) => ({ gmvRange: r.gmvRange, count: r._count.id }));
  }

  return { getOverview, getTrend, getTopDomicili, getByPlatform, getByGmvRange };
}
