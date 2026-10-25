(() => {
  const usersStorageKey = "learnsphere_users";
  const currentUserStorageKey = "learnsphere_currentUser";
  const form = document.querySelector("#login-form");
  if (!form) return;

  const emailInput = form.querySelector("#email");
  const passwordInput = form.querySelector("#password");
  const captchaInput = form.querySelector("#captcha-input");
  const message = form.querySelector("#login-message");
  const submitButton = form.querySelector('[type="submit"]');
  const sampleUsersFallback = [
    {
      id: "sample-user-001",
      name: "Sample Learner",
      email: "sample@learnsphere.edu",
      password: "LearnSphere123"
    }
  ];

  function showMessage(text) {
    message.textContent = text;
    message.dataset.state = "error";
    message.hidden = false;
  }

  async function loadUsers() {
    const savedUsers = window.localStorage.getItem(usersStorageKey);
    if (savedUsers !== null) {
      const users = JSON.parse(savedUsers);
      if (!Array.isArray(users)) throw new Error("Saved user data is invalid.");
      if (users.length > 0) return users;
    }

    let users = sampleUsersFallback;
    try {
      const response = await fetch("../data/users.json", { cache: "no-store" });
      if (response.ok) {
        const initialUsers = await response.json();
        if (Array.isArray(initialUsers)) users = initialUsers;
      }
    } catch {
      // The sample user keeps local signup/login usable if JSON fetch is blocked by file://.
    }

    window.localStorage.setItem(usersStorageKey, JSON.stringify(users));
    return users;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.hidden = true;

    if (!window.LearnSphereCaptcha || !window.LearnSphereCaptcha.verify(captchaInput.value)) {
      window.LearnSphereCaptcha?.refresh();
      showMessage("Incorrect CAPTCHA. Please try again.");
      captchaInput.focus();
      return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
      showMessage("Invalid email or password.");
      return;
    }

    submitButton.disabled = true;

    try {
      const users = await loadUsers();
      const matchingUser = users.find((user) =>
        user && typeof user.email === "string" &&
        user.email.trim().toLowerCase() === email && user.password === password
      );

      if (!matchingUser) {
        showMessage("Invalid email or password.");
        submitButton.disabled = false;
        return;
      }

      const currentUser = {
        id: matchingUser.id,
        name: matchingUser.name,
        email: matchingUser.email.trim().toLowerCase()
      };
      window.localStorage.setItem(currentUserStorageKey, JSON.stringify(currentUser));
      window.location.href = "index.html";
    } catch {
      showMessage("Unable to load account data. Please try again.");
      submitButton.disabled = false;
    }
  });
})();
