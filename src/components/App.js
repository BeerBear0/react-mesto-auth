import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import PopupWithForm from "./PopupWithForm";
import { api } from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App()
{

    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);

    React.useEffect(() => {
        Promise.all([api.getInitialCards(), api.getUserInfo()])
            .then(([cardsData, userData]) => {
            setCards(cardsData);
            setCurrentUser(userData);
        })
            .catch(err => console.log(err))
    }, [])

        function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, isLiked)
            .then(newCard => {
                setCards(state => state.map(c => c._id === card._id ? newCard : c));
            })
            .catch(err => console.error(err));
    }
    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then(_ => {
                setCards(state => {
                    return state.filter(c => c._id !== card._id);
                })
            }).catch(err => console.error(err));
    }

    function  handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true)
    }
    function  handleEditProfileClick() {
       setIsEditProfilePopupOpen(true)
    }
    function  handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true)
    }

    function handleCardClick (card)  {
        setSelectedCard(card)
    }

    function closeAllPopup() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setSelectedCard(false)
    }

    function handleUpdateUser({name, about}) {
        api.patchUserProfile({name, about})
            .then(res => {
                setCurrentUser(res);
                closeAllPopup();
            }).catch(err => console.error(err));
    }

    function handleUpdateAvatar({avatar}) {
        api.patchAvatar({avatar})
            .then(res => {
                setCurrentUser(res);
                closeAllPopup();
            })
            .catch(err => console.error(err));
    }

    function handleAddPlaceSubmit({name, link}) {

        api.postUserCard({name, link})
            .then(card => {
                setCards([card, ...cards])
                closeAllPopup();
            })
            .catch(err => console.log(err));
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className='root' >
                <Header />
                <Main
                    cards={cards}
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}

                />
                <Footer />


                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopup}
                    onUpdateUser={handleUpdateUser} />

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopup}
                    onAddPlace={handleAddPlaceSubmit} />

                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopup}
                    onUpdateAvatar={handleUpdateAvatar} />

                <PopupWithForm
                    title="ВЫ уверены?"
                    name="delete-card"
                    btnText="Да" />


                {selectedCard && <ImagePopup
                    name={`open-imagePopup`}
                    card={selectedCard}
                    // isOpen={isImagePopupOpen}
                    onClose={closeAllPopup}
                />}
            </div>
        </CurrentUserContext.Provider>

    );
}
export default App;