const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    products: [{
        productId: String,
        quantity: Number
    }],
    total: Number,
    status: { type: String, default: 'pendiente' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);