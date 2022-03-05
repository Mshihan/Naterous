document.getElementById("logout").addEventListener("click", function (e) {
  logout();
});

const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:3000/api/v1/users/logout",
    });

    if (res.data.status === "success") location.reload(true);
  } catch (err) {
    showSync("error", "Error logging out! Try again");
    console.log(err);
  }
};

const hideSync = () => {
  const alert = document.querySelector(".alert");
  if (alert) {
    alert.parentElement.removeChild(alert);
  }
};

const showSync = (type, msg) => {
  hideSync();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideSync, 1000);
};
