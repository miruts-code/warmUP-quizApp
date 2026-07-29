import { useState, useEffect, useRef } from "react";
import "./QuizApp.css";

/* ------------------------------------------------------------------ */
/*  DATA — hardcoded question bank (no API needed for this project)   */
/* ------------------------------------------------------------------ */
const QUESTIONS = [
  {
    id: 1,
    category: "Science",
    difficulty: "easy",
    question: "What planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctIndex: 1,
  },
  {
    id: 2,
    category: "Science",
    difficulty: "easy",
    question: "What gas do plants absorb from the air?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"],
    correctIndex: 2,
  },
  {
    id: 3,
    category: "History",
    difficulty: "easy",
    question: "In which year did World War II end?",
    options: ["1943", "1945", "1948", "1950"],
    correctIndex: 1,
  },
  {
    id: 4,
    category: "General Knowledge",
    difficulty: "easy",
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
  },
  {
    id: 5,
    category: "Science",
    difficulty: "medium",
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctIndex: 2,
  },
  {
    id: 6,
    category: "History",
    difficulty: "medium",
    question: "Who was the first President of the United States?",
    options: ["Jefferson", "Washington", "Adams", "Lincoln"],
    correctIndex: 1,
  },
  {
    id: 7,
    category: "General Knowledge",
    difficulty: "medium",
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctIndex: 3,
  },
  {
    id: 8,
    category: "Science",
    difficulty: "medium",
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Body"],
    correctIndex: 2,
  },
  {
    id: 9,
    category: "History",
    difficulty: "hard",
    question: "The Treaty of Westphalia ended which war?",
    options: [
      "Hundred Years' War",
      "Thirty Years' War",
      "Napoleonic Wars",
      "Franco-Prussian War",
    ],
    correctIndex: 1,
  },
  {
    id: 10,
    category: "Science",
    difficulty: "hard",
    question: "What particle has no electric charge?",
    options: ["Proton", "Electron", "Neutron", "Positron"],
    correctIndex: 2,
  },
  {
    id: 11,
    category: "General Knowledge",
    difficulty: "hard",
    question: "Which country has the most time zones?",
    options: ["Russia", "USA", "France", "China"],
    correctIndex: 2,
  },
  {
    id: 12,
    category: "History",
    difficulty: "hard",
    question: "Who was the last Pharaoh of Egypt?",
    options: ["Nefertiti", "Cleopatra VII", "Ramses II", "Tutankhamun"],
    correctIndex: 1,
  },
];

const CATEGORIES = ["Any", "Science", "History", "General Knowledge"];
const DIFFICULTIES = ["easy", "medium", "hard"];
const QUESTION_TIME = 15; // seconds per question
const QUIZ_LENGTH = 6; // how many questions per round

