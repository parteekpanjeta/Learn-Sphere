(() => {
  const currentUserKey = "learnsphere_currentUser";
  const navLinks = [
    ["Home", "index.html"],
    ["Courses", "courses.html"],
    ["Faculty", "instructors.html"],
    ["Contact", "contact.html"]
  ];

  function getCurrentUser() {
    try {
      const savedUser = window.localStorage.getItem(currentUserKey);
      if (!savedUser) return null;
      const user = JSON.parse(savedUser);
      if (!user || typeof user.name !== "string" || !user.name.trim()) return null;
      return user;
    } catch {
      return null;
    }
  }

  function getPageName(href) {
    return (href || "").split(/[?#]/, 1)[0].split("/").pop().toLowerCase();
  }

  function ensureNavLink(nav, label, href) {
    let link = Array.from(nav.querySelectorAll(":scope > a")).find((anchor) =>
      getPageName(anchor.getAttribute("href")) === href.toLowerCase()
    );

    if (!link) {
      link = document.createElement("a");
      nav.append(link);
    }

    link.href = href;
    link.textContent = label;
    return link;
  }

  function ensureActionLink(actions, href, label, className) {
    let link = Array.from(actions.children).find((child) =>
      child.tagName === "A" && getPageName(child.getAttribute("href")) === href.toLowerCase()
    );

    if (!link) {
      link = document.createElement("a");
      actions.append(link);
    }

    link.href = href;
    link.textContent = label;
    link.classList.add("button", "auth-action", className);
    return link;
  }

  function buildProfileDropdown(profileMenu, user) {
    const dropdown = profileMenu.querySelector(".profile-dropdown");
    const accountLink = document.createElement("a");
    const coursesLink = document.createElement("a");
    const logoutButton = document.createElement("button");

    accountLink.className = "profile-dropdown-link";
    accountLink.href = "my-account.html";
    accountLink.textContent = "My Account";

    coursesLink.className = "profile-dropdown-link";
    coursesLink.href = "my-courses.html";
    coursesLink.textContent = "My Courses";

    logoutButton.className = "profile-logout";
    logoutButton.type = "button";
    logoutButton.textContent = "Logout";
    logoutButton.addEventListener("click", () => {
      if (typeof window.logoutUser === "function") window.logoutUser();
    });

    dropdown.replaceChildren(accountLink, coursesLink, logoutButton);
    dropdown.setAttribute("aria-label", `${user.name}'s account menu`);
  }

  document.querySelectorAll(".site-header").forEach((header) => {
    const nav = header.querySelector(".main-nav");
    const actions = header.querySelector(".header-actions");
    if (!nav || !actions) return;

    const standardLinks = navLinks.map(([label, href]) => ensureNavLink(nav, label, href));

    let accountLink = nav.querySelector(".account-nav-link");
    if (!accountLink) {
      accountLink = document.createElement("a");
      accountLink.className = "account-nav-link";
      accountLink.textContent = "My Account";
      nav.append(accountLink);
    }
    accountLink.href = "login.html";
    accountLink.textContent = "My Account";

    // Keep one consistent set of navigation items on every page. This also
    // removes page-specific links that are available from the profile menu.
    nav.replaceChildren(...standardLinks, accountLink);

    const loginLink = ensureActionLink(actions, "login.html", "Log in", "auth-login");
    const joinLink = ensureActionLink(actions, "signup.html", "Join", "auth-join");
    const profileMenu = actions.querySelector(".profile-menu");

    if (!profileMenu) return;

    const themeSwitch = actions.querySelector(".theme-switch");
    if (themeSwitch) {
      actions.insertBefore(loginLink, themeSwitch.nextSibling);
      actions.insertBefore(joinLink, loginLink.nextSibling);
    }
    actions.append(profileMenu);

    const user = getCurrentUser();
    const isLoggedIn = Boolean(user);
    accountLink.hidden = isLoggedIn;
    loginLink.hidden = isLoggedIn;
    joinLink.hidden = isLoggedIn;
    profileMenu.hidden = !isLoggedIn;
    profileMenu.classList.toggle("is-authenticated", isLoggedIn);

    if (!isLoggedIn) return;

    const avatar = profileMenu.querySelector(".profile-avatar");
    const name = profileMenu.querySelector(".profile-name");
    const summary = profileMenu.querySelector("summary");
    avatar.classList.add("profile-avatar-initial");
    avatar.textContent = user.name.trim().slice(0, 1).toUpperCase();
    name.textContent = user.name.trim();
    summary.setAttribute("aria-label", `Open ${user.name.trim()}'s profile menu`);
    buildProfileDropdown(profileMenu, user);

    document.addEventListener("click", (event) => {
      if (profileMenu.open && !profileMenu.contains(event.target)) profileMenu.open = false;
    });
  });
})();
