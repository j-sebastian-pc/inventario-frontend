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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isSubmitting) {
      return;
    }
  
    setIsSubmitting(true);
    setError("");
    setSuccess("");
  
    login(
      credentials,
      // onSuccess callback
      () => {
        setSuccess("¡Inicio de sesión exitoso! Redirigiendo al dashboard...");
        setTimeout(() => {
          navigate("/dashboard"); // Redirige al dashboard después de 1.5 segundos
        }, 1500);
      },
      // onError callback
      (errorMessage) => {
        setError(errorMessage);
        setIsSubmitting(false);
      }
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}
        {success && <div className="alert alert-success text-center">{success}</div>}

        <form onSubmit={handleSubmit}>
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
              disabled={isSubmitting}
              className="form-control"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password-field" className="form-label">
              Contraseña
            </label>
            <div className="input-group">
              <input
                id="password-field"
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="form-control"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="btn btn-outline-secondary"
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-100"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Iniciando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-primary">
              Regístrate aquí
            </Link>
          </p>
          <p>
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