/* ------------------------------------------------------------------ */
/*  CUSTOM HOOK — useTimer                                            */
/*  Encapsulates a countdown that resets whenever `resetKey` changes  */
/*  (we pass the current question index as resetKey, so a new         */
/*  question automatically gets a fresh timer).                       */
/* ------------------------------------------------------------------ */
function useTimer(seconds, onExpire, resetKey) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire; // always call the latest handler, avoid stale closures

  useEffect(() => {
    setTimeLeft(seconds);
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval); // cleanup — prevents leaked intervals
  }, [resetKey, seconds]);

  useEffect(() => {
    if (timeLeft === 0) onExpireRef.current();
  }, [timeLeft]);

  return timeLeft;
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function tierMessage(pct) {
  if (pct >= 80) return "Outstanding! You crushed it.";
  if (pct >= 60) return "Solid work — nicely done.";
  if (pct >= 40) return "Not bad, room to grow.";
  return "Keep practicing — you'll get there.";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* ------------------------------------------------------------------ */
/*  START SCREEN                                                       */
/* ------------------------------------------------------------------ */
function StartScreen({ onStart }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [category, setCategory] = useState("Any");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  function handleSubmit() {
    let hasError = false;
    if (!name.trim()) {
      setError("Please enter your name to start.");
      hasError = true;
    }
    if (!email.trim() || !isValidEmail(email.trim())) {
      setEmailError("Please enter a valid email.");
      hasError = true;
    }
    if (hasError) return;
    onStart({ name: name.trim(), email: email.trim(), difficulty, category });
  }

  return (
    <div className="card start-card">
      <h1 className="app-title">Trivia Challenge</h1>
      <p className="app-subtitle">
        Test your knowledge across science, history, and more.
      </p>

      <label className="field-label">Your name</label>
      <input
        className={`text-input ${error ? "input-error" : ""}`}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError("");
        }}
        placeholder="e.g. Miruts"
      />
      {error && <p className="error-text">{error}</p>}

      <label className="field-label">Your email</label>
      <input
        type="email"
        className={`text-input ${emailError ? "input-error" : ""}`}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError("");
        }}
        placeholder="e.g. miruts@example.com"
      />
      {emailError && <p className="error-text">{emailError}</p>}

      <label className="field-label">Difficulty</label>
      <div className="difficulty-group">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`difficulty-btn ${difficulty === d ? "active" : ""}`}
          >
            {d}
          </button>
        ))}
      </div>

      <label className="field-label">Category</label>
      <select
        className="select-input"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {CATEGORIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <button onClick={handleSubmit} className="primary-btn">
        Start Quiz
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  QUIZ SCREEN                                                         */
/* ------------------------------------------------------------------ */
function QuizScreen({ quizQuestions, onFinish, onQuit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = quizQuestions[currentIndex];

  function recordAndAdvance(selectedIndex, timedOut) {
    const correct = selectedIndex === currentQuestion.correctIndex;
    const entry = {
      question: currentQuestion,
      selectedIndex,
      correct,
      timedOut,
    };
    setAnswers((prev) => [...prev, entry]);
    setLocked(true);
    setTimeout(() => {
      if (currentIndex + 1 < quizQuestions.length) {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
        setLocked(false);
      } else {
        onFinish([...answers, entry]);
      }
    }, 900);
  }

  function handleExpire() {
    if (locked) return; // already answered right as the clock hit zero
    recordAndAdvance(null, true);
  }

  const timeLeft = useTimer(QUESTION_TIME, handleExpire, currentIndex);

  function handleSelect(index) {
    if (locked) return;
    setSelected(index);
    recordAndAdvance(index, false);
  }

  // keyboard shortcuts: 1-4 select an answer
  useEffect(() => {
    function onKeyDown(e) {
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 4) handleSelect(num - 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [locked, currentIndex]);

  function handleQuit() {
    if (window.confirm("Quit the quiz? Your progress will be lost.")) onQuit();
  }

  return (
    <div className="card">
      <div className="quiz-header-row">
        <span>
          Question {currentIndex + 1} of {quizQuestions.length}
        </span>
        <button onClick={handleQuit} className="quit-btn">
          Quit
        </button>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${(currentIndex / quizQuestions.length) * 100}%` }}
        />
      </div>

      <div className="meta-row">
        <span className="category-tag">{currentQuestion.category}</span>
        <span className={`timer ${timeLeft <= 5 ? "timer-warning" : ""}`}>
          {timeLeft}s
        </span>
      </div>

      <h2 className="question-text">{currentQuestion.question}</h2>

      <div className="options-list">
        {currentQuestion.options.map((opt, i) => {
          let stateClass = "";
          if (locked) {
            if (i === currentQuestion.correctIndex)
              stateClass = "option-correct";
            else if (i === selected) stateClass = "option-incorrect";
            else stateClass = "option-neutral";
          }
          return (
            <button
              key={i}
              disabled={locked}
              onClick={() => handleSelect(i)}
              className={`option-btn ${stateClass}`}
            >
              <span className="option-number">{i + 1}.</span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  RESULTS SCREEN                                                      */
/* ------------------------------------------------------------------ */
function ResultsScreen({ playerName, finalAnswers, onRestart }) {
  const score = finalAnswers.filter((a) => a.correct).length;
  const total = finalAnswers.length;
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="card">
      <h2 className="results-heading">Nice work, {playerName}!</h2>
      <p className="score-display">
        {score}/{total} <span className="score-sub">({percentage}%)</span>
      </p>
      <p className="tier-message">{tierMessage(percentage)}</p>

      <h3 className="review-heading">Review</h3>
      <div className="review-list">
        {finalAnswers.map((a, i) => (
          <div key={i} className="review-item">
            <p className="review-question">
              {i + 1}. {a.question.question}
            </p>
            {a.correct ? (
              <p className="review-answer correct">✓ Correct</p>
            ) : a.timedOut ? (
              <p className="review-answer timeout">
                ⏱ Time's up — correct answer:{" "}
                {a.question.options[a.question.correctIndex]}
              </p>
            ) : (
              <p className="review-answer incorrect">
                ✗ You picked "{a.question.options[a.selectedIndex]}" — correct:{" "}
                {a.question.options[a.question.correctIndex]}
              </p>
            )}
          </div>
        ))}
      </div>

      <button onClick={onRestart} className="restart-btn">
        Play Again
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APP — top-level state machine switching between the 3 "pages"      */
/* ------------------------------------------------------------------ */
export default function App() {
  const [page, setPage] = useState("start"); // 'start' | 'quiz' | 'results'
  const [playerName, setPlayerName] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [finalAnswers, setFinalAnswers] = useState([]);

  function handleStart({ name, difficulty, category }) {
    let pool = QUESTIONS.filter((q) => q.difficulty === difficulty);
    if (category !== "Any") pool = pool.filter((q) => q.category === category);
    if (pool.length < QUIZ_LENGTH)
      pool = QUESTIONS.filter((q) => q.difficulty === difficulty); // fallback if filter too narrow

    setPlayerName(name);
    setQuizQuestions(shuffle(pool).slice(0, QUIZ_LENGTH));
    setPage("quiz");
  }

  function handleFinish(answers) {
    setFinalAnswers(answers);
    setPage("results");
  }

  function handleRestart() {
    setPage("start");
    setQuizQuestions([]);
    setFinalAnswers([]);
  }

  return (
    <div className="app-container">
      {page === "start" && <StartScreen onStart={handleStart} />}
      {page === "quiz" && (
        <QuizScreen
          quizQuestions={quizQuestions}
          onFinish={handleFinish}
          onQuit={handleRestart}
        />
      )}
      {page === "results" && (
        <ResultsScreen
          playerName={playerName}
          finalAnswers={finalAnswers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
