export function makeSettingRepository({ prisma }) {
  async function getByKey(key) {
    const row = await prisma.appSetting.findUnique({ where: { key } });
    return row?.value ?? null;
  }

  async function setByKey(key, value) {
    await prisma.appSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async function getAll() {
    const rows = await prisma.appSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  return { getByKey, setByKey, getAll };
}
