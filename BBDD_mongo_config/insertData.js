const mongoose = require('mongoose');
const { mongoURI } = require('./config');

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Esquemas
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  stock: Number
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const orderSchema = new mongoose.Schema({
  userEmail: String,
  items: [{
    productName: String,
    unitPrice: Number,
    quantity: Number,
    total: Number
  }],
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now }
});


const accountSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 4,
    match: /^\d{4}$/
  },
  cardHolderName: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

// Modelos
const Product = mongoose.model('Product', productSchema, 'products');
const User = mongoose.model('User', userSchema, 'users');
const Account = mongoose.model('Account', accountSchema, 'accounts');
const Order = mongoose.model('Order', orderSchema, 'orders');

// Inserción unificada
const run = async () => {
  // Limpieza previa
  await Product.deleteMany({});
  await User.deleteMany({});
  await Account.deleteMany({});
  await Order.deleteMany({});

  // Insertar productos variados
  await Product.insertMany([
    { name: 'TV LG 4K', price: 399.99, description: 'Smart TV 50 pulgadas', stock: 12 },
    { name: 'Lavadora Samsung', price: 349.99, description: '7 kg A++', stock: 6 },
    { name: 'Aire acondicionado', price: 450.00, description: 'Split inverter', stock: 4 },
    { name: 'Microondas Cecotec', price: 99.99, description: '20L con grill', stock: 15 },
    { name: 'Frigorífico Balay', price: 699.00, description: '2 puertas, 185cm', stock: 5 },
    { name: 'Robot aspirador Roomba', price: 249.99, description: 'Limpieza automática', stock: 8 },
    { name: 'Secadora Beko', price: 319.00, description: '8 kg, condensación', stock: 4 },
    { name: 'Cafetera DeLonghi', price: 179.99, description: 'Espresso manual', stock: 10 },
    { name: 'Placa inducción Bosch', price: 429.00, description: '3 zonas', stock: 3 },
    { name: 'Horno Balay', price: 399.00, description: 'Pirolítico multifunción', stock: 6 }
  ]);

  // Insertar usuarios
  await User.insertMany([
    { email: 'pedro@demo.com', password: '123456' },
    { email: 'maria@demo.com', password: '123456' },
    { email: 'laura@demo.com', password: '123456' }
  ]);

  // Insertar cuentas bancarias
  await Account.insertMany([
    { cardNumber: '1111', cardHolderName: 'Juan Perez', balance: 1000.00 },
    { cardNumber: '2222', cardHolderName: 'Laura Gomez', balance: 1500.00 },
    { cardNumber: '3333', cardHolderName: 'Carlos Ruiz', balance: 500.00 },
    { cardNumber: '4444', cardHolderName: 'Maria Lopez', balance: 25.00 }, // ** Para probar saldo insuficiente
    { cardNumber: '5555', cardHolderName: 'Pedro Perez', balance: 0.00 }, // ** Para probar saldo cero
    { cardNumber: '9999', cardHolderName: 'Tarjeta Error', balance: 100.00 } // ** Para probar el error simulado del 500 si termina en 0
  ]);

  // Insertar pedidos
  await Order.insertMany([
    {
      userEmail: 'pedro@demo.com',
      items: [
        { productName: 'TV LG 4K', unitPrice: 399.99, quantity: 1, total: 399.99 },
        { productName: 'Lavadora Samsung', unitPrice: 349.99, quantity: 2, total: 699.98 }
      ],
      totalPrice: 1099.97
    },
    {
      userEmail: 'maria@demo.com',
      items: [
        { productName: 'Frigorífico Balay', unitPrice: 699.00, quantity: 1, total: 699.00 },
        { productName: 'Microondas Cecotec', unitPrice: 99.99, quantity: 1, total: 99.99 },
        { productName: 'Cafetera DeLonghi', unitPrice: 179.99, quantity: 1, total: 179.99 }
      ],
      totalPrice: 978.98
    },
    {
      userEmail: 'laura@demo.com',
      items: [
        { productName: 'Robot aspirador Roomba', unitPrice: 249.99, quantity: 1, total: 249.99 },
        { productName: 'Placa inducción Bosch', unitPrice: 429.00, quantity: 1, total: 429.00 }
      ],
      totalPrice: 678.99
    }
  ]);

  console.log('✅ Todos los datos extendidos han sido insertados correctamente');
  mongoose.disconnect();
};

run();
