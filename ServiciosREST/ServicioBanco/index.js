const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const paymentRoutes = require('./routes/payment.routes');
app.use('/api/payments', paymentRoutes);

app.listen(PORT, () => {
    console.log(`ServicioBanco escuchando en puerto ${PORT}`);
});