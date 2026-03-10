const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Endpoint para todas las rutas: /api/v1/productos/  (llevaria ID al final si es el PUT o DELETE)
router.get('/', productoController.obtenerProductos);
router.post('/', productoController.crearProducto);
router.put('/:id', productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);

module.exports = router;