export function makeAdminRepository({ prisma }) {
  async function findByEmail(email) {
    return prisma.admin.findUnique({ where: { email } });
  }

  async function findById(id) {
    return prisma.admin.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  async function listAdmins({ page = 1, limit = 10, search } = {}) {
    const where = search
      ? { OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ] }
      : {};

    const [admins, total] = await Promise.all([
      prisma.admin.findMany({
        where,
        select: { id: true, email: true, name: true, role: true, createdAt: true },
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.admin.count({ where }),
    ]);

    return { admins, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  async function updateAdmin(id, { name, email, passwordHash }) {
    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (passwordHash !== undefined) data.password = passwordHash;
    return prisma.admin.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  async function createAdmin({ email, name, passwordHash }) {
    return prisma.admin.create({
      data: { email, name, password: passwordHash, role: "ADMIN" },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  async function deleteAdmin(id) {
    return prisma.admin.delete({ where: { id } });
  }

  async function createRefreshToken({ token, adminId, expiresAt }) {
    return prisma.refreshToken.create({ data: { token, adminId, expiresAt } });
  }

  async function findRefreshToken(token) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { admin: true },
    });
  }

  async function deleteRefreshToken(token) {
    return prisma.refreshToken.deleteMany({ where: { token } });
  }

  async function deleteAllRefreshTokensByAdmin(adminId) {
    return prisma.refreshToken.deleteMany({ where: { adminId } });
  }

  return {
    findByEmail, findById, listAdmins, updateAdmin, createAdmin, deleteAdmin,
    createRefreshToken, findRefreshToken, deleteRefreshToken, deleteAllRefreshTokensByAdmin,
  };
}
