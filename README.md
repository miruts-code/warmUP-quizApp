# warmUP-quizApp

A timed practice quiz built with React where players choose a difficulty and category, answer questions against the clock, and receive a complete review of their answers at the end. 

you can try the app here [warmUp-quiz](https://warm-up-quiz-app.vercel.app/)

# Features

- Name and email validation before starting the quiz
- Difficulty and category selection
- 15-second countdown timer for every question
- Automatic timer reset for each new question
- Keyboard shortcuts (`1`–`4`) for answering questions
- Immediate visual feedback for correct and incorrect answers
- Final results page with score summary and complete answer review
- Built using conditional rendering instead of React Router for a simple linear application flow

---

# Technologies Used

- React
- JavaScript (ES6+)
- HTML5
- CSS3
- Vite

---

# Project Structure

```text
warmUP-quizApp/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── quizScreen.css
│   │   ├── quizScreen.jsx
│   │   ├── resultScreen.css
│   │   ├── resultScreen.jsx
│   │   ├── startScreen.css
│   │   └── startScreen.jsx
│   │
│   ├── data/
│   │   └── questions.js
│   │
│   ├── hooks/
│   │   └── useTimer.js
│   │
│   ├── utils/
│   │   └── helpers.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

The project is organized so that each folder has a single responsibility. User interface components are kept separate from reusable logic, helper functions, and application data, making the codebase easier to understand, maintain, and extend.

---

# How the Quiz Works

The application contains **45 questions**, with five questions available for each combination of difficulty (**Easy**, **Medium**, and **Hard**) and category (**Science**, **History**, and **General Knowledge**).

When a player starts a quiz, the application:

1. Filters the question bank according to the selected difficulty and category.
2. Randomly shuffles the matching questions.
3. Selects five questions for the current quiz session.
4. displays a review summary upon completion of the quiz.

Player information, selected questions, answers, timer state, and score are managed in `App.jsx` and passed to child components through props.

---

# Getting Started

Clone the repository:

```bash
git clone https://github.com/miruts-code/warmUP-quizApp.git
```

Move into the project directory:

```bash
cd warmUP-quizApp
```

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

