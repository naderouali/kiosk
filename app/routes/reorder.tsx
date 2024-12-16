// import { ActionFunction } from "@remix-run/node";
// import { json } from "@remix-run/node";
// import { prisma } from "../prisma.server";

// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();
//   const orderedIds = JSON.parse(formData.get("orderedIds") as string);

//   try {
//     // Update database records based on orderedIds
//     await Promise.all(
//       orderedIds.map((id: string, index: number) =>
//         prisma.task.update({
//           where: { id },
//           data: { order: index }, // Ensure the 'order' field exists in your database
//         })
//       )
//     );
//     return json({ success: true });
//   } catch (error) {
//     return json({ error: "Failed to reorder tasks" }, { status: 400 });
//   }
// };

// export default function () {
//   return null; // This route is just an API endpoint, so it doesn't render anything
// }
