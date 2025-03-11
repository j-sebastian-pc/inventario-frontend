import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [formState, setFormState] = useState({
    error: "",
    success: "",
    isSubmitting: false,
    showPassword: false,
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    
    // Limpiar mensajes cuando el usuario modifica los campos
    if (formState.error || formState.success) {
      setFormState(prev => ({ ...prev, error: "", success: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formState.isSubmitting) return;
    
    setFormState(prev => ({
      ...prev,
      isSubmitting: true,
      error: "",
      success: ""
    }));
    
    login(
      credentials,
      () => {
        setFormState(prev => ({
          ...prev,
          success: "¡Inicio de sesión exitoso! Redirigiendo al dashboard..."
        }));
        
        // Usar navigate con reemplazo para evitar volver al login con el botón atrás
        setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
      },
      (errorMessage) => {
        setFormState(prev => ({
          ...prev,
          error: errorMessage,
          isSubmitting: false
        }));
      }
    );
  };

  const togglePasswordVisibility = () => {
    setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>

        {formState.error && (
          <div className="alert alert-danger text-center">{formState.error}</div>
        )}
        {formState.success && (
          <div className="alert alert-success text-center">{formState.success}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="login-email" className="form-label">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              disabled={formState.isSubmitting}
              className="form-control"
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password-field" className="form-label">
              Contraseña
            </label>
            <div className="input-group">
              <input
                id="password-field"
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                disabled={formState.isSubmitting}
                className="form-control"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="btn btn-outline-secondary"
                aria-label={formState.showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {formState.showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="btn btn-primary w-100"
          >
            {formState.isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Iniciando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="mb-2">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-primary">
              Regístrate aquí
            </Link>
          </p>
          <p className="mb-0">
            <Link to="/forgot-password" className="text-primary">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;