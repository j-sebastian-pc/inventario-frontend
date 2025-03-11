// src/components/papeleria/ProductoForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaUpload } from 'react-icons/fa';
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
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});
  
  const categorias = [
    'Escritura',
    'Cuadernos',
    'Oficina',
    'Escolar',
    'Arte',
    'Organización',
    'Tecnología'
  ];
  
  useEffect(() => {
    // Verificar permisos de administrador
    if (!isAdmin && !isEditMode) {
      navigate('/productos');
      return;
    }
    
    if (isEditMode) {
      fetchProducto();
    }
  }, [id, isAdmin, navigate]);
  
  const fetchProducto = async () => {
    try {
      setLoadingData(true);
      const data = await papeleriaService.getById(id);
      const producto = data.producto || data;
      
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        existencias: producto.existencias || '',
        categoria: producto.categoria || '',
        imagen: producto.imagen || ''
      });
      
      if (producto.imagen) {
        setImagePreview(producto.imagen);
      }
    } catch (err) {
      setError('Error al cargar los datos del producto. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    
    // Marcar el campo como tocado para validación
    setTouched({
      ...touched,
      [name]: true
    });
    
    if (type === 'file' && files && files[0]) {
      setImageFile(files[0]);
      
      // Crear una URL para previsualización
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      fileReader.readAsDataURL(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
  };
  
  const validate = () => {
    const errors = {};
    
    if (!formData.nombre) errors.nombre = 'El nombre es obligatorio';
    if (!formData.descripcion) errors.descripcion = 'La descripción es obligatoria';
    if (!formData.precio) errors.precio = 'El precio es obligatorio';
    else if (isNaN(formData.precio) || Number(formData.precio) < 0) 
      errors.precio = 'El precio debe ser un número positivo';
    
    if (!formData.existencias) errors.existencias = 'Las existencias son obligatorias';
    else if (isNaN(formData.existencias) || Number(formData.existencias) < 0 || !Number.isInteger(Number(formData.existencias)))
      errors.existencias = 'Las existencias deben ser un número entero positivo';
    
    return errors;
  };
  
  const errors = validate();
  
  const getFieldClass = (field) => {
    if (!touched[field]) return 'form-control';
    return errors[field] ? 'form-control is-invalid' : 'form-control is-valid';
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados para mostrar validaciones
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    // Verificar si hay errores
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setError('Por favor, corrige los errores en el formulario.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Preparar los datos para enviar
      const dataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value);
      });
      
      // Agregar la imagen si se ha seleccionado una nueva
      if (imageFile) {
        dataToSend.append('imagen_file', imageFile);
      }
      
      if (isEditMode) {
        await papeleriaService.update(id, dataToSend);
      } else {
        await papeleriaService.create(dataToSend);
      }
      
      // Redireccionar a la lista de productos con mensaje de éxito
      navigate('/productos', { 
        state: { 
          message: `Producto ${isEditMode ? 'actualizado' : 'creado'} correctamente`,
          type: 'success'
        }
      });
    } catch (err) {
      console.error('Error:', err);
      
      if (err.response) {
        if (err.response.data.errors) {
          const errorMessages = Object.values(err.response.data.errors).flat().join('. ');
          setError(`Error: ${errorMessages}`);
        } else if (err.response.data.message) {
          setError(`Error: ${err.response.data.message}`);
        } else {
          setError(`Error al ${isEditMode ? 'actualizar' : 'crear'} el producto (${err.response.status})`);
        }
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError(`Error al ${isEditMode ? 'actualizar' : 'crear'} el producto`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loadingData) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando datos del producto...</span>
          </div>
          <p className="mt-2">Cargando datos del producto...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="m-0">{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h4>
          <button 
            className="btn btn-sm btn-light" 
            onClick={() => navigate('/productos')}
            title="Volver a la lista"
          >
            <FaArrowLeft /> Volver
          </button>
        </div>
        
        <div className="card-body">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className={getFieldClass('nombre')}
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ej: Cuaderno profesional de cuadros"
                    required
                  />
                  {touched.nombre && errors.nombre && (
                    <div className="invalid-feedback">{errors.nombre}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción *</label>
                  <textarea
                    className={getFieldClass('descripcion')}
                    id="descripcion"
                    name="descripcion"
                    rows="4"
                    value={formData.descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Describe las características del producto..."
                    required
                  ></textarea>
                  {touched.descripcion && errors.descripcion && (
                    <div className="invalid-feedback">{errors.descripcion}</div>
                  )}
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
                        className={getFieldClass('precio')}
                        id="precio"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="0.00"
                        required
                      />
                      {touched.precio && errors.precio && (
                        <div className="invalid-feedback">{errors.precio}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="existencias" className="form-label">Existencias *</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className={getFieldClass('existencias')}
                      id="existencias"
                      name="existencias"
                      value={formData.existencias}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      required
                    />
                    {touched.existencias && errors.existencias && (
                      <div className="invalid-feedback">{errors.existencias}</div>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="categoria" className="form-label">Categoría</label>
                  <select
                    className="form-select"
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="imagen" className="form-label">Imagen</label>
                  <div className="card">
                    <div className="card-body text-center">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Vista previa" 
                          className="img-fluid mb-3" 
                          style={{ maxHeight: '200px' }} 
                        />
                      ) : (
                        <div className="text-center p-4 bg-light mb-3">
                          <FaUpload size={40} className="text-muted mb-2" />
                          <p className="mb-0">No hay imagen</p>
                        </div>
                      )}
                      
                      <div className="input-group">
                        <input
                          type="file"
                          className="form-control"
                          id="imagen_file"
                          name="imagen_file"
                          accept="image/*"
                          onChange={handleChange}
                        />
                      </div>
                      <small className="text-muted d-block mt-2">
                        Formatos recomendados: JPG, PNG. Máx. 2MB
                      </small>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label htmlFor="imagen" className="form-label">URL de imagen (opcional)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="imagen"
                      name="imagen"
                      value={formData.imagen}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    <small className="text-muted">
                      Si sube un archivo y proporciona URL, se dará prioridad al archivo.
                    </small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="d-flex justify-content-between mt-4">
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
                  <>
                    <FaSave className="me-2" /> 
                    {isEditMode ? 'Actualizar Producto' : 'Guardar Producto'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-3 text-muted">
        <small>* Campos obligatorios</small>
        <br />
        <small>Última modificación: {isEditMode ? 'En edición' : 'Nuevo producto'}</small>
      </div>
    </div>
  );
};

export default ProductoForm;