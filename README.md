# CaloriCurve Web

A modern AI calorie tracker built with HTML/CSS/JS. It includes a nutrition calculator, AI food logging, and AI-powered suggestions. Food data and advice are fetched from the backend service.

## Features

- Firebase-authenticated UI (login/signup image avatar handling)
- Nutrition calculator that computes calories, macros, and key micronutrients
- Food logging with backend lookups (`/api/food`)
- Gemini-powered diet suggestions and tips on `nutrients.html` (`/api/advice`)
- Responsive design with animations (AOS)
- Daily auto-reset of logged foods

## Technologies

- HTML5
- CSS3
- JavaScript (DOM, `fetch`, localStorage)

## Local Development

- Static server: in `caloricurve-web` run `python -m http.server 8000` and open `http://localhost:8000/index.html`.
- To use a local backend, update `API_BASE` to `http://localhost:5000` in `app.js` and `nutrients.html`.

## Usage Flow

- Open `main.html`, enter your details, and run the calculator.
- Search and add foods; totals are saved in `localStorage` (`mealsFull`, `totals`).
- Open `nutrients.html` and click `View Plan` or `Get Tips` to get tailored suggestions based on what you ate and your goals.

## Folder Overview

```
caloricurve-web/
├── assets/              # Images and icons
├── index.html           # Landing
├── login.html           # Login
├── signup.html          # Signup
├── main.html            # Calculator + food logging
├── nutrients.html       # AI suggestions page
├── app.js               # Frontend logic
├── index.css, main.css, nutrients.css
└── README.md
```

## Notes

- Gemini advice requires the backend to be configured with `GEMINI_API_KEY`.
- If the Render backend is waking up, the first request may take longer.

#

Made with ❤️ by Abid Khan
