export function makeEventRepository({ prisma }) {
  async function create({ name, platform, accountLink, startsAt, expiresAt, isActive = true }) {
    return prisma.event.create({
      data: { name, platform, accountLink: accountLink || null, startsAt: new Date(startsAt), expiresAt: new Date(expiresAt), isActive },
    });
  }

  async function findAll() {
    return prisma.event.findMany({ orderBy: { createdAt: "desc" } });
  }

  async function findActive() {
    const now = new Date();
    return prisma.event.findMany({
      where: { isActive: true, startsAt: { lte: now }, expiresAt: { gt: now } },
      orderBy: { startsAt: "asc" },
    });
  }

  async function findById(id) {
    return prisma.event.findUnique({ where: { id } });
  }

  async function update(id, data) {
    const payload = { ...data };
    if (payload.startsAt) payload.startsAt = new Date(payload.startsAt);
    if (payload.expiresAt) payload.expiresAt = new Date(payload.expiresAt);
    return prisma.event.update({ where: { id }, data: payload });
  }

  async function remove(id) {
    return prisma.event.delete({ where: { id } });
  }

  return { create, findAll, findActive, findById, update, remove };
}
