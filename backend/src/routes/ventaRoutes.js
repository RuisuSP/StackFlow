const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Endpoint para todas las rutas: /api/v1/ventas
router.post('/', ventaController.registrarVenta);
router.get('/', ventaController.obtenerVentas);

module.exports = router;