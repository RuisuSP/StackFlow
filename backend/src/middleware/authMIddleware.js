const admin = require('firebase-admin');

const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ status: "error", message: "No hay token de seguridad" });
  }

  try {
    // Verificacion de token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Se guardan los datos
    next();
  } catch (error) {
    res.status(401).json({ status: "error", message: "Token inválido o expirado" });
  }
};

module.exports = checkAuth;