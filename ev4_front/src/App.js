import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Importamos nuestros nuevos estilos

function App() {
  const initialFormState = {
    codigo: '', 
    producto: '', 
    descripcion: '',
    precio: '', 
    cantidad: '', 
    descuento: ''
  };

  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const datosGuardados = localStorage.getItem('productosElectronicos');
    if (datosGuardados) setProductos(JSON.parse(datosGuardados));
  }, []);

  useEffect(() => {
    localStorage.setItem('productosElectronicos', JSON.stringify(productos));
  }, [productos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editando) {
      setProductos(productos.map((prod) => prod.codigo === formData.codigo ? formData : prod));
      setEditando(false);
    } else {
      const existe = productos.find((p) => p.codigo === formData.codigo);
      if (existe) {
        alert('Ya existe un producto con este código.');
        return;
      }
      setProductos([...productos, formData]);
    }
    setFormData(initialFormState);
  };

  const handleEdit = (producto) => {
    setFormData(producto);
    setEditando(true);
  };

  const handleDelete = (codigo) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProductos(productos.filter((prod) => prod.codigo !== codigo));
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setEditando(false);
  };

  const productosFiltrados = productos.filter((prod) =>
    prod.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
    prod.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 fw-bold" style={{ color: '#2d3436' }}>
        Portal de Artículos Electrónicos
      </h1>

      <div className="row g-4">
        {/* Columna del Formulario */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div 
              className="card-header text-white text-center py-3 border-0" 
              style={{ background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', borderRadius: '1rem 1rem 0 0' }}
            >
              <h5 className="mb-0 fw-bold">{editando ? 'Editar Producto' : 'Nuevo Producto'}</h5>
            </div>
            <div className="card-body p-4 bg-white rounded-bottom-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">Código</label>
                  <input type="text" className="form-control bg-light" name="codigo" value={formData.codigo} onChange={handleChange} disabled={editando} required placeholder="Ej: PROD-01" />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">Producto</label>
                  <input type="text" className="form-control bg-light" name="producto" value={formData.producto} onChange={handleChange} required placeholder="Nombre del artículo" />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">Descripción</label>
                  <textarea className="form-control bg-light" name="descripcion" value={formData.descripcion} onChange={handleChange} rows="2" required placeholder="Detalles..." />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-semibold mb-1">Precio ($)</label>
                    <input type="number" className="form-control bg-light" name="precio" value={formData.precio} onChange={handleChange} min="0" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-semibold mb-1">Cantidad</label>
                    <input type="number" className="form-control bg-light" name="cantidad" value={formData.cantidad} onChange={handleChange} min="0" required />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted fw-semibold mb-1">Descuento (%)</label>
                  <input type="number" className="form-control bg-light" name="descuento" value={formData.descuento} onChange={handleChange} min="0" max="100" required />
                </div>
                
                <button type="submit" className={`btn btn-animado w-100 rounded-pill fw-bold text-white mb-2`} style={{ backgroundColor: editando ? '#00b894' : '#6c5ce7', border: 'none' }}>
                  {editando ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
                
                {editando && (
                  <button type="button" className="btn btn-light btn-animado w-100 rounded-pill fw-bold text-muted border" onClick={handleCancel}>
                    Cancelar
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Columna de la Tabla y Búsqueda */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div 
              className="card-header text-white px-4 py-3 border-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #2d3436, #636e72)', borderRadius: '1rem 1rem 0 0' }}
            >
              <h5 className="mb-0 fw-bold">Inventario</h5>
              <div className="input-group w-auto" style={{ maxWidth: '300px' }}>
                <span className="input-group-text bg-white border-0 text-muted rounded-start-pill" id="search-icon">🔍</span>
                <input 
                  type="text" 
                  className="form-control border-0 shadow-none rounded-end-pill" 
                  placeholder="Buscar..." 
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar"
                />
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-borderless align-middle text-center mb-0">
                  <thead style={{ backgroundColor: '#f8f9fa', color: '#636e72' }}>
                    <tr>
                      <th className="py-3">Código</th>
                      <th>Producto</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Descuento</th>
                      <th>Precio Final</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.length > 0 ? (
                      productosFiltrados.map((prod) => (
                        <tr key={prod.codigo} className="border-bottom">
                          <td className="fw-semibold text-muted">{prod.codigo}</td>
                          <td className="fw-bold">{prod.producto}</td>
                          <td><small className="text-muted">{prod.descripcion}</small></td>
                          <td className="fw-bold">${prod.precio}</td>
                          <td>
                            <span className={`badge ${prod.cantidad > 10 ? 'bg-success' : prod.cantidad > 0 ? 'bg-warning' : 'bg-danger'} rounded-pill px-3`}>
                              {prod.cantidad}
                            </span>
                          </td>
                          <td>
                            {prod.descuento > 0 ? (
                              <span className="badge bg-info text-dark rounded-pill px-2">{prod.descuento}%</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="text-success fw-bold">${prod.precio - (prod.precio * prod.descuento / 100)}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary rounded-circle me-2 btn-animado" onClick={() => handleEdit(prod)} title="Editar">
                              ✏️
                            </button>
                            <button className="btn btn-sm btn-outline-danger rounded-circle btn-animado" onClick={() => handleDelete(prod.codigo)} title="Eliminar">
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          <div className="fs-1 mb-2">📦</div>
                          No se encontraron productos en el inventario.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;