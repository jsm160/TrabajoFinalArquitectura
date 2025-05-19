module.exports = {
    validatePayment: (paymentData) => {
        const cardNumber = paymentData.cardNumber || "";
        const lastDigit = parseInt(cardNumber.slice(-1), 10);
        return lastDigit % 2 === 0; 
    }
};