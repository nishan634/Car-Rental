(function () {
  "use strict";

  // Theme constants used across all pages.
  var THEME_KEY = "carGoTheme";
  var DARK_THEME = "dark";
  var LIGHT_THEME = "light";

  // Reads persisted theme preference safely.
  function readStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  // Persists theme preference; fail silently if storage is unavailable.
  function writeStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
    }
  }

  // Resolves initial theme from saved preference or system preference.
  function getInitialTheme() {
    var savedTheme = readStoredTheme();
    if (savedTheme === DARK_THEME || savedTheme === LIGHT_THEME) {
      return savedTheme;
    }

    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? DARK_THEME : LIGHT_THEME;
  }

  // Applies theme attributes and updates toggle icon/labels.
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    writeStoredTheme(theme);
    updateToggleState(theme);
  }

  // Keeps all theme-toggle buttons and icons in sync.
  function updateToggleState(theme) {
    var toggles = document.querySelectorAll("[data-theme-toggle]");

    toggles.forEach(function (toggle) {
      var icon = toggle.querySelector("[data-theme-icon]");
      var isDark = theme === DARK_THEME;

      toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      toggle.setAttribute("title", isDark ? "Light mode" : "Dark mode");

      if (!icon) {
        return;
      }

      icon.classList.remove("bi-moon-stars-fill", "bi-sun-fill");
      icon.classList.add(isDark ? "bi-sun-fill" : "bi-moon-stars-fill");
    });
  }

  // Wires click handlers for all theme toggle buttons.
  function bindThemeToggle() {
    var toggles = document.querySelectorAll("[data-theme-toggle]");

    toggles.forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        var currentTheme = document.documentElement.getAttribute("data-theme") || LIGHT_THEME;
        var nextTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        applyTheme(nextTheme);
      });
    });
  }

  // Entry point for every page that includes theme.js.
  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(getInitialTheme());
    bindThemeToggle();
  });
})();
