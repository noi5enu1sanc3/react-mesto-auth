class Api {
  constructor({ headers, id }, options) {
    this._headers = headers;
    this._id = id;
    this._baseUrl = options.baseUrl;
  }

  _getResponse = (res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);

  getUserInfo() {
    return fetch(`${this._baseUrl}${this._id}/users/me`, {
      headers: this._headers,
    })
    .then((res) => this._getResponse(res));
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}${this._id}/cards`, {
      headers: this._headers,
    })
    .then((res) => this._getResponse(res));
  }

  setUserInfo(data) {
    return fetch(`${this._baseUrl}${this._id}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about
      }),
    })
    .then((res) => this._getResponse(res));
  }



  uploadNewCard(data) {
    return fetch(`${this._baseUrl}${this._id}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link,
    }),
    })
    .then(res => this._getResponse(res));
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}${this._id}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers
    })
    .then(res => this._getResponse(res));
  }

  toggleLike(cardId, isLiked) {
    if (isLiked === false) {
      return fetch(`${this._baseUrl}${this._id}/cards/${cardId}/likes`, {
        method: "PUT",
        headers: this._headers
      })
      .then(res => this._getResponse(res));
    } else {
      return fetch(`${this._baseUrl}${this._id}/cards/${cardId}/likes`, {
        method: "DELETE",
        headers: this._headers
      })
      .then(res => this._getResponse(res));
    }
  }

  changeAvatar(data) {
    return fetch(`${this._baseUrl}${this._id}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar
    })
    })
    .then(res => this._getResponse(res))
  }
}

const api = new Api(
  {
    headers: {
      authorization: "e0205997-951b-4911-8a29-7b97b6aecfba",
      "Content-Type": "application/json",
    },
    id: "cohort-43",
  },
  {
    baseUrl: "https://nomoreparties.co/v1/"
  }
);

export default api;
