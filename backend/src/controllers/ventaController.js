const { db } = require('../config/firebase');

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
    const usuarioEmail = req.user.email; 
    const { productos, total } = req.body;

    try {
        await db.runTransaction(async (t) => {
            const listadoOperaciones = [];

            // --- FASE 1: LECTURAS (Todos los .get van primero) ---
            for (const item of productos) {
                const pRef = db.collection('productos').doc(item.id);
                const doc = await t.get(pRef);

                if (!doc.exists) throw new Error(`Producto ${item.id} no existe`);
                
                const stockActual = doc.data().stock;
                if (stockActual < item.cantidad) {
                    throw new Error(`Stock insuficiente para ${doc.data().nombre}`);
                }

                // Guardamos la info para la siguiente fase
                listadoOperaciones.push({ ref: pRef, nuevoStock: stockActual - item.cantidad });
            }

            // --- FASE 2: ESCRITURAS (Updates y Sets al final) ---
            listadoOperaciones.forEach(op => {
                t.update(op.ref, { stock: op.nuevoStock });
            });

            const ventaRef = db.collection('ventas').doc();
            t.set(ventaRef, {
                usuarioEmail,
                productos,
                total,
                fecha: new Date().toISOString()
            });
        });

        res.status(201).json({ status: "success", message: "Venta realizada exitosamente." });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};
