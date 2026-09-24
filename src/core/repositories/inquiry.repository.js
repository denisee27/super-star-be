export function makeInquiryRepository({ prisma }) {
  async function create(data) {
    return prisma.inquiry.create({ data });
  }

  async function findAll({ category, status, search, startDate, endDate, page = 1, limit = 10 } = {}) {
    const where = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { brandName: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }

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
    const where = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { brandName: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }
    return prisma.inquiry.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async function update(id, data) {
    return prisma.inquiry.update({ where: { id }, data });
  }

  return { create, findAll, findById, findAllForExport, update };
}
