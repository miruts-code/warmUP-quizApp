import {useState} from 'react'
import StartScreen from "./components/startScreen";
import QuizScreen from './components/quizScreen';
import ResultsScreen from './components/resultScreen';
import { QUESTIONS, QUIZ_LENGTH } from './data/questions';
import Shuffle from './utils/helpers';
import './App.css'
function App() {
  const [page, setPage] = useState('start')
  const [learnerName, setLearnerName] = useState('')
  const [learnerEmail, setLearnerEmail] = useState('')
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [finalAnswers,setFinalAnswers]=useState([])
  
  function handleStart({ name, email, difficulty, category }) {
    console.log("Received in App:", { name, email, difficulty, category });
    let pool = QUESTIONS.filter((q) => q.difficulty === difficulty);
    console.log("Pool after difficulty filter:", pool.length);
    if (category !== 'Any')
      pool = pool.filter((q) => q.category === category)
    
    if (pool.length < QUIZ_LENGTH) {
      pool=QUESTIONS.filter((q)=>q.difficulty===difficulty)
    }
  
    setLearnerName(name)
    setLearnerEmail(email)
    setQuizQuestions(Shuffle(pool).slice(0, QUIZ_LENGTH))
    setPage('quiz')
  }
  function handleQuit() {
    setPage('start');
  }
  function handleFinish(finalAnswers) {
    setFinalAnswers(finalAnswers)
    setPage('results');
  }
  function handleRestart() {
    setPage('start')
  }
  return (
    <div className="app-container">
      {page === "start" && <StartScreen onStart={handleStart} />}
      {page === "quiz" && (
        <QuizScreen
          quizQuestions={quizQuestions}
          onFinish={handleFinish}
          onQuit={handleQuit}
        />
      )}
      {page === "results" && (
        <ResultsScreen
          learnerName={learnerName}
          finalAnswers={finalAnswers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
export default App;
