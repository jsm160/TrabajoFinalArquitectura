const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); // Permitir peticiones de otros orígenes (Angular)
app.use(express.json()); // Permitir recibir JSON en POST

const stockService = require('./services/stock.service');
const providerService = require('./services/provider.service');

// ----- ENDPOINTS DE STOCK -----

app.post('/api/stock/check', async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const available = await stockService.verifyAvailability(productId, quantity);
    res.json({ available });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stock/decrease', async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const success = await stockService.decreaseStock(productId, quantity);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stock/increase', async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const success = await stockService.increaseStock(productId, quantity);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----- ENDPOINTS DE PROVIDER -----

app.post('/api/provider/check-price', async (req, res) => {
  const { productId, providerId } = req.body;
  try {
    const price = await providerService.checkProductPrice(productId, providerId);
    res.json({ price });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/provider/restock', async (req, res) => {
  const { productId, quantity, providerId } = req.body;
  try {
    const success = await providerService.makeRestockOrder(productId, quantity, providerId);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Servidor REST corriendo en http://localhost:${port}`);
});
