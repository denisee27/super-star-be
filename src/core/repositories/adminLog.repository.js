export function makeAdminLogRepository({ prisma }) {
  async function create({ adminId, action, resource, resourceId = null, detail, ipAddress = null }) {
    return prisma.adminLog.create({
      data: { adminId, action, resource, resourceId, detail, ipAddress },
    });
  }

  async function list({ page = 1, limit = 20, adminId, action, resource, search } = {}) {
    const where = {};
    if (adminId) where.adminId = adminId;
    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (search) {
      where.OR = [
        { detail: { contains: search, mode: "insensitive" } },
        { admin: { name: { contains: search, mode: "insensitive" } } },
        { admin: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [logs, total] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        include: { admin: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.adminLog.count({ where }),
    ]);

    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  return { create, list };
}
