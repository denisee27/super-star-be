import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123#", 10);
  await prisma.admin.upsert({
    where: { email: "admin@superstar.com" },
    update: {},
    create: {
      email: "admin@superstar.com",
      password: hashedPassword,
      name: "Admin Superstar",
    },
  });
  console.log("Seed completed: admin@superstar.com / admin123#");

  // Upsert default app settings
  await prisma.appSetting.upsert({
    where: { key: "bd_wa_number" },
    update: {},
    create: { key: "bd_wa_number", value: "" },
  });
  await prisma.appSetting.upsert({
    where: { key: "bd_wa_message_template" },
    update: {},
    create: {
      key: "bd_wa_message_template",
      value: "Halo, Aku {nama} dari {brand}. Aku perlu tanya perihal service dari MCN Superstar Agency.",
    },
  });
  console.log("Settings seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
