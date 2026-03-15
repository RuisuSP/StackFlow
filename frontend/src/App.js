import React, { useEffect, useState } from 'react';
import './App.css';
import { getProductos, crearProducto, eliminarProducto, actualizarProducto } from './services/api';
import Login from './components/Login';
import Ventas from './components/Ventas';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [productoId, setProductoId] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '' });

  const cargarProductos = async () => {
    try {
      const res = await getProductos();
      if (res.data?.status === "success") setProductos(res.data.data);
    } catch (err) { setProductos([]); }
  };

  useEffect(() => { if (user) cargarProductos(); }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datos = { ...form, precio: parseFloat(form.precio), stock: parseInt(form.stock) };
    try {
      if (editando) await actualizarProducto(productoId, datos);
      else await crearProducto(datos);
      cancelarEdicion();
      cargarProductos();
    } catch (err) { alert("Error"); }
  };

  const prepararEdicion = (p) => {
    setEditando(true);
    setProductoId(p.id);
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setProductoId(null);
    setForm({ nombre: '', descripcion: '', precio: '', stock: '' });
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar?")) {
      await eliminarProducto(id);
      cargarProductos();
    }
  };

  if (!user) {
    return (
      <div className="welcome-screen">
        <h1 className="hero-logo">StockFlow</h1>
        <Login />
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="main-header">
        <h1 className="logo-small">StockFlow</h1>
        <Login />
      </header>

      <main className="content">
        <section className="form-card">
          <h3>{editando ? "📝 Editar Producto" : "Nuevo Producto"}</h3>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="input-group">
              <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
              <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
              <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} required />
              <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-save">{editando ? "Actualizar" : "Guardar"}</button>
              {editando && <button type="button" onClick={cancelarEdicion} className="btn-cancel">Cancelar</button>}
            </div>
          </form>
        </section>

        <h2 className="section-title">Inventario</h2>
        <div className="inventory-grid">
          {productos.map(p => (
            <div key={p.id} className="product-card">
              <h4>{p.nombre}</h4>
              {/* ID del producto en gris y chiquito justo debajo del nombre */}
              <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '-10px', marginBottom: '10px' }}>
                ID: {p.id}
              </p>
              <p className="description">{p.descripcion}</p>
              <div className="meta">
                <span className="price">${p.precio}</span>
                <span className="stock">{p.stock} uds</span>
              </div>
              <div className="actions">
                <button onClick={() => prepararEdicion(p)} className="btn-edit">Editar</button>
                <button onClick={() => handleEliminar(p.id)} className="btn-delete">Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        <hr className="separator" />
        <Ventas productosDisponibles={productos} alVender={cargarProductos} />
      </main>
    </div>
  );
}

export default App;