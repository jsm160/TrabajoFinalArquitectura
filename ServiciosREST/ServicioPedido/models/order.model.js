const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, 
  items: [itemSchema],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'pendiente' },
  createdAt: { type: Date, default: Date.now },
  products: { type: Array, default: [] } 
});

module.exports = mongoose.model('Order', orderSchema);
