const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

console.log("Conexión a Firebase (Auth & Firestore) establecida con éxito!");

module.exports = { db, auth, admin };