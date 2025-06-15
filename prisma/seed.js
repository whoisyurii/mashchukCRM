import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding PostgreSQL database...");

  // Захешируем пароль один раз для всех пользователей
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Очищаем существующие данные
  await prisma.actionHistory.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // Создаем пользователей (PostgreSQL поддерживает skipDuplicates)
  const users = await prisma.user.createMany({
    data: [
      {
        email: "admin@mycrm.com",
        password: hashedPassword,
        firstName: "John",
        lastName: "Doe",
        role: "SuperAdmin",
      },
      {
        email: "manager@mycrm.com",
        password: hashedPassword,
        firstName: "Jane",
        lastName: "Smith",
        role: "Admin",
      },
      {
        email: "user@mycrm.com",
        password: hashedPassword,
        firstName: "Bob",
        lastName: "Johnson",
        role: "User",
      },
      {
        email: "emily.user@mycrm.com",
        password: hashedPassword,
        firstName: "Emily",
        lastName: "Davis",
        role: "User",
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${users.count} users`);

  // Получаем созданных пользователей для связей
  const createdUsers = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });

  // Создаем компании
  const companies = await prisma.company.createMany({
    data: [
      {
        name: "Tech Solutions Inc.",
        service: "Software Development",
        capital: 5000000,
        status: "Active",
        userId: createdUsers[2].id, // Bob Johnson
      },
      {
        name: "NextGen Systems Corp.",
        service: "Cloud Services",
        capital: 7500000,
        status: "Active",
        userId: createdUsers[3].id, // Emily Davis
      },
      {
        name: "Pioneer Ventures LLC",
        service: "Investment Management",
        capital: 12000000,
        status: "Active",
        userId: null, // Не назначена
      },
      {
        name: "Strategic Alliances Corp.",
        service: "Strategic Planning",
        capital: 4200000,
        status: "Active",
        userId: null,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${companies.count} companies`);

  // Создаем историю действий
  const actionHistory = await prisma.actionHistory.createMany({
    data: [
      {
        action: "created",
        type: "company",
        details: "Created new company 'Tech Solutions Inc.'",
        target: "Tech Solutions Inc.",
        userId: createdUsers[0].id, // John Doe (SuperAdmin)
      },
      {
        action: "updated",
        type: "profile",
        details: "Updated profile information",
        userId: createdUsers[2].id, // Bob Johnson
      },
      {
        action: "created",
        type: "user",
        details: "Created new user account",
        target: "emily.user@mycrm.com",
        userId: createdUsers[0].id, // John Doe (SuperAdmin)
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${actionHistory.count} action history records`);
  console.log("🎉 PostgreSQL database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
