const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors({
  origin: 'http://localhost:4200', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🟢 Servicio Auth escuchando en el puerto ${PORT}`);
});
