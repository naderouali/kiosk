import React, { useState, useEffect } from "react";
import type { Task } from "@prisma/client";

interface SubtasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

interface Subtask {
  id: string;
  text: string;
  state: "TODO" | "DONE";
}

export default function SubtasksModal({ isOpen, onClose, task }: SubtasksModalProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtaskText, setSubtaskText] = useState("");

  useEffect(() => {
    const fetchSubtasks = async () => {
      if (task) {
        try {
          const response = await fetch(`/tasks/${task.id}/subtasks`);

          if (!response.ok) {
            console.error("Error fetching subtasks:", await response.text());
            return;
          }

          const data = await response.json();
          setSubtasks(data.subtasks || []);
        } catch (err) {
          console.error("Failed to fetch subtasks:", err);
        }
      }
    };

    fetchSubtasks();
  }, [task]);

  const handleCreateSubtask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!task || !subtaskText.trim()) return;
  
    try {
      const response = await fetch(`/tasks/${task.id}/subtasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          _action: "create",
          text: subtaskText,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Error creating subtask:", error.error);
        return;
      }
  
      await response.json(); // Fetching the new subtask (not used since we reload)
      setSubtaskText(""); // Clear the input
      window.location.reload(); // Force reload
    } catch (error) {
      console.error("Error while creating subtask:", error);
    }
  };

  const handleToggleState = async (subtaskId: string) => {
    if (!task) return;

    try {
      const response = await fetch(`/tasks/${task.id}/subtasks`, {
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
      setSubtasks((prev) =>
        prev.map((subtask) =>
          subtask.id === updatedSubtask.id ? updatedSubtask : subtask
        )
      );
    } catch (error) {
      console.error("Error while toggling subtask state:", error);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-modal-btn" onClick={onClose}>
          Close
        </button>
        <h2 className="modal-title">Subtasks for "{task.title}"</h2>

        {/* Subtasks List */}
        {/* <div className="subtasks-container">
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="subtask-card">
              <p
                className={`subtask-text ${
                  subtask.state === "DONE" ? "done" : ""
                }`}
              >
                {subtask.text}
              </p>
              <button
                onClick={() => handleToggleState(subtask.id)}
                className={`toggle-state-btn ${
                  subtask.state === "DONE" ? "btn-undone" : "btn-done"
                }`}
              >
                Mark as {subtask.state === "TODO" ? "DONE" : "TODO"}
              </button>
            </div>
          ))}
        </div> */}

        {/* Add Subtask Form */}
        <form className="subtask-form" onSubmit={handleCreateSubtask}>
          <label htmlFor="subtaskText" className="form-label">
            Add a new subtask
          </label>
          <div className="form-row">
            <input
              id="subtaskText"
              type="text"
              value={subtaskText}
              onChange={(e) => setSubtaskText(e.target.value)}
              placeholder="Enter subtask description"
              className="form-input"
              required
            />
            <button type="submit" className="form-submit-btn">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
