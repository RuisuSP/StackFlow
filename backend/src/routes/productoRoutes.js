const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const checkAuth = require('./middleware/authMiddleware');

// Endpoint para todas las rutas: /api/v1/productos/  (llevaria ID al final si es el PUT o DELETE)
// Solo el get es publico, los demás metodos requieren login
router.get('/', productoController.obtenerProductos);
router.post('/', checkAuth, productoController.crearProducto);
router.put('/:id', checkAuth, productoController.actualizarProducto);
router.delete('/:id', checkAuth, productoController.eliminarProducto);

module.exports = router;