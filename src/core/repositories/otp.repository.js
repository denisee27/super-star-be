export function makeOtpRepository({ prisma }) {
  async function create({ phone, code, expiresAt }) {
    return prisma.otpCode.create({ data: { phone, code, expiresAt } });
  }

  async function findLatestByPhone(phone) {
    return prisma.otpCode.findFirst({
      where: { phone },
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

  async function countRecentByPhone(phone, windowMs) {
    const since = new Date(Date.now() - windowMs);
    return prisma.otpCode.count({ where: { phone, createdAt: { gte: since } } });
  }

  async function deleteExpired() {
    return prisma.otpCode.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  }

  return { create, findLatestByPhone, findById, markUsed, incrementAttempts, countRecentByPhone, deleteExpired };
}
