import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding PostgreSQL database...");

  // hash passswords
  const hashedPassword = await bcrypt.hash("password123", 10);

  // clear prev data
  await prisma.actionHistory.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // seed postgresql
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

  // take all users
  const createdUsers = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });
  // create companies
  const companies = await prisma.company.createMany({
    data: [
      {
        name: "Tech Solutions Inc.",
        service: "Software Development",
        capital: 5000000,
        status: "Active",
        logoUrl: null,
        userId: createdUsers[2].id, // assign to certain random person
      },
      {
        name: "NextGen Systems Corp.",
        service: "Cloud Services",
        capital: 7500000,
        status: "Active",
        logoUrl: null,
        userId: createdUsers[3].id,
      },
      {
        name: "Pioneer Ventures LLC",
        service: "Investment Management",
        capital: 12000000,
        status: "Active",
        logoUrl: null,
        userId: null, // no assignment
      },
      {
        name: "Strategic Alliances Corp.",
        service: "Strategic Planning",
        capital: 4200000,
        status: "Active",
        logoUrl: null,
        userId: null,
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${companies.count} companies`);

  // get created companies for history
  const createdCompanies = await prisma.company.findMany({
    orderBy: { createdAt: "asc" },
  });

  // mock history data
  const actionHistory = await prisma.actionHistory.createMany({
    data: [
      {
        action: "created",
        type: "company",
        details: "Created new company 'Tech Solutions Inc.'",
        target: "Tech Solutions Inc.",
        userId: createdUsers[0].id,
        companyId: createdCompanies[0].id,
      },
      {
        action: "updated",
        type: "profile",
        details: "Updated profile information",
        userId: createdUsers[2].id,
        companyId: null,
      },
      {
        action: "created",
        type: "user",
        details: "Created new user account",
        target: "emily.user@mycrm.com",
        userId: createdUsers[0].id,
        companyId: null,
      },
      {
        action: "updated",
        type: "company",
        details: "Updated company information",
        target: "NextGen Systems Corp.",
        userId: createdUsers[1].id,
        companyId: createdCompanies[1].id,
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
