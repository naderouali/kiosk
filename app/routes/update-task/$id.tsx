import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useFetcher } from "@remix-run/react";
import { prisma } from "../../prisma.server";
import type { Task } from "@prisma/client";
import "../../styles/modal.css"; // Optional: Reuse modal styles if needed

// Loader function to fetch task details by ID
export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;

  // Validate the ID
  if (!id) {
    throw new Error("Task ID is required.");
  }

  const task = await prisma.task.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      state: true,
    },
  });

  if (!task) {
    throw new Error(`Task with ID ${id} not found.`);
  }

  return json(task);
};

// Action function to handle task updates
export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  if (!id) {
    throw new Error("Task ID is required.");
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const state = formData.get("state") as string;

  // Validate required fields
  if (!title || !state) {
    throw new Error("Title and state are required.");
  }

  // Update the task
  await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      state,
    },
  });

  return redirect("/checklist");
};

// Component for viewing and editing a specific task
export default function TaskDetails() {
  const task = useLoaderData<Task>();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Update Task</h2>
        <Form method="post">
          <div>
            <label>Title</label>
            <input type="text" name="title" defaultValue={task.title} required />
          </div>
          <div>
            <label>Description</label>
            <textarea name="description" defaultValue={task.description || ""} />
          </div>
          <div>
            <label>State</label>
            <select name="state" defaultValue={task.state}>
              <option value="TODO">TODO</option>
              <option value="DOING">DOING</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => window.history.back()}>
            Cancel
          </button>
        </Form>
      </div>
    </div>
  );
}
