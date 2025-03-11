import React from "react";
import { FaBox, FaUsers, FaChartLine, FaShoppingCart } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="container-fluid p-4">
      <h1 className="mb-4">Dashboard</h1>

      <div className="row">
        {/* Tarjeta 1: Productos */}
        <div className="col-md-3 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                <FaBox className="me-2" />
                Productos
              </h5>
              <p className="card-text">
                <strong>Total:</strong> 120
              </p>
              <a href="/productos" className="btn btn-primary">
                Ver más
              </a>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Ventas */}
        <div className="col-md-3 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                <FaShoppingCart className="me-2" />
                Ventas
              </h5>
              <p className="card-text">
                <strong>Este mes:</strong> $15,000
              </p>
              <a href="/ventas" className="btn btn-primary">
                Ver más
              </a>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Usuarios */}
        <div className="col-md-3 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                <FaUsers className="me-2" />
                Usuarios
              </h5>
              <p className="card-text">
                <strong>Registrados:</strong> 45
              </p>
              <a href="/usuarios" className="btn btn-primary">
                Ver más
              </a>
            </div>
          </div>
        </div>

        {/* Tarjeta 4: Estadísticas */}
        <div className="col-md-3 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                <FaChartLine className="me-2" />
                Estadísticas
              </h5>
              <p className="card-text">
                <strong>Crecimiento:</strong> +12%
              </p>
              <a href="/estadisticas" className="btn btn-primary">
                Ver más
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos o más contenido */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Resumen de Ventas</h5>
              <p className="card-text">
                Aquí puedes incluir un gráfico o tabla de ventas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;