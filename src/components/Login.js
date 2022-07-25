import { useState } from "react";
import { useFormAndValidation } from "../hooks/useFormAndValidation";


function Login({ isLoading, onLogin }) {
  const { values, setValues, handleChange, errors, isValid, resetForm } =
    useFormAndValidation('.auth__input');

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onLogin(values);
    resetForm();
    setValues({password: "", email: ""});
  }

  return (
    <div className="auth__container">
      <h2 className="auth__heading">Вход</h2>
      <form className="auth__form" name="login" onSubmit={handleSubmit} novalidate>
        <input
          className="auth__input"
          placeholder="Email"
          type="email"
          name="email"
          value={values.email || ""}
          onChange={handleChange}
          required
        ></input>
        <div className="auth__input-error-container">
          <span className="auth__input-error">{errors.email}</span>
        </div>
        <input
          className="auth__input"
          placeholder="Пароль"
          type="password"
          name="password"
          minLength="8"
          value={values.password || ""}
          onChange={handleChange}
          required
        ></input>
        <div className="auth__input-error-container">
          <span className="auth__input-error">{errors.password}</span>
        </div>
        <button
          type="submit"
          className={`auth__save-btn ${
            isValid ? "" : "auth__save-btn_disabled"
          }`}
          disabled={!isValid}
        >
          {isLoading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
}

export default Login;
