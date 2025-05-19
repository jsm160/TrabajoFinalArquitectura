const Order = require('../models/order.model');
const Product = require('../models/product.model');

exports.createOrder = async (req, res) => {
  const { customerName, products } = req.body;

  if (!customerName || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: 'Datos incompletos para crear el pedido.' });
  }

  let totalPrice = 0;
  let items = [];
  let needsRestock = [];

  for (const item of products) {
    const dbProduct = await Product.findById(item.productId);
    if (!dbProduct) continue;

    const requestedQty = item.quantity;
    const availableQty = dbProduct.stock;

    const servedQty = Math.min(requestedQty, availableQty);
    dbProduct.stock -= servedQty;
    await dbProduct.save();

    const itemTotal = dbProduct.price * servedQty;
    totalPrice += itemTotal;

    items.push({
      productName: dbProduct.name,
      unitPrice: dbProduct.price,
      quantity: servedQty,
      total: itemTotal
    });

    if (requestedQty > availableQty) {
      needsRestock.push({
        productId: dbProduct._id,
        requested: requestedQty,
        served: availableQty,
        missing: requestedQty - availableQty
      });
    }
  }

  const newOrder = new Order({
    userEmail: customerName,      // Mapea correctamente
    items,                        // Guarda el array detallado
    totalPrice,
    status: needsRestock.length > 0 ? 'pendiente_restock' : 'completo'
  });

  await newOrder.save();

  // Simulación de reabastecimiento
  if (needsRestock.length > 0) {
    setTimeout(() => {
      needsRestock.forEach(async (p) => {
        const prod = await Product.findById(p.productId);
        if (prod) {
          prod.stock += p.missing;
          await prod.save();
          console.log(`✅ Reabastecido ${prod.name} con ${p.missing} unidades.`);
        }
      });
    }, 5000);
  }

  res.status(201).json({
    message: 'Pedido registrado correctamente',
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


exports.getOrdersByUser = async (req, res) => {
  const customerName = req.params.customerName;

  try {
    const orders = await Order.find({ customerName }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener pedidos del usuario.' });
  }
};

