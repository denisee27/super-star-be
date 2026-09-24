export function makeAdminRepository({ prisma }) {
  async function findByEmail(email) {
    return prisma.admin.findUnique({ where: { email } });
  }

  async function findById(id) {
    return prisma.admin.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true },
    });
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
    findByEmail,
    findById,
    createRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
    deleteAllRefreshTokensByAdmin,
  };
}
