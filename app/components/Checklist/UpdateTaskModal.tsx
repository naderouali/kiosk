import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import "../../styles/checklist.css";
import type { Task } from "@prisma/client";

interface UpdateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void; 
}

export default function UpdateTaskModal({
  isOpen,
  onClose,
  task,
  onTaskUpdate,
}: UpdateTaskModalProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const updatedTask = fetcher.data as Task;
      if (updatedTask.id === task.id) {
        onTaskUpdate(updatedTask);
        onClose();
      }
    }
  }, [fetcher.state, fetcher.data, task.id, onTaskUpdate, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Update Task</h2>
        <fetcher.Form method="post">
          <input type="hidden" name="_action" value="update" />
          <input type="hidden" name="id" value={task.id} />

          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={task.title}
              required
              className="modal-input"
            />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              defaultValue={task.description || ""}
              className="modal-textarea"
            />
          </div>

          <div>
            <label htmlFor="state">State</label>
            <select
              id="state"
              name="state"
              defaultValue={task.state}
              className="modal-select"
            >
              <option value="TODO">TODO</option>
              <option value="DOING">DOING</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="modal-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
