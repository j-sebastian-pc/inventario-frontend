import React, { useState } from 'react';

const ProductoEdit = () => {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Handle successful update
    } catch (err) {
      setError('Error al actualizar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Existencias:</label>
          <input
            type="number"
            name="existencias"
            value={formData.existencias}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Categoría:</label>
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Imagen:</label>
          <input
            type="text"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default ProductoEdit;