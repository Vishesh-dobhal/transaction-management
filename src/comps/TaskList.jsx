import React from 'react';

export default function TaskList({ tasks, onDelete, onEdit }) {
  return (
    <ul className="list-group">
      {tasks.map((task) => (
        <li key={task.id} className="list-group-item mb-3">
          <h5 className="mb-2">Transaction Type: {task.type}</h5>
          <p className="text-muted mb-2">Amount: {task.amount}</p>
          <p className="text-muted mb-2">Description: {task.description}</p>
          
          <div className="d-flex justify-content-end">
            {/* Edit button to trigger the onEdit function */}
            <button
              onClick={() => onEdit(task)} // Trigger onEdit with the task data
              className="btn btn-warning me-2"
            >
              Edit
            </button>

            {/* Delete button to trigger the onDelete function */}
            <button
              onClick={() => onDelete(task.id)} // Trigger onDelete with the task ID
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
