// src/components/papeleria/ProductoItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';

const ProductoItem = ({ producto, onDelete, isAdmin }) => {
  // Añadir log para verificar exactamente qué datos recibe este componente
  console.log("Datos en ProductoItem:", producto);
  
  // Verificar si producto es un objeto válido
  if (!producto || typeof producto !== 'object') {
    console.error("Error: Datos de producto inválidos", producto);
    return <div className="alert alert-warning">Producto no disponible</div>;
}


  // Mapear los campos que vienen de la base de datos
  const id = producto.id_papeleria;
  const tipo = producto.tipo_papeleria;
  const cantidad = producto.cantidad_papeleria;
  const oficina = producto.oficina_papeleria;
  const fecha = producto.fecha_papeleria;
  const fechaAsesor = producto.fechaAsesor_papeleria;
  
  const stockStatus = () => {
    if (cantidad <= 0) return 'text-danger';
    if (cantidad < 10) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="position-absolute top-0 end-0 m-2">
        <span className="badge bg-primary">{oficina || 'Sin oficina'}</span>
      </div>
      
      <div className="card-img-top text-center bg-light" style={{ height: '180px' }}>
        <div className="d-flex justify-content-center align-items-center h-100">
          <h3 className="text-muted">{tipo || 'Sin tipo'}</h3>
        </div>
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{tipo || 'Sin tipo'}</h5>
        <p className="card-text flex-grow-1">
          <strong>Oficina:</strong> {oficina || 'No especificada'}<br/>
          <strong>Fecha:</strong> {fecha || 'No especificada'}<br/>
          <strong>Fecha Asesor:</strong> {fechaAsesor || 'No especificada'}
        </p>
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fs-5 fw-bold">ID: {id || 'N/A'}</span>
          <span className={`badge ${stockStatus()}`}>
            Stock: {cantidad || 0} unidades
          </span>
        </div>
      </div>
      
      <div className="card-footer bg-white border-top-0">
        <div className="d-flex gap-2 justify-content-between">
          <Link to={`/productos/${id}`} className="btn btn-sm btn-outline-primary flex-grow-1">
            <FaEye className="me-1" /> Ver Detalles
          </Link>
          
          <div className="d-flex gap-1">
            {(typeof isAdmin === 'function' ? isAdmin() : isAdmin) && (
              <>
                <Link to={`/productos/editar/${id}`} className="btn btn-sm btn-outline-secondary">
                  <FaEdit />
                </Link>
                <button 
                  onClick={() => id && onDelete(id)} 
                  className="btn btn-sm btn-outline-danger"
                  disabled={!id}
                >
                  <FaTrashAlt />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoItem;