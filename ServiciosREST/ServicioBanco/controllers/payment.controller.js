const Payment = require('../models/payment.model');
const Account = require('../models/account.model'); 

exports.processPayment = async (req, res) => { 
    const { cardNumber, cardHolderName, amount } = req.body;

    // ** Validar datos de entrada 
    if (!cardNumber || !cardHolderName || amount === undefined || amount === null) {
        return res.status(400).json({ message: "Datos de petición inválidos: cardNumber, cardHolderName y amount son requeridos." });
    }

    if (typeof cardNumber !== 'string' || !/^\d{4}$/.test(cardNumber)) {
        return res.status(400).json({ message: "Datos de petición inválidos: cardNumber debe ser un string de 4 dígitos." });
    }

    if (typeof amount !== 'number' || amount <= 0.01) {
        return res.status(400).json({ message: "Datos de petición inválidos: amount debe ser un número mayor que 0.01." });
    }

    try {
        // ** Buscar la cuenta/tarjeta en la base de datos 
        const account = await Account.findOne({ cardNumber }); 

        if (!account) {
            return res.status(400).json({ message: "Cuenta no encontrada." });
        }

        if (account.cardHolderName !== cardHolderName) {
            return res.status(400).json({ message: "Datos de petición inválidos: Nombre del titular de la tarjeta no coincide." });
        }

        // ** Comprobar saldo suficiente
        if (account.balance < amount) {
             console.log(`DEBUG: Saldo de la cuenta: ${account.balance}, Monto a pagar: ${amount}`); 
            return res.status(400).json({ message: "Saldo insuficiente." });
        }

        // ** El saldo de la tarjeta cambia en la BBDD
        account.balance -= amount;
        await account.save();
        console.log(`Pago de ${amount} procesado para ${cardNumber}. Nuevo saldo: ${account.balance}`);


        if (cardNumber.endsWith("0")) { 
            return res.status(500).json({ message: "Fallo al procesar el pago (error interno simulado)." });
        }

        res.status(200).json({ success: true });

    } catch (error) {
        console.error("Error al procesar el pago:", error);
        res.status(500).json({ message: "Fallo al procesar el pago (error interno del servidor)." });
    }
};