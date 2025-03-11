import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/layout/Dashboard';
import Navbar from './components/layout/Navbar';
import ProductosList from './components/papeleria/ProductosList';
import ProductoForm from './components/papeleria/ProductoForm';
import './App.css';
import { AuthContext } from './context/AuthContext';

const AuthenticatedLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="authenticated-content">
        {children}
      </div>
    </>
  );
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }
  
  return user ? <AuthenticatedLayout>{children}</AuthenticatedLayout> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }
  
  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/productos" element={<PrivateRoute><ProductosList /></PrivateRoute>} />
          <Route path="/productos/nuevo" element={<PrivateRoute><ProductoForm /></PrivateRoute>} />
          
          {/* Redirecciones */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;