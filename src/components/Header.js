import logo from "../images/logo.svg";
import { Route, Link } from "react-router-dom";

function Header({ userEmail, onLogOut }) {
  return (
    <header className="header">
      <img src={logo} alt="логотип проекта Место" className="header__logo" />
      <div className="header__link-container">
        <Route path="/sign-in">
          <Link to="/sign-up" className="header__link">Регистрация</Link>
        </Route>
        <Route path="/sign-up">
          <Link to="/sign-in" className="header__link">Войти</Link>
        </Route>
        <Route exact path="/">
          <p className="header__email">{userEmail}</p>
          <button className="header__logout-btn" onClick={onLogOut}>Выйти</button>
        </Route>
      </div>
    </header>
  );
}

export default Header;
