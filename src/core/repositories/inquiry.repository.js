// Parse date string as start/end of day in WIB (UTC+7) to avoid off-by-one day issues
function wibDayStart(dateStr) { return new Date(`${dateStr}T00:00:00.000+07:00`); }
function wibDayEnd(dateStr)   { return new Date(`${dateStr}T23:59:59.999+07:00`); }

function buildWhere({ category, status, search, startDate, endDate }) {
  const where = {};
  if (category) where.category = category;
  if (status)   where.status   = status;
  if (search) {
    where.OR = [
      { fullName:   { contains: search, mode: "insensitive" } },
      { brandName:  { contains: search, mode: "insensitive" } },
      { username:   { contains: search, mode: "insensitive" } },
      { picName:    { contains: search, mode: "insensitive" } },
      { email:      { contains: search, mode: "insensitive" } },
    ];
  }
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = wibDayStart(startDate);
    if (endDate)   where.createdAt.lte = wibDayEnd(endDate);
  }
  return where;
}

export function makeInquiryRepository({ prisma }) {
  async function create(data) {
    return prisma.inquiry.create({ data });
  }

  async function findAll({ category, status, search, startDate, endDate, page = 1, limit = 10 } = {}) {
    const where = buildWhere({ category, status, search, startDate, endDate });

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.inquiry.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.inquiry.count({ where }),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async function findById(id) {
    return prisma.inquiry.findUnique({ where: { id } });
  }

  async function findAllForExport({ category, status, search, startDate, endDate } = {}) {
    const where = buildWhere({ category, status, search, startDate, endDate });
    return prisma.inquiry.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async function update(id, data) {
    return prisma.inquiry.update({ where: { id }, data });
  }

  return { create, findAll, findById, findAllForExport, update };
}
