const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const verifyToken = require('./middleware/auth.middleware');
app.use(verifyToken);

// Rutas
const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`🟢 Servicio Catálogo escuchando en el puerto ${PORT}`);
});
