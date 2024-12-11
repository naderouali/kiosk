import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: "1" },
    });

    if (!existingUser) {
      // Add seed data
      await prisma.user.create({
        data: {
          id: "1",
          firstName: "Jean-Marc",
          lastName: "Janco",
        },
      });
      console.log("Seed data added successfully");
    } else {
      console.log("User with ID '1' already exists. Skipping insertion.");
    }
  } catch (error) {
    console.error("Error adding seed data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
