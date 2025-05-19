const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const verifyToken = require('./middleware/auth.middleware');
app.use(verifyToken);

// Rutas
const bancoRoutes = require('./routes/payment.routes');
app.use('/api/payments', bancoRoutes);

app.listen(PORT, () => {
  console.log(`🟢 Servicio Banco escuchando en el puerto ${PORT}`);
});
