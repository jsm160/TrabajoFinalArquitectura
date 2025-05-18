const express = require('express');
const cors = require('cors');

// Cargar configuración de conexión MongoDB (MongoDB Atlas)
require('./config/db');

const app = express();
const PORT = process.env.PORT || 3003;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🟢 Servicio Auth escuchando en el puerto ${PORT}`);
});
