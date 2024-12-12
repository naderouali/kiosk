import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "../prisma.server";
import CreateTaskModal from "../components/Checklist/CreateTaskModal";
import { useState } from "react";
import type { Task } from "@prisma/client";
import "../styles/checklist.css";

// Action function to handle form submission
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const state = formData.get("state") as string;
  const ownerId = formData.get("ownerId") as string; // Ensure this is passed in the form

  // Validate required fields
  if (!title || !state || !ownerId) {
    throw new Error("Title, state, and owner are required.");
  }

  // Create the task
  await prisma.task.create({
    data: {
      title,
      description,
      state,
      owner: { connect: { id: ownerId } }, // Connects to the user by `id`
    },
  });

  return redirect("/checklist");
};

// Loader function to fetch tasks
export const loader: LoaderFunction = async () => {
  const tasks = await prisma.task.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      state: true,
    },
  });

  return tasks;
};

// Main component for the checklist page
export default function Checklist() {
  const tasks = useLoaderData<Task[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="checklist-container">
      <h1 className="checklist-title">Task Checklist</h1>
      <button className="create-task-btn" onClick={openModal}>
        + Create Task
      </button>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-details">
              <input
                type="checkbox"
                className="task-checkbox"
                defaultChecked={task.state === "DONE"}
              />
              <div>
                <p className="task-title">{task.title}</p>
                <p className="task-description">
                  {task.description || "No description provided"}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for creating a task */}
      <CreateTaskModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
