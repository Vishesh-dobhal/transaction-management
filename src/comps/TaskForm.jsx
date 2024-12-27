import React, { useState, useEffect } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.js";

export default function TaskForm({ onSubmit, initialTask }) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(null);

  // Function to add the transaction to Firestore
  const addTransaction = async (transaction) => {
    try {
      const docRef = await addDoc(collection(db, "transactions"), transaction);
      
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    window.location.reload();
  };

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

  // Handle the form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (type.trim() && description.trim() && amount) {
      // Create the transaction object
      const transaction = {
        amount: amount,
        description: description,
        type: type,
        date: new Date().toISOString(), // Automatically add the date
      };

      // Add the transaction to Firestore
      addTransaction(transaction);

      // Clear the form fields after submission
      setType('');
      setDescription('');
      setAmount('');
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
