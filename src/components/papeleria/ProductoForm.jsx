// src/components/papeleria/ProductoForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import papeleriaService from '../../services/papeleriaService';
import { AuthContext } from '../../context/AuthContext';

const ProductoForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    existencias: '',
    categoria: '',
    imagen: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isEditMode) {
      fetchProducto();
    }
  }, [id]);
  
  const fetchProducto = async () => {
    try {
      setLoading(true);
      const data = await papeleriaService.getById(id);
      const producto = data.producto;
      
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        existencias: producto.existencias || '',
        categoria: producto.categoria || '',
        imagen: producto.imagen || ''
      });
    } catch (err) {
      setError('Error al cargar los datos del producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validación básica
    if (!formData.nombre || !formData.descripcion || !formData.precio || !formData.existencias) {
      setError('Por favor completa todos los campos obligatorios');
      setLoading(false);
      return;
    }
    
    try {
      if (isEditMode) {
        await papeleriaService.update(id, formData);
      } else {
        if (!isAdmin()) {
          throw new Error('No tienes permisos para crear productos');
        }
        await papeleriaService.create(formData);
      }
      navigate('/productos');
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          const errorMessages = Object.values(err.response.data.errors).flat();
          setError(errorMessages.join('\n'));
        } else {
          setError(err.response.data.error || 'Error al guardar el producto');
        }
      } else {
        setError(err.message || 'Error al guardar el producto');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return <div className="text-center mt-5">Cargando datos del producto...</div>;
  }
  
  return (
    <div className="container mt-4">
      <h2>{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre *</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción *</label>
          <textarea
            className="form-control"
            id="descripcion"
            name="descripcion"
            rows="3"
            value={formData.descripcion}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="precio" className="form-label">Precio *</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="col-md-6 mb-3">
            <label htmlFor="existencias" className="form-label">Existencias *</label>
            <input
              type="number"
              min="0"
              className="form-control"
              id="existencias"
              name="existencias"
              value={formData.existencias}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoría</label>
          <input
            type="text"
            className="form-control"
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="imagen" className="form-label">URL de Imagen</label>
          <input
            type="text"
            className="form-control"
            id="imagen"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
          />
        </div>
        
        <div className="d-flex justify-content-between">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/productos')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductoForm;