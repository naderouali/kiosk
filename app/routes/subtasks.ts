// import { ActionFunction } from "@remix-run/node";
// import { prisma } from "../prisma.server";

// // Action to handle POST requests for subtasks
// export const action: ActionFunction = async ({ request, params }) => {
//   const { taskId } = params;

//   if (!taskId) {
//     return new Response("Task ID is required", { status: 400 });
//   }

//   const formData = await request.formData();
//   const actionType = formData.get("_action");
//   const text = formData.get("text")?.toString();

//   if (actionType === "create" && text) {
//     await prisma.subTask.create({
//       data: {
//         text,
//         taskId,
//       },
//     });
//     return new Response("Subtask created", { status: 201 });
//   }

//   return new Response("Invalid request", { status: 400 });
// };
