import { LoaderFunction, ActionFunction, json } from "@remix-run/node";
import { prisma } from "../prisma.server";

// Loader to fetch subtasks for a specific task
export const loader: LoaderFunction = async ({ params }) => {
  const { taskId } = params;

  if (!taskId) {
    throw new Response("Task ID is required", { status: 400 });
  }

  const taskWithSubtasks = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      subtasks: true,
    },
  });

  if (!taskWithSubtasks) {
    throw new Response("Task not found", { status: 404 });
  }

  return json({ subtasks: taskWithSubtasks.subtasks });
};

// Action to handle CRUD operations for subtasks
export const action: ActionFunction = async ({ request, params }) => {
  const { taskId } = params;
  const formData = await request.formData();
  const actionType = formData.get("_action") as string;

  if (!taskId) {
    return json({ error: "Task ID is required" }, { status: 400 });
  }

  if (actionType === "create") {
    const text = formData.get("text") as string;

    if (!text) {
      return json({ error: "Subtask text is required" }, { status: 400 });
    }

    const newSubtask = await prisma.subTask.create({
      data: {
        text,
        taskId,
      },
    });
    return json(newSubtask);
  } else if (actionType === "toggle") {
    const subTaskId = formData.get("subTaskId") as string;

    if (!subTaskId) {
      return json({ error: "Subtask ID is required" }, { status: 400 });
    }

    const subtask = await prisma.subTask.findUnique({ where: { id: subTaskId } });

    if (!subtask) {
      return json({ error: "Subtask not found" }, { status: 404 });
    }

    const updatedSubtask = await prisma.subTask.update({
      where: { id: subTaskId },
      data: {
        state: subtask.state === "TODO" ? "DONE" : "TODO",
      },
    });

    return json(updatedSubtask);
  }

  return json({ error: "Invalid action" }, { status: 400 });
};
