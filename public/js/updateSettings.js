// Get dom element
const form = document.getElementById("user-form");

const formPassword = document.getElementById("password-form");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    updateData(form, "data");
  });
}

if (formPassword) {
  formPassword.addEventListener("submit", async function (e) {
    e.preventDefault();
    const passwordCurrent = document.getElementById(
      "password-current"
    ).value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById(
      "password-confirm"
    ).value;

    document.querySelector(".btn-password-update").innerHTML =
      "Updating...";

    await updateData(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );

    document.querySelector(".btn-password-update").innerHTML =
      "SAVE PASSWORD";

    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

const updateData = async (data, type) => {
  try {
    const url =
      type === "data"
        ? "/api/v1/users/updateMe"
        : "/api/v1/users/updateMyPassword";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showNotification(
        "success",
        `${type === "data" ? "DATA" : "PASSWORD"} has been updated`
      );
    }
  } catch (err) {
    showNotification("error", err.response.data.message);
  }
};

const hideNotification = () => {
  const alert = document.querySelector(".alert");
  if (alert) {
    alert.parentElement.removeChild(alert);
  }
};

const showNotification = (type, msg) => {
  hideNotification();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document
    .querySelector("body")
    .insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideNotification, 1000);
};
