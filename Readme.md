# CAR Rental

A modern, frontend-only car rental website concept focused on fast browsing, membership plans, and a clean booking experience.

## Overview

Car rental is a static web project built with HTML, CSS, JavaScript, and Bootstrap. It showcases a car rental service landing page with categorized vehicle listings, pricing plans, interactive modals, and theme support.

This project is ideal as a portfolio frontend project and can be extended with backend APIs for real bookings and authentication.

## Features

- Responsive, mobile-friendly UI (Bootstrap 5)
- Hero section with call-to-actions
- Membership pricing plans (Basic, Premium, Elite)
- Car listings grouped by category:
  - SUVs
  - Sports Cars
  - Super Cars
- Join Membership modal with form fields
- Car Details modal
- Booking modal with:
  - user details
  - pickup/drop-off date selection
  - pickup location
  - estimated days and total price preview
- Booking success toast notifications
- Light/Dark theme toggle
- Separate login and registration pages
- About page with project information

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Bootstrap 5.3
- Bootstrap Icons
- Font Awesome

## Project Structure

```text
CAR RENTAL/
├── index.html
├── about.html
├── login.html
├── register.html
├── css/
│   ├── about.css
│   ├── index.css
│   ├── login.css
│   └── register.css
├── images/
├── js/
│   ├── auth.js
│   ├── main.js
│   └── theme.js
└── README.md
```

## Getting Started

### 1) Clone the repository

```bash
git clone https://github.com/<your-username>/car rental.git
cd car rental
```

### 2) Open the project

Since this is a static frontend project, you can run it directly in a browser:

- Open `index.html` manually, or
- Use a local development server (recommended, e.g. VS Code Live Server)

### 3) Start exploring

- Home page: `index.html`
- Login page: `login.html`
- Register page: `register.html`
- About page: `about.html`

## Future Improvements

- Integrate backend for real authentication and booking storage
- Add payment gateway integration
- Add admin dashboard for fleet and booking management
- Add search, filter, and sorting for cars
- Connect booking data to a database

## License

This project is currently for educational and portfolio use.

If you want, you can add an MIT License file before publishing.

## Author

Nishan Adhikari
