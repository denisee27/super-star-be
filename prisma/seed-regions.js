import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROVINCES_URL = "https://raw.githubusercontent.com/guzfirdaus/Wilayah-Administrasi-Indonesia/master/csv/provinces.csv";
const REGENCIES_URL = "https://raw.githubusercontent.com/guzfirdaus/Wilayah-Administrasi-Indonesia/master/csv/regencies.csv";

async function parseCsv(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const text = await res.text();
  return text
    .trim()
    .split("\n")
    .slice(1) // skip header
    .map((line) => line.split(";").map((v) => v.trim().replace(/^"|"$/g, "")));
}

async function main() {
  console.log("Seeding provinces...");
  const provinces = await parseCsv(PROVINCES_URL);
  for (const [id, name] of provinces) {
    await prisma.province.upsert({ where: { id }, update: { name }, create: { id, name } });
  }
  console.log(`✓ Seeded ${provinces.length} provinces`);

  console.log("Seeding regencies...");
  const regencies = await parseCsv(REGENCIES_URL);
  for (const [id, provinceId, name] of regencies) {
    await prisma.regency.upsert({
      where: { id },
      update: { name, provinceId },
      create: { id, provinceId, name },
    });
  }
  console.log(`✓ Seeded ${regencies.length} regencies`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
