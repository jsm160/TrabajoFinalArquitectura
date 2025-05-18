const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const verifyToken = require('../middleware/auth.middleware');

// Endpoints públicos
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById); 

// Endpoints protegidos
router.post('/', verifyToken, productController.createProduct);
router.put('/:id', verifyToken, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;
