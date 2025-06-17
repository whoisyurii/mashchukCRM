// Quick script to create SuperAdmin user
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    // First, check if superadmin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "superadmin@example.com" },
    });

    if (existingUser) {
      // Update existing user to SuperAdmin role
      const updatedUser = await prisma.user.update({
        where: { email: "superadmin@example.com" },
        data: { role: "SuperAdmin" },
      });

      // console.log(
      //   "✅ Updated user to SuperAdmin:",
      //   updatedUser.email,
      //   "- Role:",
      //   updatedUser.role
      // );
    } else {
      // Create new SuperAdmin user
      const hashedPassword = await bcrypt.hash("password123", 10);
      const newUser = await prisma.user.create({
        data: {
          email: "superadmin@example.com",
          password: hashedPassword,
          firstName: "Super",
          lastName: "Admin",
          role: "SuperAdmin",
        },
      });

      // console.log(
      //   "✅ Created SuperAdmin user:",
      //   newUser.email,
      //   "- Role:",
      //   newUser.role
      // );
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
