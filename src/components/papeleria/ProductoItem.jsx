// src/components/papeleria/ProductoItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProductoItem = ({ producto, onDelete, isAdmin }) => {
  return (
    <div className="card h-100">
      {producto.imagen ? (
        <img 
          src={producto.imagen} 
          className="card-img-top" 
          alt={producto.nombre} 
          style={{ height: '200px', objectFit: 'cover' }} 
        />
      ) : (
        <div 
          className="card-img-top bg-light d-flex align-items-center justify-content-center" 
          style={{ height: '200px' }}
        >
          <span className="text-muted">Sin imagen</span>
        </div>
      )}
      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text">{producto.descripcion}</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="badge bg-primary">Precio: ${producto.precio}</span>
          <span className="badge bg-secondary">
            Stock: {producto.existencias} unidades
          </span>
        </div>
      </div>
      <div className="card-footer bg-white border-top-0">
        <div className="d-flex justify-content-between">
          <Link 
            to={`/productos/${producto.id}`} 
            className="btn btn-sm btn-outline-primary"
          >
            Ver Detalles
          </Link>
          <Link 
            to={`/productos/editar/${producto.id}`} 
            className="btn btn-sm btn-outline-success"
          >
            Editar
          </Link>
          {isAdmin && (
            <button 
              onClick={() => onDelete(producto.id)} 
              className="btn btn-sm btn-outline-danger"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductoItem;