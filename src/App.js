import React, { useState, useEffect } from 'react';
import TaskForm from './comps/TaskForm';
import TaskList from './comps/TaskList';
import { collection,  updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
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




  // Update a task in Firestore
  const updateTask = async (updatedTask) => {
    try {
      const taskRef = doc(db, "transactions", updatedTask.id);
      await updateDoc(taskRef, updatedTask);
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      setEditingTask(null);
      window.location.reload();
    } catch (e) {
      console.error("Error updating document: ", e);
    }
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
          updateTask={updateTask}
        />
        <TaskList tasks={tasks} onDelete={deleteTask} onEdit={startEditing} />
      </div>
    </div>
  );
}
