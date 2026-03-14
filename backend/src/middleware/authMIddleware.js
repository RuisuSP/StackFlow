// Cambia el require para traer el objeto que configuramos
const { auth } = require('../config/firebase'); 

const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ status: "error", message: "No hay token de seguridad" });
  }

  try {
    // Ahora usamos el objeto 'auth' que ya viene inicializado
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error validando token:", error.message);
    res.status(401).json({ status: "error", message: "Token inválido o expirado" });
  }
};

module.exports = checkAuth;