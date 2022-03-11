var stripe = Stripe(
  "pk_test_51Kc5qYGmocYmPMrX4I2TLsrpj1NDr3LpQHYw6Kf1AbJa78bTjJu9GgvkLIdzYVsKcVnFOG1X9eA17wzKf1N7ucCO00MkS8yrfd"
);

const bookBtn = document.getElementById("bookTour");

if (bookBtn) {
  bookBtn.addEventListener("click", function (e) {
    console.log("clicked");
    e.target.textContent = "Processing...";
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

const bookTour = async (tourId) => {
  try {
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert("error", err);
  }
};

const showMessage = (type, msg) => {
  hideMessage();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document
    .querySelector("body")
    .insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideMessage, 1000);
};

const hideMessage = () => {
  const alert = document.querySelector(".alert");
  if (alert) {
    alert.parentElement.removeChild(alert);
  }
};
