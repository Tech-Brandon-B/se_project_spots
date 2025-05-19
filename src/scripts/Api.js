class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "3966d937-8ddd-4770-ad56-2605651ef4a4",
      },
    });
  }

  // other methods for working with the API
}
