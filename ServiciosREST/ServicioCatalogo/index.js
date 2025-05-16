const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/catalogo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
}).catch(err => console.error(err));
