import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase.js";

export default function TaskForm({ initialTask, onSubmit }) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  // Set the form fields when editing an existing task
  useEffect(() => {
    if (initialTask) {
      setType(initialTask.type);
      setDescription(initialTask.description);
      setAmount(initialTask.amount);
    } else {
      setType('');
      setDescription('');
      setAmount('');
    }
  }, [initialTask]);

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type.trim() && description.trim() && amount) {
      const transaction = {
        amount: amount,
        description: description,
        type: type,
        date: new Date().toISOString(), // Automatically add the date
      };

      try {
        if (initialTask) {
          // If `initialTask` exists, update the task
          const updatedTask = { ...transaction, id: initialTask.id };
          await updateTask(updatedTask);
          onSubmit(updatedTask);  // Pass updated task back to App
        } else {
          // Otherwise, add a new transaction
          const newTask = await addTransaction(transaction);
          onSubmit(newTask);
          window.location.reload();
  // Pass new task back to App
        }

        // Clear the form fields after submission
        setType('');
        setDescription('');
        setAmount('');
      } catch (e) {
        console.error("Error handling form submission: ", e);
      }
    }
  };

  // Add a new transaction to Firestore
  const addTransaction = async (transaction) => {
    try {
      const docRef = await addDoc(collection(db, "transactions"), transaction);
      return { id: docRef.id, ...transaction }; // Return new task with id
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Update an existing task in Firestore
  const updateTask = async (updatedTask) => {
    try {
      const { id, ...taskWithoutId } = updatedTask; // Remove 'id' from updatedTask
      const taskRef = doc(db, "transactions", id); // Reference to the document using the 'id'
      await updateDoc(taskRef, taskWithoutId); // Update only the fields without the 'id'
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-4">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Set transaction type"
          required
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Transaction description"
          required
        />
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Transaction amount"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        {initialTask ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
}
