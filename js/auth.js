(function () {
  "use strict";

  // Shared localStorage keys for user records and session state.
  var STORAGE_KEYS = {
    USERS: "carGoUsers",
    IS_LOGGED_IN: "carGoLoggedIn",
    CURRENT_USER: "carGoCurrentUser"
  };

  // Safely parses JSON from localStorage with fallback support.
  function parseStoredJSON(key, fallbackValue) {
    var rawValue = localStorage.getItem(key);

    if (!rawValue) {
      return fallbackValue;
    }

    try {
      return JSON.parse(rawValue);
    } catch (error) {
      return fallbackValue;
    }
  }

  // Ensures users store always exists as an array.
  function initializeUsersStore() {
    var users = parseStoredJSON(STORAGE_KEYS.USERS, []);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // Utility getters/setters for user list.
  function getUsers() {
    return parseStoredJSON(STORAGE_KEYS.USERS, []);
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // Normalizes email for case-insensitive comparisons.
  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  // Session helpers.
  function isLoggedIn() {
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === "true";
  }

  function setSession(user) {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true");
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify({
        name: user.name,
        email: user.email
      })
    );
  }

  // Redirects already-authenticated users away from auth pages.
  function redirectForAuthenticatedUser() {
    if (!isLoggedIn()) {
      return;
    }

    window.location.href = "index.html";
  }

  // Shared Bootstrap validation handler.
  function attachBaseValidation(form) {
    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    });
  }

  // Register flow: validate, prevent duplicate emails, and store account.
  function bindRegisterForm() {
    var registerForm = document.getElementById("registerForm");
    if (!registerForm) {
      return;
    }

    attachBaseValidation(registerForm);

    registerForm.addEventListener("submit", function (event) {
      var nameInput = document.getElementById("registerName");
      var emailInput = document.getElementById("registerEmail");
      var passwordInput = document.getElementById("registerPassword");
      var confirmPasswordInput = document.getElementById("registerConfirmPassword");

      confirmPasswordInput.setCustomValidity("");
      emailInput.setCustomValidity("");

      if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity("Passwords do not match.");
      }

      if (!registerForm.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        registerForm.classList.add("was-validated");
        return;
      }

      var users = getUsers();
      var email = normalizeEmail(emailInput.value);
      var emailAlreadyExists = users.some(function (user) {
        return normalizeEmail(user.email) === email;
      });

      if (emailAlreadyExists) {
        event.preventDefault();
        event.stopPropagation();
        emailInput.setCustomValidity("This email is already registered.");
        registerForm.classList.add("was-validated");
        return;
      }

      users.push({
        name: String(nameInput.value || "").trim(),
        email: email,
        password: passwordInput.value
      });

      saveUsers(users);

      event.preventDefault();
      window.location.href = "login.html";
    });
  }

  // Login flow: validate credentials and create session.
  function bindLoginForm() {
    var loginForm = document.getElementById("loginForm");
    if (!loginForm) {
      return;
    }

    attachBaseValidation(loginForm);

    loginForm.addEventListener("submit", function (event) {
      var emailInput = document.getElementById("loginEmail");
      var passwordInput = document.getElementById("loginPassword");

      emailInput.setCustomValidity("");
      passwordInput.setCustomValidity("");

      if (!loginForm.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        loginForm.classList.add("was-validated");
        return;
      }

      var email = normalizeEmail(emailInput.value);
      var users = getUsers();
      var matchedUser = users.find(function (user) {
        return normalizeEmail(user.email) === email && user.password === passwordInput.value;
      });

      if (!matchedUser) {
        event.preventDefault();
        event.stopPropagation();
        passwordInput.setCustomValidity("Invalid email or password.");
        loginForm.classList.add("was-validated");
        return;
      }

      setSession(matchedUser);

      event.preventDefault();
      window.location.href = "index.html";
    });
  }

  // Entry point for auth pages.
  document.addEventListener("DOMContentLoaded", function () {
    initializeUsersStore();
    bindRegisterForm();
    bindLoginForm();

    redirectForAuthenticatedUser();
  });
})();
