import profileSrc from "../images/avatar.jpg";
import logoSrc from "../images/logo.svg";
import pencilSrc from "../images/pencil.svg";
import plusSrc from "../images/plus.svg";
import pencilLightSrc from "../images/pencil-light.svg";
import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "3966d937-8ddd-4770-ad56-2605651ef4a4",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    profileName.textContent = userData.name;
    profileDesc.textContent = userData.about;
    profileImg.src = userData.avatar;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

const profileImg = document.getElementById("profile-avatar");
profileImg.src = profileSrc;
const logoImg = document.getElementById("logo-img");
logoImg.src = logoSrc;
const pencilImg = document.getElementById("pencil-img");
pencilImg.src = pencilSrc;
const plusImg = document.getElementById("plus-img");
plusImg.src = plusSrc;
const pencilLightImg = document.getElementById("pencil-light");
pencilLightImg.src = pencilLightSrc;

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDesc = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardFormElement = cardModal.querySelector(".modal__form");
const cardModalSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardModalNameInput = cardModal.querySelector("#add-card-name-input");
const cardModalLinkInput = cardModal.querySelector("#add-card-link-input");

const avatarModal = document.querySelector("#avatar-modal");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarModalSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarModalLinkInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteFormElement = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteModalCancelBtn = deleteModal.querySelector(
  ".modal__submit-btn_type_secondary"
);
let cardToDelete = null;

const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImgEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImgEl.alt = data.name;
  cardImgEl.src = data.link;
  cardElement.dataset.cardId = data._id;
  cardElement.dataset.like = data.isLiked;
  if (cardElement.dataset.like === "true") {
    cardLikeBtn.classList.add("card__like-btn_liked");
  } else {
    cardLikeBtn.classList.remove("card__like-btn_liked");
  }

  cardLikeBtn.addEventListener("click", () => {
    const cardLike = JSON.parse(cardElement.dataset.like);
    api
      .handleLike(cardElement.dataset.cardId, cardLike)
      .then((data) => {
        if (data.isLiked) {
          cardLikeBtn.classList.add("card__like-btn_liked");
          cardElement.dataset.like = "true";
        } else {
          cardLikeBtn.classList.remove("card__like-btn_liked");
          cardElement.dataset.like = "false";
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

  cardImgEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImgEl.src = data.link;
    previewModalImgEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardToDelete = cardElement;
    openModal(deleteModal);
  });

  return cardElement;
}

deleteFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const deleteBtn = evt.submitter;
  const originalButtonText = deleteBtn.textContent;
  deleteBtn.textContent = "Deleting...";
  const cardId = cardToDelete.dataset.cardId;

  api
    .deleteCard(cardId)
    .then((data) => {
      cardToDelete.remove();
      closeModal(deleteModal);
      cardToDelete = null;
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      deleteBtn.textContent = originalButtonText;
    });
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

function keyHandler(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", keyHandler);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", keyHandler);
}

function handleEditFormSubmit(event) {
  event.preventDefault();
  const submitButton = editFormElement.querySelector(".modal__submit-btn");
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescInput.value,
    })
    .then((userData) => {
      profileName.textContent = userData.name;
      profileDesc.textContent = userData.about;
      closeModal(editModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
    });
}

function handleAddCardSubmit(event) {
  event.preventDefault();
  const submitButton = cardFormElement.querySelector(".modal__submit-btn");
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = "Creating...";

  api
    .createCard({
      name: cardModalNameInput.value,
      link: cardModalLinkInput.value,
    })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      event.target.reset();
      closeModal(cardModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
    });
}

function handleAvatarSubmit(event) {
  event.preventDefault();
  const avatarSubmitButton =
    avatarFormElement.querySelector(".modal__submit-btn");
  const originalButtonText = avatarSubmitButton.textContent;
  avatarSubmitButton.textContent = "Saving...";
  api
    .editAvatarInfo({ avatar: avatarModalLinkInput.value })
    .then((data) => {
      profileImg.src = data.avatar;
      event.target.reset();
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      avatarSubmitButton.textContent = originalButtonText;
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescInput.value = profileDesc.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescInput],
    settings
  );
  openModal(editModal);
});
editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

const popups = document.querySelectorAll(".modal");

popups.forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal_opened")) {
      closeModal(popup);
    }
  });
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});
cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});
previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarFormElement.addEventListener("submit", handleAvatarSubmit);
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardFormElement.addEventListener("submit", handleAddCardSubmit);

enableValidation(settings);
