
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (userData.password !== userData.password_confirmation) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    
    try {
      await register(userData);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          const errorMessages = Object.values(err.response.data.errors).flat();
          setError(errorMessages.join('\n'));
        } else {
          setError(err.response.data.error || 'Error al registrarse');
        }
      } else {
        setError('Error al registrarse');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Registro de Usuario</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={userData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              name="password_confirmation"
              className="form-control"
              value={userData.password_confirmation}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className="mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;