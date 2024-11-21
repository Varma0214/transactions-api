const mongoose = require('mongoose');

// Define the transaction schema
const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  transaction_type: {
    type: String,
    enum: ['DEPOSIT', 'WITHDRAWAL'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  }
});

// Override the toJSON method to customize the response
transactionSchema.methods.toJSON = function () {
  const transaction = this.toObject();

  // Customize the response fields as needed
  return {
    transaction_id: 1, // Replace 1 with a custom ID generation logic if required
    amount: transaction.amount,
    transaction_type: transaction.transaction_type,
    status: transaction.status,
    user: transaction.user,
    timestamp: transaction.timestamp
  };
};

// Create the model from the schema
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;