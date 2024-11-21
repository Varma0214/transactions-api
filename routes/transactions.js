const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Transaction = require('../models/Transaction');  // Import the Transaction model

// POST /api/transactions - Create a new transaction
router.post('/api/transactions', async (req, res) => {
  try {
    const { amount, transaction_type, user } = req.body;
    const newTransaction = new Transaction({
      amount: amount,
      transaction_type: transaction_type,
      user: user,
    });
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/transactions - Retrieve all transactions for a specific user
router.get('/api/transactions', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const transactions = await Transaction.find({ user: user_id });
    res.json({ transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/transactions/:transaction_id - Update a transaction status
router.put('/api/transactions/:transaction_id', async (req, res) => {
  try {
    const { status } = req.body;
    const { transaction_id } = req.params;

    if (!['COMPLETED', 'FAILED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be either "COMPLETED" or "FAILED".' });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transaction_id,
      { status: status },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(updatedTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/transactions/:transaction_id - Retrieve a specific transaction by ID
router.get('/api/transactions/:transaction_id', async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const transaction = await Transaction.findById(transaction_id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
