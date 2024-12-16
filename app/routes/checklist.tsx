import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { prisma } from "../prisma.server";
import CreateTaskModal from "../components/Checklist/CreateTaskModal";
import UpdateTaskModal from "../components/Checklist/UpdateTaskModal";
import SubtasksModal from "../components/Checklist/SubTasksModal";
import { useState, useEffect, useRef } from "react";
import type { Task } from "@prisma/client";
import Sortable, { SortableEvent } from "sortablejs";
import "../styles/checklist.css";

interface TaskWithSubtasks extends Task {
  subtasks?: { id: string; text: string; state: "TODO" | "DONE" }[];
  owner?: {
    firstName: string;
    lastName: string;
  };
}

export const loader: LoaderFunction = async () => {
  const tasks = await prisma.task.findMany({
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      state: true,
      order: true,
      createdAt: true,
      updatedAt: true,
      ownerId: true,
      owner: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      subtasks: {
        select: {
          id: true,
          text: true,
          state: true,
        },
      },
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


  if (actionType === "reorder") {
    const orderedIds = JSON.parse(formData.get("orderedIds") as string);
    try {
      await Promise.all(
        orderedIds.map((id: string, index: number) =>
          prisma.task.update({
            where: { id },
            data: { order: index },
          })
        )
      );
      return json({ success: true });
    } catch (error) {
      return json({ error: "Failed to reorder tasks" }, { status: 400 });
    }
  }

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

  const tasksFromLoader = useLoaderData<TaskWithSubtasks[]>();
  const [tasks, setTasks] = useState<TaskWithSubtasks[]>(tasksFromLoader);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSubtasksModalOpen, setIsSubtasksModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithSubtasks | null>(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchOwner, setSearchOwner] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  const sortableListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setTasks(
      tasksFromLoader.filter((task) => {
        const ownerName = `${task.owner?.firstName || ""} ${task.owner?.lastName || ""}`.toLowerCase();
        const matchesFilters = filters.length === 0 || filters.includes(task.state);
        return (
          task.title?.toLowerCase().includes(searchTitle.toLowerCase()) &&
          ownerName.includes(searchOwner.toLowerCase()) &&
          matchesFilters
        );
      })
    );
  }, [searchTitle, searchOwner, tasksFromLoader, filters]);

  useEffect(() => {
    if (sortableListRef.current) {
      const sortable = Sortable.create(sortableListRef.current, {
        animation: 150,
        onEnd: async (evt: SortableEvent) => {
          const newOrder = [...tasks];
          const [movedTask] = newOrder.splice(evt.oldIndex!, 1);
          newOrder.splice(evt.newIndex!, 0, movedTask);
  
          setTasks(newOrder);
  
          const response = await fetch(`/checklist`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              _action: "reorder",
              orderedIds: JSON.stringify(newOrder.map((task) => task.id)),
            }),
          });
  
          if (!response.ok) {
            console.error("Failed to save task order:", response.statusText);
          }
        },
      });
  
      return () => {
        sortable.destroy();
      };
    }
  }, [tasks]);


  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openUpdateModal = (task: TaskWithSubtasks) => {
    setSelectedTask(task);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedTask(null);
    setIsUpdateModalOpen(false);
  };

  const openSubtasksModal = (task: TaskWithSubtasks) => {
    setSelectedTask(task);
    setIsSubtasksModalOpen(true);
  };

  const closeSubtasksModal = () => {
    setSelectedTask(null);
    setIsSubtasksModalOpen(false);
  };

  const handleTaskUpdate = (updatedTask: TaskWithSubtasks) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
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
        const error = await response.json();
        console.error("Failed to delete task:", error.error);
        alert(`Error: ${error.error}`); 
      }
    } catch (error) {
      console.error("Error while deleting task:", error);
      alert("An unexpected error occurred while deleting the task.");
    }
  };

  const handleCheckboxChange = async (task: TaskWithSubtasks) => {
    const updatedState = task.state === "DONE" ? "TODO" : "DONE";

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

  const handleToggleState = async (taskId: string, subtaskId: string) => {
    try {
      const response = await fetch(`/tasks/${taskId}/subtasks`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          _action: "toggle",
          subTaskId: subtaskId,
        }),
      });

      if (!response.ok) {
        console.error("Error toggling subtask state:", await response.text());
        return;
      }

      const updatedSubtask = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id !== taskId) return task;

          return {
            ...task,
            subtasks: task.subtasks?.map((subtask) =>
              subtask.id === updatedSubtask.id ? updatedSubtask : subtask
            ),
          };
        })
      );
    } catch (error) {
      console.error("Error while toggling subtask state:", error);
    }
  };

  
  return (
    <div className="checklist-container">
      <h1 className="checklist-title">Task Checklist</h1>

      <button className="create-task-btn" onClick={openCreateModal}>
        + Create New Task
      </button>

      <div className="filters">
        <div className="srch">
          <input
            type="text"
            placeholder="Search by title or content..."
            className="search-box"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search by owner..."
            className="search-box"
            value={searchOwner}
            onChange={(e) => setSearchOwner(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          {["TODO", "DOING", "DONE"].map((state) => (
            <button
              key={state}
              className={`filter-btn ${filters.includes(state) ? "active" : ""}`}
              onClick={() => {
                setFilters((prev) =>
                  prev.includes(state)
                    ? prev.filter((s) => s !== state)
                    : [...prev, state]
                );
              }}
            >
              {state} {filters.includes(state) && "✔"}
            </button>
          ))}
        </div>
      </div>

      <ul ref={sortableListRef} className="task-list"> 
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${task.state === "DONE" ? "task-done" : ""}`}
          >
            <div className="task-items-big">
              <div className="task-left">
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.state === "DONE"}
                  onChange={() => handleCheckboxChange(task)}
                />
              </div>

              <div
                className="task-content"
                onClick={() => openUpdateModal(task)} 
              >
                <p className="task-title">{task.title}</p>
                <div className={`task-state ${task.state.toLowerCase()}`}>{task.state}</div>
                <p className="task-description">
                  {task.description || "No description provided"}
                </p>
                <p className="task-owner">
                  <small>
                    {task.owner
                      ? `Owner: ${task.owner.firstName} ${task.owner.lastName}`
                      : "Owner: Unknown"}
                  </small>
                </p>
              </div>

              <div className="task-actions">
                <button
                  className="open-subtasks-btn"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    openSubtasksModal(task);
                  }}
                >
                  Add Subtasks
                </button>
                <button
                  className="delete-task-btn"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleTaskDelete(task.id);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Subtasks Display */}
            {task.subtasks && task.subtasks.length > 0 && (
              <details className="subtasks-details">
                <summary>Subtasks ({task.subtasks.length})</summary>
                <ul className="subtask-list">
                  {task.subtasks.map((subtask) => (
                    <li
                      key={subtask.id}
                      className={`subtask-item ${
                        subtask.state === "DONE" ? "subtask-done" : ""
                      }`}
                    >
                      <span
                        className={`subtask-text ${
                          subtask.state === "DONE" ? "subtask-done-text" : ""
                        }`}
                      >
                        {subtask.text}
                      </span>
                      <button
                        onClick={() => handleToggleState(task.id, subtask.id)}
                        className={`toggle-state-btn ${
                          subtask.state === "DONE" ? "btn-undone" : "btn-done"
                        }`}
                      >
                        Mark as {subtask.state === "TODO" ? "DONE" : "TODO"}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            )}
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
