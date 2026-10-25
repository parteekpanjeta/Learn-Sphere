(() => {
  const usersStorageKey = "learnsphere_users";
  const currentUserStorageKey = "learnsphere_currentUser";
  function logoutUser() {
    try {
      window.localStorage.removeItem(currentUserStorageKey);
    } catch {
      // Returning to login still works when browser storage is unavailable.
    }

    window.location.href = "login.html";
  }

  window.logoutUser = logoutUser;

  const form = document.querySelector("#signup-form");
  if (!form) return;

  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#email");
  const passwordInput = form.querySelector("#password");
  const confirmInput = form.querySelector("#confirm");
  const termsInput = form.querySelector("#terms");
  const captchaInput = form.querySelector("#captcha-input");
  const message = form.querySelector("#signup-message");
  const submitButton = form.querySelector('[type="submit"]');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const sampleUsersFallback = [
    {
      id: "sample-user-001",
      name: "Sample Learner",
      email: "sample@learnsphere.edu",
      password: "LearnSphere123"
    }
  ];

  function showMessage(text, state) {
    message.textContent = text;
    message.dataset.state = state;
    message.hidden = false;
  }

  function makeUserId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `user-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  async function loadUsers() {
    const savedUsers = window.localStorage.getItem(usersStorageKey);
    if (savedUsers !== null) {
      const users = JSON.parse(savedUsers);
      if (!Array.isArray(users)) throw new Error("Saved user data is invalid.");
      return users;
    }

    let users = sampleUsersFallback;
    try {
      const response = await fetch("../data/users.json", { cache: "no-store" });
      if (response.ok) {
        const initialUsers = await response.json();
        if (Array.isArray(initialUsers)) users = initialUsers;
      }
    } catch {
      // The sample user keeps signup usable when the page is opened without a local web server.
    }

    window.localStorage.setItem(usersStorageKey, JSON.stringify(users));
    return users;
  }

  function validate({ name, email, password, confirmPassword, termsAccepted }) {
    if (!name) return "Please enter your full name.";
    if (!email) return "Please enter your email address.";
    if (!emailPattern.test(email)) return "Please enter a valid email address.";
    if (!password) return "Please enter a password.";
    if (password.length < 8) return "Your password must be at least 8 characters long.";
    if (!confirmPassword) return "Please confirm your password.";
    if (password !== confirmPassword) return "Your passwords do not match.";
    if (!termsAccepted) return "Please accept the terms and conditions to continue.";
    return "";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.hidden = true;

    const values = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim().toLowerCase(),
      password: passwordInput.value,
      confirmPassword: confirmInput.value,
      termsAccepted: termsInput.checked
    };

    const validationMessage = validate(values);
    if (validationMessage) {
      showMessage(validationMessage, "error");
      return;
    }

    if (!window.LearnSphereCaptcha || !window.LearnSphereCaptcha.verify(captchaInput.value)) {
      window.LearnSphereCaptcha?.refresh();
      showMessage("Incorrect CAPTCHA. Please try again.", "error");
      captchaInput.focus();
      return;
    }

    submitButton.disabled = true;

    try {
      const users = await loadUsers();
      const emailExists = users.some((user) =>
        typeof user.email === "string" && user.email.trim().toLowerCase() === values.email
      );

      if (emailExists) {
        showMessage("An account with this email already exists.", "error");
        submitButton.disabled = false;
        return;
      }

      const newUser = {
        id: makeUserId(),
        name: values.name,
        email: values.email,
        password: values.password
      };

      users.push(newUser);
      window.localStorage.setItem(usersStorageKey, JSON.stringify(users));

      const currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      window.localStorage.setItem(currentUserStorageKey, JSON.stringify(currentUser));

      showMessage("Your account has been created. Welcome to LearnSphere!", "success");
      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
    } catch {
      showMessage("We could not save your account. Please try again.", "error");
      submitButton.disabled = false;
    }
  });
})();
