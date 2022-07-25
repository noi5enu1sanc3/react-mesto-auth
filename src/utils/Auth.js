class Auth {
  constructor() {
    this._baseUrl = 'https://auth.nomoreparties.co/';
    this._headers = {
      "Content-Type": "application/json"
    };
  }

  _getResponse = (res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);

  register({ password, email }) {
    return fetch(`${this._baseUrl}signup`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ password, email })
    })
    .then((res) => this._getResponse(res));
  }

  authorize({ password, email }) {
    return fetch(`${this._baseUrl}signin`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ password, email })
    })
    .then((res) => this._getResponse(res))
  }

  getContent(token) {
    return fetch(`${this._baseUrl}users/me`, {
      method: "GET",
      headers: {
        ...this._headers,
        "Authorization" : `Bearer ${token}`
      }
    })
    .then((res) => this._getResponse(res))
    .then (data => data)
  }
}

export default Auth;
