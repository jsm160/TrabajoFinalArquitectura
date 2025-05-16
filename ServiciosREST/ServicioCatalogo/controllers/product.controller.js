const Product = require('../models/product.model');

exports.getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

exports.createProduct = async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
};

exports.updateProduct = async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
};

exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).end();
};
