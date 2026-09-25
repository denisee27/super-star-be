function wibDayStart(dateStr) { return new Date(`${dateStr}T00:00:00.000+07:00`); }
function wibDayEnd(dateStr)   { return new Date(`${dateStr}T23:59:59.999+07:00`); }

function buildDateWhere(startDate, endDate) {
  if (!startDate && !endDate) return undefined;
  const range = {};
  if (startDate) range.gte = wibDayStart(startDate);
  if (endDate)   range.lte = wibDayEnd(endDate);
  return { createdAt: range };
}

export function makeDashboardRepository({ prisma }) {
  async function getOverview(startDate, endDate) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const dateWhere = buildDateWhere(startDate, endDate) ?? {};
    const hasFilter = !!(startDate || endDate);

    const [total, thisMonth, lastMonth, byStatus, byCategory] = await Promise.all([
      prisma.inquiry.count({ where: dateWhere }),
      // When filter active: thisMonth = same as total (whole filtered range)
      // When no filter: count only current calendar month
      hasFilter
        ? prisma.inquiry.count({ where: dateWhere })
        : prisma.inquiry.count({ where: { createdAt: { gte: monthStart } } }),
      // lastMonth always uses calendar month (for growth comparison without filter)
      prisma.inquiry.count({ where: { createdAt: { gte: lastMonthStart, lt: monthStart } } }),
      prisma.inquiry.groupBy({ by: ["status"], _count: { id: true }, where: dateWhere }),
      prisma.inquiry.groupBy({ by: ["category"], _count: { id: true }, where: dateWhere }),
    ]);

    return { total, thisMonth, lastMonth, byStatus, byCategory };
  }

  async function getTrend(startDate, endDate) {
    const start = startDate ? wibDayStart(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end   = endDate   ? wibDayEnd(endDate)     : new Date();
    const rows = await prisma.$queryRaw`
      SELECT DATE(created_at AT TIME ZONE 'Asia/Jakarta') AS date, COUNT(*)::int AS count
      FROM inquiries
      WHERE created_at >= ${start} AND created_at <= ${end}
      GROUP BY DATE(created_at AT TIME ZONE 'Asia/Jakarta')
      ORDER BY date ASC
    `;
    return rows.map((r) => ({ date: r.date.toISOString().slice(0, 10), count: Number(r.count) }));
  }

  async function getTopDomicili(startDate, endDate) {
    const dateWhere = buildDateWhere(startDate, endDate) ?? {};
    const rows = await prisma.inquiry.groupBy({
      by: ["domicile"],
      _count: { id: true },
      where: { ...dateWhere, domicile: { not: null } },
      orderBy: { _count: { id: "desc" } },
      take: 8,
    });
    return rows.map((r) => ({ domicile: r.domicile, count: r._count.id }));
  }

  async function getByPlatform(startDate, endDate) {
    const dateWhere = buildDateWhere(startDate, endDate) ?? {};
    const rows = await prisma.inquiry.groupBy({
      by: ["platform"],
      _count: { id: true },
      where: { ...dateWhere, category: "MCN_AGENCY", platform: { not: null } },
    });
    return rows.map((r) => ({ platform: r.platform, count: r._count.id }));
  }

  async function getByGmvRange(startDate, endDate) {
    const dateWhere = buildDateWhere(startDate, endDate) ?? {};
    const rows = await prisma.inquiry.groupBy({
      by: ["gmvRange"],
      _count: { id: true },
      where: { ...dateWhere, gmvRange: { not: null } },
      orderBy: { _count: { id: "desc" } },
    });
    return rows.map((r) => ({ gmvRange: r.gmvRange, count: r._count.id }));
  }

  return { getOverview, getTrend, getTopDomicili, getByPlatform, getByGmvRange };
}
