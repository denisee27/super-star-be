export function makeOtpRepository({ prisma }) {
  async function create({ email, code, expiresAt }) {
    return prisma.otpCode.create({ data: { email, code, expiresAt } });
  }

  async function findLatestByEmail(email) {
    return prisma.otpCode.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });
  }

  async function findById(id) {
    return prisma.otpCode.findUnique({ where: { id } });
  }

  async function markUsed(id) {
    return prisma.otpCode.update({ where: { id }, data: { usedAt: new Date() } });
  }

  async function incrementAttempts(id) {
    return prisma.otpCode.update({ where: { id }, data: { attempts: { increment: 1 } } });
  }

  async function countRecentByEmail(email, windowMs) {
    const since = new Date(Date.now() - windowMs);
    return prisma.otpCode.count({ where: { email, createdAt: { gte: since } } });
  }

  async function deleteExpired() {
    return prisma.otpCode.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  }

  return { create, findLatestByEmail, findById, markUsed, incrementAttempts, countRecentByEmail, deleteExpired };
}
