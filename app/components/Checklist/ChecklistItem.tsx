// import React from "react";
// import { TaskWithSubtasks } from "../../types/types"; // Ensure type consistency
// import "../../styles/checklist.css";

// interface ChecklistItemProps {
//   task: TaskWithSubtasks; // Consistent type usage
//   onCheckboxChange: (task: TaskWithSubtasks) => void;
//   onDelete: (id: string) => void;
//   onOpenSubtasks: (task: TaskWithSubtasks) => void;
//   onToggleSubtaskState: (taskId: string, subtaskId: string) => void;
// }

// const ChecklistItem: React.FC<ChecklistItemProps> = ({
//   task,
//   onCheckboxChange,
//   onDelete,
//   onOpenSubtasks,
//   onToggleSubtaskState,
// }) => {
//   return (
//     <li
//       key={task.id}
//       className={`task-item ${task.state === "DONE" ? "task-done" : ""}`}
//     >
//       <div className="task-items-big">
//         <div className="task-left">
//           <input
//             type="checkbox"
//             className="task-checkbox"
//             checked={task.state === "DONE"}
//             onChange={() => onCheckboxChange(task)}
//           />
//         </div>

//         <div className="task-content">
//           <p className="task-title">{task.title}</p>
//           <p className="task-description">
//             {task.description || "No description provided"}
//           </p>
//         </div>

//         <div className="task-actions">
//           <button
//             className="open-subtasks-btn"
//             onClick={() => onOpenSubtasks(task)}
//           >
//             Add Subtasks
//           </button>
//           <button
//             className="delete-task-btn"
//             onClick={() => onDelete(task.id)}
//           >
//             ✕
//           </button>
//         </div>
//       </div>

//       {/* Safely check if subtasks exist before accessing length */}
//       {task.subtasks && task.subtasks.length > 0 && (
//         <details className="subtasks-details">
//           <summary>Subtasks ({task.subtasks.length})</summary>
//           <ul className="subtask-list">
//             {task.subtasks.map((subtask) => (
//               <li
//                 key={subtask.id}
//                 className={`subtask-item ${
//                   subtask.state === "DONE" ? "subtask-done" : ""
//                 }`}
//               >
//                 <span
//                   className={`subtask-text ${
//                     subtask.state === "DONE" ? "subtask-done-text" : ""
//                   }`}
//                 >
//                   {subtask.text}
//                 </span>
//                 <button
//                   onClick={() => onToggleSubtaskState(task.id, subtask.id)}
//                   className={`toggle-state-btn ${
//                     subtask.state === "DONE" ? "btn-undone" : "btn-done"
//                   }`}
//                 >
//                   Mark as {subtask.state === "TODO" ? "DONE" : "TODO"}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </details>
//       )}
//     </li>
//   );
// };

// export default ChecklistItem;
