import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { prisma } from "../prisma.server";
import CreateTaskModal from "../components/Checklist/CreateTaskModal";
import UpdateTaskModal from "../components/Checklist/UpdateTaskModal";
import SubtasksModal from "../components/Checklist/SubTasksModal";
import { useState } from "react";
import type { Task } from "@prisma/client";
import "../styles/checklist.css";

export const loader: LoaderFunction = async () => {
  const tasks = await prisma.task.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      state: true,
      createdAt: true,
      updatedAt: true,
      ownerId: true,
    },
  });

  return json(tasks);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("_action") as string;
  const id = formData.get("id") as string | null;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const state = formData.get("state") as string;
  const ownerId = formData.get("ownerId") as string;

  if (actionType === "delete" && id) {
    try {
      await prisma.task.delete({
        where: { id },
      });
      return json({ success: true });
    } catch (error) {
      return json({ error: "Failed to delete task" }, { status: 400 });
    }
  }

  if (actionType === "create") {
    if (!ownerId) {
      return json({ error: "Owner ID is required" }, { status: 400 });
    }
    try {
      const newTask = await prisma.task.create({
        data: {
          title,
          description,
          state,
          owner: { connect: { id: ownerId } },
        },
      });
      return json(newTask);
    } catch (error) {
      return json({ error: "Failed to create task" }, { status: 400 });
    }
  } else if (actionType === "update" && id) {
    try {
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          title,
          description,
          state,
        },
      });
      return json(updatedTask);
    } catch (error) {
      return json({ error: "Failed to update task" }, { status: 400 });
    }
  }

  return redirect("/checklist");
};

export default function Checklist() {
  const tasksFromLoader = useLoaderData<Task[]>();
  const [tasks, setTasks] = useState<Task[]>(tasksFromLoader);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSubtasksModalOpen, setIsSubtasksModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openUpdateModal = (task: Task) => {
    setSelectedTask(task);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedTask(null);
    setIsUpdateModalOpen(false);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const openSubtasksModal = (task: Task) => {
    setSelectedTask(task);
    setIsSubtasksModalOpen(true);
  };

  const closeSubtasksModal = () => {
    setSelectedTask(null);
    setIsSubtasksModalOpen(false);
  };

  const handleTaskDelete = async (id: string) => {
    try {
      const response = await fetch(`/checklist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          _action: "delete",
          id,
        }),
      });

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error while deleting task:", error);
    }
  };

  const handleCheckboxChange = async (task: Task) => {
    const updatedState = task.state === "DONE" ? "PENDING" : "DONE";

    const updatedTask = { ...task, state: updatedState };
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
    );

    await fetch(`/checklist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        _action: "update",
        id: task.id,
        title: task.title,
        description: task.description || "",
        state: updatedState,
      }),
    });
  };

  return (
    <div className="checklist-container">
      <h1 className="checklist-title">Task Checklist</h1>

      <button className="create-task-btn" onClick={openCreateModal}>
        + Create Task
      </button>

      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${task.state === "DONE" ? "task-done" : ""}`}
          >
            <div className="task-left">
              <input
                type="checkbox"
                className="task-checkbox"
                checked={task.state === "DONE"}
                onChange={() => handleCheckboxChange(task)}
              />
            </div>

            <button
              className="task-clickable-area"
              onClick={() => openUpdateModal(task)}
            >
              <p className="task-title">{task.title}</p>
              <p className="task-description">
                {task.description || "No description provided"}
              </p>
            </button>

            <button
              className="open-subtasks-btn"
              onClick={() => openSubtasksModal(task)} // Open SubtasksModal
            >
              Open Subtasks
            </button>

            <button
              className="delete-task-btn"
              onClick={() => handleTaskDelete(task.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <CreateTaskModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />

      {selectedTask && (
        <UpdateTaskModal
          isOpen={isUpdateModalOpen}
          onClose={closeUpdateModal}
          task={selectedTask}
          onTaskUpdate={handleTaskUpdate}
        />
      )}

      <SubtasksModal
        isOpen={isSubtasksModalOpen}
        onClose={closeSubtasksModal}
        task={selectedTask}
      />
    </div>
  );
}
