import React, { useState, useEffect, useContext } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import papeleriaService from '../../services/papeleriaService';
import { AuthContext } from '../../context/AuthContext';
import { Modal, Button, Table, Form } from 'react-bootstrap';


const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { isAdmin } = useContext(AuthContext);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    setError(""); 
    try {
        const response = await papeleriaService.getAll();
        if (!response || !response.productos) {
            throw new Error("Datos no válidos");
        }
        setProductos(response.productos);
    } catch (err) {
        setError(err.message || "Error al cargar los productos. Intenta de nuevo.");
    } finally {
        setLoading(false);
    }
};


  const handleEdit = (producto) => {
    setEditingProduct(producto);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await papeleriaService.delete(id);
        fetchProductos();
      } catch (err) {
        setError('Error al eliminar el producto.');
      }
    }
  };

const handleSave = async () => {
  try {
    const dataToSend = {
      tipo_papeleria: editingProduct.tipo_papeleria,
      cantidad_papeleria: editingProduct.cantidad_papeleria,
      oficina_papeleria: editingProduct.oficina_papeleria,
      fecha_papeleria: editingProduct.fecha_papeleria,
      fechaAsesor_papeleria: editingProduct.fechaAsesor_papeleria
    };
    
    console.log('Datos a enviar:', dataToSend);
    await papeleriaService.update(editingProduct.id_papeleria, dataToSend);
    fetchProductos();
    setShowModal(false);
  } catch (err) {
    console.error('Error completo:', err);
    setError('Error al actualizar el producto.');
  }
};

  return (
    <div className="container py-4">
      <h2>Lista de Productos</h2>
      {isAdmin && (
        <Button variant="success" className="mb-3">
          <FaPlus /> Agregar Producto
        </Button>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Oficina</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id_papeleria}>
                <td>{producto.id_papeleria}</td>
                <td>{producto.tipo_papeleria}</td>
                <td>{producto.cantidad_papeleria}</td>
                <td>{producto.oficina_papeleria}</td>
                <td>{producto.fecha_papeleria}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEdit(producto)} className="me-2">
                    <FaEdit />
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(producto.id_papeleria)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {/* Modal para editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control type="text" value={editingProduct?.tipo_papeleria || ''} onChange={(e) => setEditingProduct({ ...editingProduct, tipo_papeleria: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control type="number" value={editingProduct?.cantidad_papeleria || ''} onChange={(e) => setEditingProduct({ ...editingProduct, cantidad_papeleria: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Oficina</Form.Label>
              <Form.Control type="text" value={editingProduct?.oficina_papeleria || ''} onChange={(e) => setEditingProduct({ ...editingProduct, oficina_papeleria: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductosList;
