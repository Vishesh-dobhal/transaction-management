import React, { useState, useEffect } from 'react';
import TaskForm from './comps/TaskForm';
import TaskList from './comps/TaskList';
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "transactions"));
      const tasksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    };

    fetchTasks();
  }, []);

  // Handle task submit for both adding and updating tasks
  const handleTaskSubmit = (submittedTask) => {
    if (submittedTask.id) {
      // Update the task in the state
      setTasks(tasks.map(task => (task.id === submittedTask.id ? submittedTask : task)));
    } else {
      // Add the new task to the state
      setTasks([...tasks, submittedTask]);
    }
    setEditingTask(null); // Clear the editing state
  };

  // Delete a task from Firestore
  const deleteTask = async (id) => {
    try {
      const taskRef = doc(db, "transactions", id);
      await deleteDoc(taskRef);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task);
  };

  return (
    <div className="row">
      <div className="col-md-6 offset-md-3">
        <TaskForm
          initialTask={editingTask}
          onSubmit={handleTaskSubmit}  // Pass the submit handler
        />
        <TaskList tasks={tasks} onDelete={deleteTask} onEdit={startEditing} />
      </div>
    </div>
  );
}
