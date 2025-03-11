import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaChartLine, 
  FaBell, 
  FaUserCircle, 
  FaBars, 
  FaSignOutAlt 
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const navLinks = [
    { path: "/", icon: <FaHome />, text: "Inicio" },
    { path: "/productos", icon: <FaBox />, text: "Productos" },
    { path: "/ventas", icon: <FaShoppingCart />, text: "Ventas" },
    { path: "/usuarios", icon: <FaUsers />, text: "Usuarios" },
    { path: "/estadisticas", icon: <FaChartLine />, text: "Estadísticas" }
  ];

  return (
    <>
      {/* Navbar superior */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <button 
            className="navbar-toggler border-0"
            type="button"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>
          
          <Link className="navbar-brand" to="/">
            <FaBox className="me-2" />
            Mi Aplicación
          </Link>

          {/* Enlaces de navegación para pantallas grandes */}
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {navLinks.map((link) => (
                <li className="nav-item" key={link.path}>
                  <Link
                    to={link.path}
                    className={`nav-link ${isActive(link.path) ? "active" : ""}`}
                  >
                    {React.cloneElement(link.icon, { className: "me-1" })}
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Menú de usuario */}
          <div className="dropdown">
            <button
              className="btn btn-link nav-link text-white dropdown-toggle d-flex align-items-center"
              type="button"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
            >
              <FaUserCircle className="me-1" />
              <span className="d-none d-md-inline">
                {user ? user.name : "Usuario"}
              </span>
            </button>
            
            {dropdownOpen && (
              <ul className="dropdown-menu dropdown-menu-end show">
                <li>
                  <Link className="dropdown-item" to="/perfil">
                    Mi Perfil
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar para móviles */}
      {isSidebarOpen && (
        <div className="sidebar bg-dark text-white" 
             style={{
               position: "fixed",
               top: "56px",
               left: "0",
               width: "250px",
               height: "calc(100vh - 56px)",
               zIndex: "1030",
               overflowY: "auto",
               transition: "all 0.3s ease"
             }}>
          <div className="p-3">
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <FaUserCircle className="me-2" size={24} />
              <span>{user ? user.name : "Usuario"}</span>
            </div>
            <ul className="nav flex-column">
              {navLinks.map((link) => (
                <li className="nav-item mb-2" key={link.path}>
                  <Link
                    to={link.path}
                    className={`nav-link ${isActive(link.path) ? "active bg-primary" : "text-white"}`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {React.cloneElement(link.icon, { className: "me-2" })}
                    {link.text}
                  </Link>
                </li>
              ))}
              <li className="nav-item">
                <button
                  className="nav-link text-danger border-0 bg-transparent"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-2" />
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el sidebar al hacer clic fuera */}
      {isSidebarOpen && (
        <div 
          style={{
            position: "fixed",
            top: "56px",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: "1029"
          }}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;