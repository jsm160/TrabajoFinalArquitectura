const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const orderRoutes = require('./routes/order.routes');
app.use('/api/orders', orderRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pedidos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB - pedidos');
    app.listen(PORT, () => console.log(`Servidor Pedido en puerto ${PORT}`));
}).catch(err => console.error(err));