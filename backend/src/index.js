const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Importamos las rutas
const productoRoutes = require('./routes/productoRoutes');
app.use('/api/v1/productos', productoRoutes);

const ventaRoutes = require('./routes/ventaRoutes');
app.use('/api/v1/ventas', ventaRoutes);


app.listen(PORT, () => {
  console.log(`Servidor de StockFlow en http://localhost:${PORT}`);
});