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

      const newSubtask = await response.json();
      setSubtasks((prev) => [...prev, newSubtask]);
      setSubtaskText("");
    } catch (error) {
      console.error("Error while creating subtask:", error);
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
        <div className="subtasks-container">
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="subtask-card">
              <p className="subtask-text">{subtask.text}</p>
            </div>
          ))}
        </div>

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
