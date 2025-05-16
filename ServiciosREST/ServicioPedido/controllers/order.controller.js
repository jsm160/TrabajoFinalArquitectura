const Order = require('../models/order.model');

exports.getAllOrders = async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
};

exports.createOrder = async (req, res) => {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
};

exports.getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Pedido no encontrado' });
    }
};

exports.deleteOrder = async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.status(204).end();
};