const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const checkAuth = require('../middleware/authMiddleware');

// Endpoint para todas las rutas: /api/v1/ventas
router.post('/', checkAuth, ventaController.registrarVenta);
router.get('/', checkAuth, ventaController.obtenerVentas);

module.exports = router;