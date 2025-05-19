const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const verifyToken = require('../middleware/auth.middleware');

// GET todos los pedidos
router.get('/', orderController.getAllOrders);

// GET pedidos por nombre de usuario (más específica)
router.get('/user/:customerName', verifyToken, orderController.getOrdersByUser);

// DELETE pedido (más específica que GET :id)
router.delete('/:id', verifyToken, orderController.deleteOrder);

// GET un pedido por ID (debe ir después de las más específicas)
router.get('/:id', orderController.getOrderById);

// POST crear pedido
router.post('/', verifyToken, orderController.createOrder);

module.exports = router;
