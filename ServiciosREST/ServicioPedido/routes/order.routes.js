const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const verifyToken = require('../middleware/auth.middleware');

// GET todos los pedidos
router.get('/', orderController.getAllOrders);

// GET un pedido por ID
router.get('/:id', orderController.getOrderById);

// POST crear pedido
router.post('/', verifyToken, orderController.createOrder);

// DELETE pedido
router.delete('/:id', verifyToken, orderController.deleteOrder);

module.exports = router;
