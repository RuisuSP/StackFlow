import axios from 'axios';
import { auth } from '../firebase';

// 1. Creamos la instancia de Axios con la URL de tu backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // Asegúrate de que este sea el puerto donde corre tu Node.js
});

// 2. Interceptor: Antes de cada petición, revisa si hay un usuario logueado
// y le pide a Firebase el Token para enviarlo al backend
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 3. Definimos las funciones para tus rutas de productos
export const getProductos = () => api.get('/productos');
export const crearProducto = (data) => api.post('/productos', data);
export const actualizarProducto = (id, data) => api.put(`/productos/${id}`, data);
export const eliminarProducto = (id) => api.delete(`/productos/${id}`);

// ... (lo que ya tenías de productos)
export const getVentas = () => api.get('/ventas');
export const crearVenta = (data) => api.post('/ventas', data);

export default api;