import { useFormAndValidation } from "../hooks/useFormAndValidation";

function Register({ isLoading }) {
  const { values, handleChange, errors, isValid, setValues, resetForm } =
    useFormAndValidation();

  return (
    <div className="auth__container">
      <h2 className="auth__heading">Регистрация</h2>
      <form className="auth__form" name="register" noValidate>
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
          `${isLoading ? "Регистрация..." : "Зарегистрироваться"}`
        </button>
      </form>
      <p className="auth__to-login-text">
        Уже зарегистрированы? <a className="auth__to-login-link">Войти</a>
      </p>
    </div>
  );
}

export default Register;
