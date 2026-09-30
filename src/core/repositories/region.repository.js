export function makeRegionRepository({ prisma }) {
  async function findAllProvinces() {
    return prisma.province.findMany({ orderBy: { name: "asc" } });
  }

  async function findRegenciesByProvince(provinceId) {
    return prisma.regency.findMany({ where: { provinceId }, orderBy: { name: "asc" } });
  }

  return { findAllProvinces, findRegenciesByProvince };
}
