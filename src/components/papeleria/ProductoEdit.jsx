// src/components/papeleria/ProductoEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import papeleriaService from '../../services/papeleriaService';

const ProductoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    existencias: '',
    categoria: '',
    imagen: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const producto = await papeleriaService.getById(id);
        setFormData(producto);
        if (producto.imagen) {
          setPreviewImage(producto.imagen);
        }
      } catch (err) {
        setError('Error al cargar el producto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducto();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        [name]: file
      });
      
      // Preview de imagen
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      if (id) {
        await papeleriaService.update(id, formDataToSend);
      } else {
        await papeleriaService.create(formDataToSend);
      }
      
      navigate('/productos');
    } catch (err) {
      setError(id ? 'Error al actualizar el producto' : 'Error al crear el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4 className="m-0">{id ? 'Editar Producto' : 'Crear Nuevo Producto'}</h4>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nombre" className="form-label">Nombre:</label>
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
              
              <div className="col-md-6 mb-3">
                <label htmlFor="categoria" className="form-label">Categoría:</label>
                <select
                  className="form-select"
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Escritura">Escritura</option>
                  <option value="Cuadernos">Cuadernos</option>
                  <option value="Oficina">Oficina</option>
                  <option value="Escolar">Escolar</option>
                  <option value="Arte">Arte</option>
                </select>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción:</label>
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
                <label htmlFor="precio" className="form-label">Precio:</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    id="precio"
                    name="precio"
                    min="0"
                    step="0.01"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="existencias" className="form-label">Existencias:</label>
                <input
                  type="number"
                  className="form-control"
                  id="existencias"
                  name="existencias"
                  min="0"
                  value={formData.existencias}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="imagen" className="form-label">Imagen:</label>
              <input
                type="file"
                className="form-control"
                id="imagen"
                name="imagen"
                accept="image/*"
                onChange={handleChange}
              />
              
              {previewImage && (
                <div className="mt-2">
                  <p>Vista previa:</p>
                  <img 
                    src={previewImage} 
                    alt="Vista previa" 
                    className="img-thumbnail" 
                    style={{ maxHeight: '200px' }} 
                  />
                </div>
              )}
            </div>
            
            <div className="d-flex justify-content-end gap-2 mt-4">
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
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  'Guardar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductoEdit;