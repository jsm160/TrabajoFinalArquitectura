const mongoose = require('mongoose');
const { mongoURI } = require('../../../BBDD_mongo_config/config'); 

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB conectado"))
.catch((err) => console.error("Error de conexión:", err));
