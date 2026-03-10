const db = require('../config/firebase');

// Obtener todas las ventas (GET)
exports.obtenerVentas = async (req, res) => {
  try {
    const snapshot = await db.collection('ventas').orderBy('fecha', 'desc').get();
    const ventas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.status(200).json({
      status: "success",
      data: ventas
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Hacer una venta (POST)
exports.registrarVenta = async (req, res) => {
    const { usuarioId, productos, total } = req.body; 
    // productos es una lista: [{id, cantidad, precio}, ...]

    try {
        await db.runTransaction(async (t) => {
            // 1. Verificar stock de cada producto
            for (const item of productos) {
                const pRef = db.collection('productos').doc(item.id);
                const doc = await t.get(pRef);

                if (!doc.exists) throw new Error(`Producto ${item.id} no existe`);
                
                const stockActual = doc.data().stock;
                if (stockActual < item.cantidad) {
                    throw new Error(`Stock insuficiente para ${doc.data().nombre}`);
                }

                // 2. Restar el stock
                t.update(pRef, { stock: stockActual - item.cantidad });
            }

            // 3. Crear el ticket de venta
            const ventaRef = db.collection('ventas').doc();
            t.set(ventaRef, {
                usuarioId,
                productos,
                total,
                fecha: new Date().toISOString()
            });
        });

        res.status(201).json({ status: "success", message: "Venta realizada y stock actualizado" });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};


