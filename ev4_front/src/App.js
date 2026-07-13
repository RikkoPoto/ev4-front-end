import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // Estado inicial del formulario
  const initialFormState = {
    codigo: '',
    producto: '',
    descripcion: '',
    precio: '',
    cantidad: '',
    descuento: ''
  };

  // Estados
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState(false);

  // Cargar datos de Local Storage al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem('productosElectronicos');
    if (datosGuardados) {
      setProductos(JSON.parse(datosGuardados));
    }
  }, []);

  // Guardar en Local Storage cada vez que cambia el arreglo de productos
  useEffect(() => {
    localStorage.setItem('productosElectronicos', JSON.stringify(productos));
  }, [productos]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Agregar o Editar producto
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editando) {
      // Actualizar producto existente
      setProductos(
        productos.map((prod) =>
          prod.codigo === formData.codigo ? formData : prod
        )
      );
      setEditando(false);
    } else {
      // Validar que el código no exista
      const existe = productos.find((p) => p.codigo === formData.codigo);
      if (existe) {
        alert('Ya existe un producto con este código.');
        return;
      }
      // Agregar nuevo
      setProductos([...productos, formData]);
    }
    
    // Limpiar formulario
    setFormData(initialFormState);
  };

  // Cargar datos en el formulario para editar
  const handleEdit = (producto) => {
    setFormData(producto);
    setEditando(true);
  };

  // Eliminar producto
  const handleDelete = (codigo) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProductos(productos.filter((prod) => prod.codigo !== codigo));
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setFormData(initialFormState);
    setEditando(false);
  };

  // Filtrar productos por búsqueda (por código o nombre)
  const productosFiltrados = productos.filter((prod) =>
    prod.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
    prod.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center mb-4">Portal de Artículos Electrónicos</h1>

      <div className="row">
        {/* Columna del Formulario */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              {editando ? 'Editar Producto' : 'Agregar Producto'}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Código</label>
                  <input type="text" className="form-control" name="codigo" value={formData.codigo} onChange={handleChange} disabled={editando} required />
                </div>
                <div className="mb-3">
                  <label>Producto</label>
                  <input type="text" className="form-control" name="producto" value={formData.producto} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Descripción</label>
                  <textarea className="form-control" name="descripcion" value={formData.descripcion} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Precio ($)</label>
                  <input type="number" className="form-control" name="precio" value={formData.precio} onChange={handleChange} min="0" required />
                </div>
                <div className="mb-3">
                  <label>Cantidad</label>
                  <input type="number" className="form-control" name="cantidad" value={formData.cantidad} onChange={handleChange} min="0" required />
                </div>
                <div className="mb-3">
                  <label>Descuento (%)</label>
                  <input type="number" className="form-control" name="descuento" value={formData.descuento} onChange={handleChange} min="0" max="100" required />
                </div>
                <button type="submit" className={`btn w-100 ${editando ? 'btn-success' : 'btn-primary'}`}>
                  {editando ? 'Actualizar' : 'Guardar'}
                </button>
                {editando && (
                  <button type="button" className="btn btn-secondary w-100 mt-2" onClick={handleCancel}>
                    Cancelar
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Columna de la Tabla y Búsqueda */}
        <div className="col-md-8 mt-4 mt-md-0">
          <div className="card">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <span>Lista de Productos</span>
              <input 
                type="text" 
                className="form-control form-control-sm w-50" 
                placeholder="Buscar por código o producto..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="card-body p-0 text-center table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Descripción</th>
                    <th>Precio Normal</th>
                    <th>Cant.</th>
                    <th>Desc.</th>
                    <th>Precio Final</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((prod) => (
                      <tr key={prod.codigo}>
                        <td>{prod.codigo}</td>
                        <td>{prod.producto}</td>
                        <td>{prod.descripcion}</td>
                        <td>${prod.precio}</td>
                        <td>{prod.cantidad}</td>
                        <td>{prod.descuento}%</td>
                        <td>${(prod.precio * (1 - prod.descuento / 100))}</td>
                        <td>
                          <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(prod)}>
                            Editar
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod.codigo)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">No se encontraron productos.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;