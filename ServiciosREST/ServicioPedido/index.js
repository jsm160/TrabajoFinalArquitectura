const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

const verifyToken = require('./middleware/auth.middleware');
app.use(verifyToken);

// Rutas
const pedidoRoutes = require('./routes/order.routes');
app.use('/api/pedidos', pedidoRoutes);

app.listen(PORT, () => {
  console.log(`🟢 Servicio Pedido escuchando en el puerto ${PORT}`);
});
