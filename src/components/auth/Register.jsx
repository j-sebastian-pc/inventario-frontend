import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  
  const [formState, setFormState] = useState({
    error: "",
    success: "",
    isSubmitting: false,
    showPassword: false,
    showConfirmPassword: false
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    
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
    
    // Validación de contraseñas
    if (userData.password !== userData.password_confirmation) {
      setFormState(prev => ({
        ...prev,
        error: "Las contraseñas no coinciden",
        isSubmitting: false
      }));
      return;
    }
    
    try {
      // Enviar solicitud de registro
      const response = await axios.post("http://127.0.0.1:8000/api/register", userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      setFormState(prev => ({
        ...prev,
        success: "¡Registro exitoso! Iniciando sesión...",
        isSubmitting: false
      }));
      
      // Si el registro es exitoso, realizar inicio de sesión automático
      if (response.data && response.data.token) {
        login(
          { email: userData.email, password: userData.password },
          // onSuccess callback
          () => {
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 1500);
          },
          // onError callback
          (errorMsg) => {
            setFormState(prev => ({
              ...prev,
              error: "Registro exitoso pero hubo un problema al iniciar sesión: " + errorMsg,
              isSubmitting: false
            }));
          }
        );
      } else {
        // Si el backend no devuelve token, redirigir a login
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      }
      
    } catch (err) {
      let errorMessage = "Error al registrarse";
      
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          const errorMessages = Object.values(err.response.data.errors).flat();
          errorMessage = errorMessages.join(". ");
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }
      
      setFormState(prev => ({
        ...prev,
        error: errorMessage,
        isSubmitting: false
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }));
    } else {
      setFormState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }));
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "450px", width: "100%" }}>
        <h2 className="text-center mb-4">Registro de Usuario</h2>

        {formState.error && (
          <div className="alert alert-danger">{formState.error}</div>
        )}
        {formState.success && (
          <div className="alert alert-success">{formState.success}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="register-name" className="form-label">
              Nombre
            </label>
            <input
              id="register-name"
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Tu nombre completo"
              required
              disabled={formState.isSubmitting}
              autoComplete="name"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="register-email" className="form-label">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="tucorreo@ejemplo.com"
              required
              disabled={formState.isSubmitting}
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="register-password" className="form-label">
              Contraseña
            </label>
            <div className="input-group">
              <input
                id="register-password"
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="••••••••"
                required
                minLength="6"
                disabled={formState.isSubmitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="btn btn-outline-secondary"
                aria-label={formState.showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {formState.showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            <div className="form-text">La contraseña debe tener al menos 6 caracteres</div>
          </div>

          <div className="mb-4">
            <label htmlFor="register-password-confirm" className="form-label">
              Confirmar Contraseña
            </label>
            <div className="input-group">
              <input
                id="register-password-confirm"
                type={formState.showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                value={userData.password_confirmation}
                onChange={handleChange}
                className="form-control"
                placeholder="••••••••"
                required
                minLength="6"
                disabled={formState.isSubmitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="btn btn-outline-secondary"
                aria-label={formState.showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {formState.showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Registrando...
              </>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="mb-0">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;