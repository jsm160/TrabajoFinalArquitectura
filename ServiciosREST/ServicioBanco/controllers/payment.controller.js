const Payment = require('../models/payment.model');

exports.processPayment = (req, res) => {
    const { cardNumber, cardHolder, amount } = req.body;

    if (!cardNumber || !cardHolder || !amount) {
        return res.status(400).json({ status: "rejected", message: "Datos incompletos" });
    }

    const isValid = Payment.validatePayment({ cardNumber });

    if (isValid) {
        res.status(200).json({ status: "approved", message: "Pago validado correctamente" });
    } else {
        res.status(402).json({ status: "rejected", message: "Pago rechazado" });
    }
};