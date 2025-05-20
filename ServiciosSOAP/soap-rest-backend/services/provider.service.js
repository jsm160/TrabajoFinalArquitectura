const soap = require('strong-soap').soap;

// URL del WSDL del servicio SOAP de proveedor
const WSDL_URL = 'http://localhost:9080/ProviderManagement/services/ProviderServiceHandler?wsdl';

function checkProductPrice(productId, providerId) {
  return new Promise((resolve, reject) => {
    soap.createClient(WSDL_URL, {}, (err, client) => {
      if (err) return reject(err);

      client.checkProductPrice({ productId, providerId }, (err, result) => {
        if (err) return reject(err);
        resolve(result.return); // número con el precio
      });
    });
  });
}

function makeRestockOrder(productId, quantity, providerId) {
  return new Promise((resolve, reject) => {
    soap.createClient(WSDL_URL, {}, (err, client) => {
      if (err) return reject(err);

      client.makeRestockOrder({ productId, quantity, providerId }, (err, result) => {
        if (err) return reject(err);
        resolve(result.return); // true o false
      });
    });
  });
}

module.exports = {
  checkProductPrice,
  makeRestockOrder
};
