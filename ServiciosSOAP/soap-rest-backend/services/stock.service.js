const soap = require('strong-soap').soap;
const db = require('../config/db');

// URL de tu servicio SOAP de stock
const WSDL_URL = 'http://localhost:9080/StockService/services/StockServiceHandler?wsdl';

function verifyAvailability(productId, quantity) {
  return new Promise((resolve, reject) => {
    soap.createClient(WSDL_URL, {}, (err, client) => {
      if (err) return reject(err);

      client.verifyAvailability({ productId, quantity }, (err, result) => {
        if (err) return reject(err);
        resolve(result.return); // true o false
      });
    });
  });
}

function decreaseStock(productId, quantity) {
  return new Promise((resolve, reject) => {
    soap.createClient(WSDL_URL, {}, (err, client) => {
      if (err) return reject(err);

      client.decreaseStock({ productId, quantity }, (err, result) => {
        if (err) return reject(err);
        resolve(result.return); // true o false
      });
    });
  });
}

function increaseStock(productId, quantity) {
  return new Promise((resolve, reject) => {
    soap.createClient(WSDL_URL, {}, (err, client) => {
      if (err) return reject(err);

      client.increaseStock({ productId, quantity }, (err, result) => {
        if (err) return reject(err);
        resolve(result.return); // true o false
      });
    });
  });
}

async function getStock(productId) {
  const [rows] = await db.query('SELECT quantity FROM product_stock WHERE product_id = ?', [productId]);
  return rows.length > 0 ? rows[0].quantity : null;
}

module.exports = {
  verifyAvailability,
  decreaseStock,
  increaseStock,
  getStock
};
