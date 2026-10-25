const savedThemeKey = "learnsphere-theme";
const themeToggle = document.querySelector("#theme-toggle");

if (themeToggle) {
  try {
    themeToggle.checked = window.localStorage.getItem(savedThemeKey) === "dark";
  } catch {
    themeToggle.checked = false;
  }

  themeToggle.addEventListener("change", () => {
    try {
      window.localStorage.setItem(savedThemeKey, themeToggle.checked ? "dark" : "light");
    } catch {
      // The toggle still works for this page when browser storage is unavailable.
    }
  });
}

document.querySelectorAll("[data-logout]").forEach((button) => {
  button.addEventListener("click", () => {
    try {
      window.localStorage.removeItem("learnsphere-user");
    } catch {
      // Navigation to the login page still works when browser storage is unavailable.
    }

    window.location.href = "login.html?logged-out=1";
  });
});

const logoutNotice = document.querySelector("#logout-notice");
if (logoutNotice && new URLSearchParams(window.location.search).get("logged-out") === "1") {
  logoutNotice.hidden = false;
}
