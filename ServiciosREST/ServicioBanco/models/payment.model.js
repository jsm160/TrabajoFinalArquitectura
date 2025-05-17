// Modelo simulado, no se almacena en base de datos
module.exports = {
    validatePayment: (paymentData) => {
        const cardNumber = paymentData.cardNumber || "";
        const lastDigit = parseInt(cardNumber.slice(-1), 10);
        return lastDigit % 2 === 0; // Aprobado si termina en número par
    }
};