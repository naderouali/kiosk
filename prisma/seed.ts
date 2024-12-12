import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  
  try {

    // Check if users already exist
    const existingUsers = await prisma.user.count();
    if (existingUsers === 0) {
      await prisma.user.createMany({
        data: [
          { id: "1", firstName: "Jean-Marc", lastName: "Janco" },
          { id: "2", firstName: "Nader", lastName: "Ouali" },
        ],
        skipDuplicates: true,
      });
      console.log("Users added successfully");
    } else {
      console.log("Users already exist. Skipping user creation.");
    }

    // Check if tasks already exist
    const existingTasks = await prisma.task.count();
    if (existingTasks === 0) {
      await prisma.task.createMany({
        data: [
          {
            id: "1",
            title: "Prepare audit report",
            description: "Compile the 2023 sustainability audit report.",
            state: "TODO",
            ownerId: "1",
          },
          {
            id: "2",
            title: "Review audit checklist",
            description: "Go through the checklist for any missing details.",
            state: "DOING",
            ownerId: "2",
          },
          {
            id: "3",
            title: "Finalize client meeting",
            description: "Schedule and finalize details for the next client audit.",
            state: "DONE",
            ownerId: "1",
          },
        ],
        skipDuplicates: true,
      });
      console.log("Tasks added successfully");
    } else {
      console.log("Tasks already exist. Skipping task creation.");
    }
  } catch (error) {
    console.error("Error adding seed data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
