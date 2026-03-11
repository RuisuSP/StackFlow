const db = require('../config/firebase');

// Obtener todos los productos (GET)
exports.obtenerProductos = async (req, res) => {
  try {
    const snapshot = await db.collection('productos').get();
    const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.status(200).json({
      status: "success",
      data: productos
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Agregar un producto (POST)
exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;

    if (!nombre || precio <= 0 || stock < 0) {
      return res.status(400).json({ status: "error", message: "Datos inválidos" });
    }

    const existencia = await db.collection('productos').where('nombre', '==', nombre).get();
    if (!existencia.empty) {
      return res.status(400).json({ status: "error", message: "Ese producto ya está registrado" });
    }

    const nuevoProducto = { nombre, descripcion, precio, stock, fechaCreacion: new Date().toISOString() };
    const docRef = await db.collection('productos').add(nuevoProducto);

    res.status(201).json({ status: "success", data: { id: docRef.id } });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Actualizar un producto (PUT)
exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const datosNuevos = req.body;

    // Si viene el precio, que sea > 0
    if (datosNuevos.precio && datosNuevos.precio <= 0) {
      return res.status(400).json({ status: "error", message: "Precio inválido" });
    }

    const pRef = db.collection('productos').doc(id);
    await pRef.update(datosNuevos);

    res.status(200).json({ status: "success", message: "Producto actualizado" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Eliminar un producto (DELETE)
exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('productos').doc(id).delete();
    res.status(200).json({ status: "success", message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};