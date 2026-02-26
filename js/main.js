(function () {
  "use strict";

  // Centralized DOM selectors used across homepage features.
  var SELECTORS = {
    sectionAnchorLinks: 'a[href^="#"]',
    navbar: ".cargo-navbar",
    navbarCollapse: "navbarMenu",
    joinModal: "joinNowModal",
    joinForm: "joinMembershipForm",
    memberPlan: "memberPlan",
    memberName: "memberName",
    joinModalTriggers: '[data-bs-target="#joinNowModal"]',
    carDetailsModal: "carDetailsModal",
    carDetailsTitle: "carDetailsModalLabel",
    carSpecsList: "carSpecsList",
    carDetailsButtons: 'button[aria-label^="View details of"]',
    carCards: ".car-card",
    bookingModal: "bookingModal",
    bookingForm: "bookingForm",
    bookingCarName: "bookingCarName",
    bookingDailyPrice: "bookingDailyPrice",
    selectedCarName: "selectedCarName",
    selectedCarPrice: "selectedCarPrice",
    pickupDate: "pickupDate",
    dropoffDate: "dropoffDate",
    bookingDays: "bookingDays",
    bookingTotal: "bookingTotal",
    bookNowButton: ".book-now-btn",
    bookingSuccessToast: "bookingSuccessToast",
    bookingToastMessage: "bookingToastMessage"
  };

  // Initialize all homepage behaviors when DOM is ready.
  document.addEventListener("DOMContentLoaded", function () {
    initializeSmoothScrolling();
    initializeJoinModalBehavior();
    initializeCarCardsEnhancements();
    initializeCarDetailsModal();
    initializeBookingFlow();
  });

  // Enhances each car card with star ratings and a Book Now button.
  function initializeCarCardsEnhancements() {
    var carCards = document.querySelectorAll(SELECTORS.carCards);
    if (!carCards.length) {
      return;
    }

    var ratingByCar = {
      "Toyota Fortuner": 4.7,
      "Mahindra XUV700": 4.6,
      "Jeep Meridian": 4.5,
      "MG Gloster": 4.4,
      "BMW Z4": 4.8,
      "Toyota Supra": 4.7,
      "Ford Mustang GT": 4.8,
      "Nissan 370Z": 4.5,
      "Ferrari F8 Tributo": 4.9,
      "Lamborghini Huracán": 4.9,
      "McLaren 720S": 4.8,
      "Porsche 911 Turbo S": 4.9
    };

    carCards.forEach(function (card) {
      var cardBody = card.querySelector(".card-body");
      var carNameNode = card.querySelector("h4, h3");
      var priceNode = card.querySelector("p");
      var viewDetailsButton = card.querySelector('button[aria-label^="View details of"]');

      if (!cardBody || !carNameNode || !priceNode || !viewDetailsButton) {
        return;
      }

      var carName = String(carNameNode.textContent || "").trim();
      var carPriceText = String(priceNode.textContent || "").trim();
      var ratingValue = ratingByCar[carName] || 4.5;

      if (!cardBody.querySelector(".car-rating")) {
        var ratingContainer = document.createElement("section");
        ratingContainer.className = "car-rating mb-3";
        ratingContainer.setAttribute("aria-label", "Customer rating");
        ratingContainer.innerHTML = buildStarsMarkup(ratingValue) + '<span class="rating-value">' + ratingValue.toFixed(1) + '</span>';
        priceNode.insertAdjacentElement("afterend", ratingContainer);
      }

      if (!cardBody.querySelector(".car-actions")) {
        viewDetailsButton.classList.remove("mt-auto");

        var actionsContainer = document.createElement("section");
        actionsContainer.className = "car-actions mt-auto d-grid gap-2";

        var bookNowButton = document.createElement("button");
        bookNowButton.type = "button";
        bookNowButton.className = "btn btn-primary book-now-btn";
        bookNowButton.textContent = "Book Now";
        bookNowButton.setAttribute("aria-label", "Book " + carName + " now");
        bookNowButton.setAttribute("data-car-name", carName);
        bookNowButton.setAttribute("data-car-price", extractPriceValue(carPriceText));

        viewDetailsButton.classList.add("btn-outline-primary");

        actionsContainer.appendChild(viewDetailsButton);
        actionsContainer.appendChild(bookNowButton);
        cardBody.appendChild(actionsContainer);
      }
    });
  }

  // Opens the car details modal and injects per-car specs dynamically.
  function initializeCarDetailsModal() {
    var detailsModalEl = document.getElementById(SELECTORS.carDetailsModal);
    var titleEl = document.getElementById(SELECTORS.carDetailsTitle);
    var specsListEl = document.getElementById(SELECTORS.carSpecsList);
    var detailButtons = document.querySelectorAll(SELECTORS.carDetailsButtons);

    if (!detailsModalEl || !titleEl || !specsListEl || !detailButtons.length) {
      return;
    }

    // Lookup table used to render model-specific specs in modal.
    var carSpecsByName = {
      "Toyota Fortuner": [
        "Engine: 2.8L Diesel",
        "Power: 201 bhp",
        "Transmission: 6-Speed Automatic",
        "Drive Type: 4x4",
        "Seating Capacity: 7",
        "Mileage: 12-14 km/l",
        "Fuel Tank: 80L",
        "Safety: 7 Airbags + ABS + ESC"
      ],
      "Mahindra XUV700": [
        "Engine: 2.2L Turbo Diesel",
        "Power: 182 bhp",
        "Transmission: 6-Speed Automatic",
        "Drive Type: AWD",
        "Seating Capacity: 7",
        "Mileage: 13-15 km/l",
        "Fuel Tank: 60L",
        "Safety: ADAS + 7 Airbags"
      ],
      "Jeep Meridian": [
        "Engine: 2.0L Multijet Diesel",
        "Power: 168 bhp",
        "Transmission: 9-Speed Automatic",
        "Drive Type: 4x4",
        "Seating Capacity: 7",
        "Mileage: 12-14 km/l",
        "Fuel Tank: 60L",
        "Safety: 6 Airbags + Terrain Modes"
      ],
      "MG Gloster": [
        "Engine: 2.0L Twin-Turbo Diesel",
        "Power: 215 bhp",
        "Transmission: 8-Speed Automatic",
        "Drive Type: 4WD",
        "Seating Capacity: 6/7",
        "Mileage: 12-13 km/l",
        "Fuel Tank: 75L",
        "Safety: ADAS + 6 Airbags"
      ],
      "BMW Z4": [
        "Engine: 3.0L TwinPower Turbo",
        "Power: 335 bhp",
        "Transmission: 8-Speed Sport Automatic",
        "Drive Type: RWD",
        "Seating Capacity: 2",
        "Top Speed: 250 km/h",
        "0-100 km/h: 4.5s",
        "Fuel Tank: 52L"
      ],
      "Toyota Supra": [
        "Engine: 3.0L Turbocharged Petrol",
        "Power: 335 bhp",
        "Transmission: 8-Speed Automatic",
        "Drive Type: RWD",
        "Seating Capacity: 2",
        "Top Speed: 250 km/h",
        "0-100 km/h: 4.3s",
        "Fuel Tank: 52L"
      ],
      "Ford Mustang GT": [
        "Engine: 5.0L V8 Petrol",
        "Power: 450 bhp",
        "Transmission: 10-Speed Automatic",
        "Drive Type: RWD",
        "Seating Capacity: 4",
        "Top Speed: 250 km/h",
        "0-100 km/h: 4.2s",
        "Fuel Tank: 61L"
      ],
      "Nissan 370Z": [
        "Engine: 3.7L V6 Petrol",
        "Power: 332 bhp",
        "Transmission: 7-Speed Automatic",
        "Drive Type: RWD",
        "Seating Capacity: 2",
        "Top Speed: 250 km/h",
        "0-100 km/h: 5.3s",
        "Fuel Tank: 72L"
      ],
      "Ferrari F8 Tributo": [
        "Engine: 3.9L Twin-Turbo V8",
        "Power: 710 bhp",
        "Transmission: 7-Speed DCT",
        "Drive Type: RWD",
        "Seating Capacity: 2",
        "Top Speed: 340 km/h",
        "0-100 km/h: 2.9s",
        "Fuel Tank: 78L"
      ],
      "Lamborghini Huracán": [
        "Engine: 5.2L V10 Petrol",
        "Power: 602 bhp",
        "Transmission: 7-Speed DCT",
        "Drive Type: AWD",
        "Seating Capacity: 2",
        "Top Speed: 325 km/h",
        "0-100 km/h: 3.2s",
        "Fuel Tank: 80L"
      ],
      "McLaren 720S": [
        "Engine: 4.0L Twin-Turbo V8",
        "Power: 710 bhp",
        "Transmission: 7-Speed SSG",
        "Drive Type: RWD",
        "Seating Capacity: 2",
        "Top Speed: 341 km/h",
        "0-100 km/h: 2.9s",
        "Fuel Tank: 72L"
      ],
      "Porsche 911 Turbo S": [
        "Engine: 3.8L Twin-Turbo Flat-6",
        "Power: 640 bhp",
        "Transmission: 8-Speed PDK",
        "Drive Type: AWD",
        "Seating Capacity: 2+2",
        "Top Speed: 330 km/h",
        "0-100 km/h: 2.7s",
        "Fuel Tank: 67L"
      ]
    };

    detailButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var card = button.closest(".car-card");
        if (!card) {
          return;
        }

        var titleNode = card.querySelector("h4, h3");
        if (!titleNode) {
          return;
        }

        var carName = String(titleNode.textContent || "").trim();
        var specs = carSpecsByName[carName] || [
          "Engine: Information available on request",
          "Power: Information available on request",
          "Transmission: Information available on request",
          "Drive Type: Information available on request",
          "Seating Capacity: Information available on request",
          "Top Speed: Information available on request",
          "0-100 km/h: Information available on request",
          "Fuel Tank: Information available on request"
        ];

        titleEl.textContent = carName + " - Specifications";
        specsListEl.innerHTML = "";

        specs.forEach(function (spec) {
          var item = document.createElement("li");
          item.textContent = spec;
          item.className = "mb-2";
          specsListEl.appendChild(item);
        });

        var modalInstance = bootstrap.Modal.getOrCreateInstance(detailsModalEl);
        modalInstance.show();
      });
    });
  }

  // Smooth-scroll behavior for in-page navigation links.
  function initializeSmoothScrolling() {
    var sectionLinks = document.querySelectorAll(SELECTORS.sectionAnchorLinks);
    var navbar = document.querySelector(SELECTORS.navbar);

    sectionLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        var targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        var targetElement = document.querySelector(targetId);
        if (!targetElement) {
          return;
        }

        event.preventDefault();

        var navbarHeight = navbar ? navbar.offsetHeight : 0;
        var targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
        var scrollPosition = Math.max(targetTop - navbarHeight - 8, 0);

        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth"
        });

        if (targetId !== "#") {
          window.history.replaceState(null, "", targetId);
        }

        collapseNavbarOnMobile();
      });
    });
  }

  // Booking modal flow: populate car info, validate dates, and show confirmation.
  function initializeBookingFlow() {
    var bookingModalEl = document.getElementById(SELECTORS.bookingModal);
    var bookingForm = document.getElementById(SELECTORS.bookingForm);
    var bookingCarNameInput = document.getElementById(SELECTORS.bookingCarName);
    var bookingDailyPriceInput = document.getElementById(SELECTORS.bookingDailyPrice);
    var selectedCarName = document.getElementById(SELECTORS.selectedCarName);
    var selectedCarPrice = document.getElementById(SELECTORS.selectedCarPrice);
    var pickupDateInput = document.getElementById(SELECTORS.pickupDate);
    var dropoffDateInput = document.getElementById(SELECTORS.dropoffDate);
    var bookingDays = document.getElementById(SELECTORS.bookingDays);
    var bookingTotal = document.getElementById(SELECTORS.bookingTotal);
    var bookingSuccessToast = document.getElementById(SELECTORS.bookingSuccessToast);
    var bookingToastMessage = document.getElementById(SELECTORS.bookingToastMessage);

    if (!bookingModalEl || !bookingForm) {
      return;
    }

    var today = getTodayISODate();
    if (pickupDateInput) {
      pickupDateInput.min = today;
    }
    if (dropoffDateInput) {
      dropoffDateInput.min = today;
    }

    if (pickupDateInput) {
      enhanceDatePickerAccessibility(pickupDateInput);
    }
    if (dropoffDateInput) {
      enhanceDatePickerAccessibility(dropoffDateInput);
    }

    document.querySelectorAll(SELECTORS.bookNowButton).forEach(function (button) {
      button.addEventListener("click", function () {
        var carName = button.getAttribute("data-car-name") || "Selected Car";
        var dailyPrice = Number(button.getAttribute("data-car-price") || 0);

        if (bookingCarNameInput) {
          bookingCarNameInput.value = carName;
        }
        if (bookingDailyPriceInput) {
          bookingDailyPriceInput.value = String(dailyPrice);
        }
        if (selectedCarName) {
          selectedCarName.textContent = "Selected Car: " + carName;
        }
        if (selectedCarPrice) {
          selectedCarPrice.textContent = "Price: " + formatCurrency(dailyPrice) + "/day";
        }

        var modalInstance = bootstrap.Modal.getOrCreateInstance(bookingModalEl);
        modalInstance.show();
        updateBookingEstimate();
      });
    });

    if (pickupDateInput) {
      pickupDateInput.addEventListener("change", function () {
        if (dropoffDateInput) {
          dropoffDateInput.min = pickupDateInput.value || today;
        }
        updateBookingEstimate();
      });
    }

    if (dropoffDateInput) {
      dropoffDateInput.addEventListener("change", updateBookingEstimate);
    }

    bookingModalEl.addEventListener("hidden.bs.modal", function () {
      bookingForm.reset();
      bookingForm.classList.remove("was-validated");
      if (selectedCarName) {
        selectedCarName.textContent = "Selected Car: --";
      }
      if (selectedCarPrice) {
        selectedCarPrice.textContent = "Price: --";
      }
      if (bookingDays) {
        bookingDays.textContent = "0";
      }
      if (bookingTotal) {
        bookingTotal.textContent = "NPR 0";
      }
      if (pickupDateInput) {
        pickupDateInput.min = today;
      }
      if (dropoffDateInput) {
        dropoffDateInput.min = today;
      }
    });

    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var estimate = calculateBookingEstimate();
      if (!bookingForm.checkValidity() || estimate.days < 1) {
        event.stopPropagation();
        bookingForm.classList.add("was-validated");
        return;
      }

      var modalInstance = bootstrap.Modal.getInstance(bookingModalEl);
      if (modalInstance) {
        modalInstance.hide();
      }

      bookingForm.classList.remove("was-validated");
      showBookingToast(
        "Booking confirmed for " + (bookingCarNameInput ? bookingCarNameInput.value : "your selected car") +
        " for " + estimate.days + " day(s). Estimated total: " + formatCurrency(estimate.total) + "."
      );
    });

    // Recalculate fare estimate on date changes.
    function updateBookingEstimate() {
      var estimate = calculateBookingEstimate();
      if (bookingDays) {
        bookingDays.textContent = String(estimate.days);
      }
      if (bookingTotal) {
        bookingTotal.textContent = formatCurrency(estimate.total);
      }
    }

    // Computes total days and fare using daily rate and selected date range.
    function calculateBookingEstimate() {
      var dailyPrice = Number(bookingDailyPriceInput ? bookingDailyPriceInput.value : 0);
      var pickupDate = pickupDateInput ? pickupDateInput.value : "";
      var dropoffDate = dropoffDateInput ? dropoffDateInput.value : "";

      if (!pickupDate || !dropoffDate) {
        return { days: 0, total: 0 };
      }

      var start = new Date(pickupDate);
      var end = new Date(dropoffDate);
      var oneDayMs = 24 * 60 * 60 * 1000;
      var diffDays = Math.floor((end - start) / oneDayMs) + 1;

      if (isNaN(diffDays) || diffDays < 1) {
        return { days: 0, total: 0 };
      }

      return {
        days: diffDays,
        total: diffDays * dailyPrice
      };
    }

    // Shows Bootstrap toast after successful booking.
    function showBookingToast(message) {
      if (!bookingSuccessToast || !bookingToastMessage) {
        return;
      }

      bookingToastMessage.textContent = message;
      var toastInstance = bootstrap.Toast.getOrCreateInstance(bookingSuccessToast);
      toastInstance.show();
    }
  }

  // Generates star markup (full/half/empty) from decimal rating.
  function buildStarsMarkup(rating) {
    var fullStars = Math.floor(rating);
    var hasHalfStar = rating - fullStars >= 0.5;
    var emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    var stars = '<span class="rating-stars" aria-hidden="true">';

    for (var i = 0; i < fullStars; i++) {
      stars += '<i class="bi bi-star-fill"></i>';
    }
    if (hasHalfStar) {
      stars += '<i class="bi bi-star-half"></i>';
    }
    for (var j = 0; j < emptyStars; j++) {
      stars += '<i class="bi bi-star"></i>';
    }

    stars += "</span>";
    return stars;
  }

  // Extracts numeric daily price from a display string like NPR 5,200/day.
  function extractPriceValue(priceText) {
    var normalized = String(priceText || "").replace(/[^\d]/g, "");
    return normalized ? Number(normalized) : 0;
  }

  // Currency formatter for INR values.
  function formatCurrency(amount) {
    return "NPR " + Number(amount || 0).toLocaleString("en-IN");
  }

  // Returns today's date in YYYY-MM-DD for date input min attributes.
  function getTodayISODate() {
    var currentDate = new Date();
    var month = String(currentDate.getMonth() + 1).padStart(2, "0");
    var day = String(currentDate.getDate()).padStart(2, "0");
    return currentDate.getFullYear() + "-" + month + "-" + day;
  }

  // Improves date input accessibility by opening the native picker on click/keyboard when supported.
  function enhanceDatePickerAccessibility(dateInput) {
    if (!dateInput || dateInput.tagName !== "INPUT" || dateInput.type !== "date") {
      return;
    }

    function tryShowPicker() {
      if (typeof dateInput.showPicker === "function") {
        try {
          dateInput.showPicker();
        } catch (error) {
          // Some browsers restrict showPicker; fallback to focus keeps native behavior available.
          dateInput.focus();
        }
      }
    }

    dateInput.addEventListener("click", tryShowPicker);
    dateInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
        tryShowPicker();
      }
    });
  }

  // Collapses mobile navbar after selecting a navigation link.
  function collapseNavbarOnMobile() {
    var navbarCollapseEl = document.getElementById(SELECTORS.navbarCollapse);
    if (!navbarCollapseEl) {
      return;
    }

    if (!navbarCollapseEl.classList.contains("show")) {
      return;
    }

    var collapseInstance = bootstrap.Collapse.getOrCreateInstance(navbarCollapseEl);
    collapseInstance.hide();
  }

  // Membership modal behavior and signup form validation handling.
  function initializeJoinModalBehavior() {
    var joinModalEl = document.getElementById(SELECTORS.joinModal);
    if (!joinModalEl) {
      return;
    }

    var joinForm = document.getElementById(SELECTORS.joinForm);
    var planSelect = document.getElementById(SELECTORS.memberPlan);
    var nameInput = document.getElementById(SELECTORS.memberName);
    var triggerButtons = document.querySelectorAll(SELECTORS.joinModalTriggers);

    triggerButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (!planSelect) {
          return;
        }

        var labelText = (button.getAttribute("aria-label") || "").toLowerCase();

        if (labelText.includes("basic")) {
          planSelect.value = "basic";
        } else if (labelText.includes("premium")) {
          planSelect.value = "premium";
        } else if (labelText.includes("elite")) {
          planSelect.value = "elite";
        }
      });
    });

    joinModalEl.addEventListener("shown.bs.modal", function () {
      if (nameInput) {
        nameInput.focus();
      }
    });

    joinModalEl.addEventListener("hidden.bs.modal", function () {
      if (joinForm) {
        joinForm.reset();
      }
    });

    if (joinForm) {
      joinForm.addEventListener("submit", function (event) {
        if (!joinForm.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();

          var modalInstance = bootstrap.Modal.getInstance(joinModalEl);
          if (modalInstance) {
            modalInstance.hide();
          }
        }

        joinForm.classList.add("was-validated");
      });
    }
  }

})();
