import React, { useState, useContext, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError("");
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        await login(credentials);
        navigate("/");
      } catch (err) {
        setError(err.response?.data?.error || "Error al iniciar sesión");
      } finally {
        setLoading(false);
      }
    },
    [credentials, login, navigate]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-3">Iniciar Sesión</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="form-control"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="input-group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                disabled={loading}
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
            disabled={loading}
            className="btn btn-primary w-100"
          >
            {loading ? (
              <>
                <Loader2 className="loading-icon me-2" size={18} />
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
