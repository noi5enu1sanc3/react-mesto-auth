import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory, withRouter } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import ProtectedRoute from "./ProtectedRoute"
import Login from "./Login";
import Register from "./Register";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ConfirmationPopup from "./ConfirmationPopup";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import LikedByPopup from "./LikedByPopup";
import api from "../utils/Api";
import Auth from "../utils/Auth";
import InfoTooltip from "./InfoTooltip";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);

  const history = useHistory();

  const auth = new Auth();

  const handleRegister = ({ password, email }) => {
    setIsLoading(true)
    auth.register({ password, email })
    .then(res => {
      history.push('./sign-in');
      setIsRegistrationSuccessful(true);
      setIsInfoToolTipOpen(true);
    })
    .catch(err => {
      console.log(err);
      setIsRegistrationSuccessful(false);
      setIsInfoToolTipOpen(true);
    })
    .finally(() => setIsLoading(false))
  }

  const handleLogin = ({ password, email }) => {
    if (!password || !email) {
      return;
    }
    setIsLoading(true)
    auth.authorize({ password, email })
    .then((res) => {
      if (res.token) {
        localStorage.setItem('token', res.token);
        return res;
      } else {
        return
      }
    })
    .then(res => {
      if(res.token) {
        setIsLoggedIn(true);
        history.push("./");
      }
    })
    .catch(err => console.log(err))
    .finally(() => setIsLoading(false))
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    history.push('/sign-in');
  }

  const handleTokenCheck = () => {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      auth.getContent(token)
      .then(res => {
        if(res) {
          setIsLoggedIn(true);
          setUserEmail(res.data.email);
          history.push("./")
        }
      })
    }
  }

  const [cards, setCards] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.toggleLike(card._id, isLiked)
    .then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch(err => console.log(err));
  }

  function handleCardDelete(id) {
    setIsLoading(true);
    api.deleteCard(id)
    .then(() => {
      setCards((state) => state.filter((c) => c._id !== id));
      closeAllPopups();
    })
    .catch(err => console.log(err))
    .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    handleTokenCheck();
    if (isLoggedIn) {
      api.getUserInfo()
      .then(res => setCurrentUser(res))
      .catch((err) => console.log(`Возникла ошибка: ${err}`));
      api.getInitialCards()
      .then((res) => {
        setCards(res);
      })
      .catch((err) => console.log(`Возникла ошибка: ${err}`));
    }
  }, [isLoggedIn])

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardLikeCounterClick = (card, values) => {
    setSelectedCard({
      ...values,
      isLikedByPopupOpen: true,
      likes: card.likes
    });
  };

  const handleCardClick = (card, values) => {
    setSelectedCard({
      ...values,
      isImagePopupOpen: true,
      name: card.name,
      link: card.link,
    });
  };

  const hadleCardDeleteClick = (card, values) => {
    setSelectedCard({
      ...values,
      isConfirmationPopupOpen: true,
      id: card._id
    })
  }

  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);

  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);

  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoToolTipOpen(false);
    setSelectedCard(null);
  };

  const handleOverlayClick = (evt) => {
    if (evt.target === evt.currentTarget) {
      closeAllPopups();
    }
  };

  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || isInfoToolTipOpen || selectedCard;

  useEffect(() => {
    function closeByEscape(evt) {
      if(evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if(isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen]);

  const handleUpdateUser = ({ name, about }) => {
    setIsLoading(true);
    api.setUserInfo({ name, about })
    .then(res => {
      setCurrentUser(prevState => ({
        ...prevState,
        name: res.name,
        about: res.about
      }));
      closeAllPopups();
    })
    .catch(err => console.log(err))
    .finally(() => setIsLoading(false));
  }

  const handleUpdateAvatar = ({ avatar }) => {
    setIsLoading(true);
    api.changeAvatar({ avatar })
    .then(res => {
      setCurrentUser(prevState => ({
        ...prevState,
        avatar: res.avatar
      }));
      closeAllPopups();
    })
    .catch(err => console.log(err))
    .finally(() => setIsLoading(false));
  }

  const handleAddPlaceSubmit = ({ name, link }) => {
    setIsLoading(true);
    api.uploadNewCard({ name, link })
    .then(newCard => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch(err => console.log(err))
    .finally(() => setIsLoading(false));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header userEmail={userEmail} onLogOut={handleLogout}/>
        <Switch>
          <Route path="/sign-in">
            <Login
              onLogin={handleLogin}
              isLoading={isLoading}
            />
          </Route>
          <Route path="/sign-up">
            <Register
              onRegister={handleRegister}
              isLoading={isLoading}
            />
          </Route>
          <ProtectedRoute
            exact
            path="/"
            isLoggedIn={isLoggedIn}
            component={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={hadleCardDeleteClick}
            onShowLikedBy={handleCardLikeCounterClick}
          />
          </Switch>
          {isLoggedIn && <Footer />}
          <InfoTooltip
            isOpen={isInfoToolTipOpen}
            isSuccessful={isRegistrationSuccessful}
            onClose={closeAllPopups}
            onOverlay={handleOverlayClick}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onOverlay={handleOverlayClick}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onOverlay={handleOverlayClick}
            onAddPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
          />
          <ConfirmationPopup
            isOpen={selectedCard !== null ? selectedCard.isConfirmationPopupOpen : ""}
            onClose={closeAllPopups}
            onOverlay={handleOverlayClick}
            onCardDelete={handleCardDelete}
            cardId={selectedCard !== null ? selectedCard.id : ""}
            isLoading={isLoading}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onOverlay={handleOverlayClick}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />
          <ImagePopup
            name={selectedCard !== null ? selectedCard.name : ""}
            link={selectedCard !== null ? selectedCard.link : ""}
            isOpen={selectedCard !== null ? selectedCard.isImagePopupOpen : ""}
            onClose={closeAllPopups}
            onOverlay={handleOverlayClick}
          />
          <LikedByPopup
            isOpen={selectedCard !== null ? selectedCard.isLikedByPopupOpen : ""}
            onClose={closeAllPopups}
            likes={selectedCard !== null ? selectedCard.likes : ""}
            onOverlay={handleOverlayClick}
          />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
