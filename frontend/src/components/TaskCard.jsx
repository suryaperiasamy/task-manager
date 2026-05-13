import React from "react";

const TaskCard = ({ task, onEdit, onDelete }) => {
  // Format the date to make it readable
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper functions to get CSS classes based on status/priority
  const getStatusClass = (status) => {
    switch (status) {
      case "Todo": return "badge-status-todo";
      case "In Progress": return "badge-status-progress";
      case "Completed": return "badge-status-completed";
      default: return "";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Low": return "badge-priority-low";
      case "Medium": return "badge-priority-medium";
      case "High": return "badge-priority-high";
      default: return "";
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
      </div>
      
      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="task-meta">
        <span className={`badge ${getStatusClass(task.status)}`}>
          {task.status}
        </span>
        <span className={`badge ${getPriorityClass(task.priority)}`}>
          {task.priority} Priority
        </span>
      </div>

      <div className="task-date">
        Due: {formatDate(task.dueDate)}
      </div>

      <div className="task-actions">
        <button 
          className="btn btn-secondary btn-small"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button 
          className="btn btn-danger btn-small"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
