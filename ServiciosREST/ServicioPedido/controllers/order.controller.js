const Order = require('../models/order.model');
const Product = require('../models/product.model');

exports.createOrder = async (req, res) => {
  const { customerName, products } = req.body;

  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ message: 'Formato incorrecto de productos' });
  }

  let total = 0;
  let updatedProducts = [];
  let needsRestock = [];

  for (const item of products) {
    const dbProduct = await Product.findById(item.productId);
    if (!dbProduct) continue;

    const requestedQty = item.quantity;
    const availableQty = dbProduct.stock;

    if (availableQty >= requestedQty) {
      dbProduct.stock -= requestedQty;
      await dbProduct.save();
      total += dbProduct.price * requestedQty;
      updatedProducts.push({ productId: dbProduct._id, quantity: requestedQty });
    } else if (availableQty > 0) {
      dbProduct.stock = 0;
      await dbProduct.save();
      total += dbProduct.price * availableQty;
      updatedProducts.push({ productId: dbProduct._id, quantity: availableQty });

      // Marcar para reposición
      needsRestock.push({
        productId: dbProduct._id,
        requested: requestedQty,
        served: availableQty,
        missing: requestedQty - availableQty
      });
    } else {
      needsRestock.push({
        productId: dbProduct._id,
        requested: requestedQty,
        served: 0,
        missing: requestedQty
      });
    }
  }

  const newOrder = new Order({
    customerName,
    products: updatedProducts,
    total,
    status: needsRestock.length > 0 ? 'pendiente_restock' : 'completo'
  });

  await newOrder.save();

  // Notificar si hay productos sin stock completo
  if (needsRestock.length > 0) {
    console.log('🔔 Productos en falta:');
    needsRestock.forEach(p => {
      console.log(`Producto ${p.productId} - Faltan ${p.missing} unidades`);
    });

    // Simulamos que se reabastece tras 5 segundos
    setTimeout(() => {
      needsRestock.forEach(async (p) => {
        const prod = await Product.findById(p.productId);
        if (prod) {
          prod.stock += p.missing;
          await prod.save();
          console.log(`✅ Reabastecido el producto ${prod.name}, +${p.missing} unidades`);

          // Simulación de notificación al usuario
          console.log(`📧 Notificación enviada al cliente: ¡Producto ${prod.name} disponible de nuevo!`);
        }
      });
    }, 5000); // Espera 5 segundos simulando el reabastecimiento
  }

  res.status(201).json({
    message: 'Pedido registrado',
    order: newOrder,
    productosFaltantes: needsRestock
  });
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.productId');
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar el pedido' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el pedido' });
  }
};
