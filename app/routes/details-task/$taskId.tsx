import { LoaderFunction, ActionFunction, json, redirect } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
import { prisma } from "../../prisma.server";
import type { Task } from "@prisma/client";

export const loader: LoaderFunction = async ({ params }) => {
    const { taskId } = params;
  
    if (!taskId) {
      throw new Error("Task ID is required");
    }
  
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { 
        owner: true, // Fetch owner details 
        subtasks: true, // Fetch subtasks (if needed)
      },
    });
  
    if (!task) {
      throw new Error("Task not found");
    }
  
    return json(task);
  };

export const action: ActionFunction = async ({ request, params }) => {
  const taskId = params.taskId;
  const formData = await request.formData();
  const actionType = formData.get("_action") as string;

  if (actionType === "delete") {
    await prisma.task.delete({
      where: { id: taskId },
    });
    return redirect("/checklist");
  }

  return redirect(`/task/${taskId}`);
};

export default function TaskDetails() {
  const task = useLoaderData<Task>();

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Task Details</h1>
      <h2>{task.title}</h2>
      <p>{task.description || "No description provided."}</p>
      <p>
        <strong>Status:</strong> {task.state}
      </p>

      <h3>Owner</h3>
      <p>
        {task.owner.firstName} {task.owner.lastName}
      </p>

      {/* Subtasks Placeholder */}
      <h3>Subtasks</h3>
      <p>Coming Soon! Add functionality to manage subtasks here.</p>

      {/* Delete Task */}
      <Form method="post">
        <button type="submit" name="_action" value="delete">
          Delete Task
        </button>
      </Form>

      <Link to="/checklist">
        <button>Back to Checklist</button>
      </Link>
    </div>
  );
}
