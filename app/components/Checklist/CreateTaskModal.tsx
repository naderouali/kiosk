import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import type { Task } from "@prisma/client"; // Import Task type
import "../../styles/checklist.css";

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreate: (task: Task) => void;
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  onTaskCreate,
}: CreateTaskModalProps) {
  const fetcher = useFetcher<Task>(); // Tell fetcher to expect Task data

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data &&
      fetcher.data.id // Ensure valid task data
    ) {
      onTaskCreate(fetcher.data); // Add the new task
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose, onTaskCreate]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create a New Task</h2>
        <fetcher.Form method="post" action="/checklist">
          <input type="hidden" name="_action" value="create" />
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            required
            className="modal-input"
          />
          <textarea
            name="description"
            placeholder="Task Description"
            className="modal-textarea"
          ></textarea>
          <select name="state" defaultValue="TODO" className="modal-select">
            <option value="TODO">TODO</option>
            <option value="DOING">DOING</option>
            <option value="DONE">DONE</option>
          </select>
          <input type="hidden" name="ownerId" value="1" />
          <div className="modal-actions">
            <button type="submit" className="modal-submit-btn">
              Save
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
