const soap = require('strong-soap').soap;

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

module.exports = {
  verifyAvailability,
  decreaseStock,
  increaseStock
};
