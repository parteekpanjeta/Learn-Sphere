(() => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const captchaDisplay = document.querySelector("#captcha-code");
  const captchaInput = document.querySelector("#captcha-input");
  const refreshButton = document.querySelector("#captcha-refresh");
  const captchaMessage = document.querySelector("#signup-message, #login-message");

  if (!captchaDisplay || !captchaInput || !refreshButton) return;

  let currentCaptcha = "";

  function randomIndex(max) {
    if (window.crypto && typeof window.crypto.getRandomValues === "function") {
      try {
        const range = 0x100000000;
        const limit = range - (range % max);
        const value = new Uint32Array(1);
        do {
          window.crypto.getRandomValues(value);
        } while (value[0] >= limit);
        return value[0] % max;
      } catch {
        // Use Math.random when secure browser randomness is unavailable.
      }
    }

    return Math.floor(Math.random() * max);
  }

  function generateCaptcha() {
    currentCaptcha = Array.from({ length: 6 }, () => characters[randomIndex(characters.length)]).join("");
    captchaDisplay.textContent = currentCaptcha;
    captchaInput.value = "";
    if (captchaMessage?.textContent === "Incorrect CAPTCHA. Please try again.") {
      captchaMessage.hidden = true;
    }
    return currentCaptcha;
  }

  refreshButton.addEventListener("click", () => {
    generateCaptcha();
    captchaInput.focus();
  });

  window.LearnSphereCaptcha = Object.freeze({
    verify(value) {
      return String(value ?? "").trim().toUpperCase() === currentCaptcha;
    },
    refresh: generateCaptcha
  });

  generateCaptcha();
})();
