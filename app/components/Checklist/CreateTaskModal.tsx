import { useState } from "react";
import "../../styles/checklist.css";

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create a New Task</h2>
        <form method="post" action="/checklist">
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
        </form>
      </div>
    </div>
  );
}
