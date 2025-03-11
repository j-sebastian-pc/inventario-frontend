// src/components/papeleria/ProductosList.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import papeleriaService from '../../services/papeleriaService';
import { AuthContext } from '../../context/AuthContext';
import ProductoItem from './ProductoItem';

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useContext(AuthContext);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await papeleriaService.getAll();
      setProductos(response.productos || []);
      setError('');
    } catch (err) {
      setError('Error al cargar los productos. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await papeleriaService.remove(id);
        setProductos(productos.filter(producto => producto.id !== id));
      } catch (err) {
        setError('Error al eliminar el producto.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando productos...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Productos</h2>
        {isAdmin() && (
          <Link to="/productos/nuevo" className="btn btn-primary">
            Agregar Producto
          </Link>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {productos.length === 0 ? (
        <div className="alert alert-info">
          No hay productos disponibles en este momento.
        </div>
      ) : (
        <div className="row">
          {productos.map(producto => (
            <div key={producto.id} className="col-md-4 mb-4">
              <ProductoItem 
                producto={producto} 
                onDelete={handleDelete} 
                isAdmin={isAdmin()} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductosList;