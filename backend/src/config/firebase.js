const admin = require('firebase-admin');

// Inicia la ruta establecida en el .env
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

console.log("Conexión a la BD establecida con éxito!");

module.exports = db;