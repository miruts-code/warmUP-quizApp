import { useState, useEffect } from "react";
import useTimer from "../hooks/useTimer";
import { QUESTION_TIME } from "../data/questions";
import "./quizScreen.css";
function QuizScreen({ quizQuestions, onFinish, onQuit }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selected, setSelected] = useState(null)
    const [locked, setLocked] = useState(false);
    const [answers, setAnswers] = useState([])
    const currentQuestion = quizQuestions[currentIndex];
    function recordAndAdvance(selectedIndex, timeOut) {
        const correct = selectedIndex === currentQuestion.correctIndex;
        const entry = { question: currentQuestion, selectedIndex, correct, timeOut };
        setAnswers((prev) => [...prev, entry]);
        setLocked(true);
        setTimeout(() => {
            if (currentIndex + 1 < quizQuestions.length) {
                setCurrentIndex((i) => i + 1);
                setSelected(null);
                setLocked(false);
            }
            else {
                onFinish([...answers, entry]);
              
            }
        }, 900);
    }
    function handleExpire() {
        if (locked) return;
        recordAndAdvance(null, true)
    }
    const timeLeft = useTimer(QUESTION_TIME, handleExpire, currentIndex);
    function handleSelect(index) {
        if (locked) return;
        setSelected(index)
        recordAndAdvance(index, false);
    }
    useEffect(() => {
        function onKeyDown(e) {
            const num = parseInt(e.key, 10);
            if (num >= 1 && num <= 4) handleSelect(num - 1);
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [locked, currentIndex]);
    function handleQuit() {
        if (window.confirm('quit the quiz? your progress will be lost.'))
            onQuit();
    }
    return (
        <div className="quiz-card">
            <div className="quiz-header">
                <span>Question{currentIndex + 1} of {quizQuestions.length}</span>
                <button onClick={handleQuit} className="quit-btn">Quit</button>
            </div>
            <div className="progress-track">
                <div className="progress-fill"
                    style={{ width: `${(currentIndex / quizQuestions.length)*100}%` }} />
            </div>
            <div className="meta-row">
                <span className="catagory-tag">{currentQuestion.category}</span>
                <span className={`timer ${timeLeft <= 5 ? 'timer-warning' : ''}`}>{timeLeft}s</span>
            </div>
            <h1 className="question-text">{currentQuestion.question}</h1>
            <div className="options-list">{currentQuestion.options.map((opt, i) => {
                let stateClass = '';
                if (locked) {
                    if (i === currentQuestion.correctIndex) stateClass = 'correct-option';
                    else if (i === selected) stateClass = "incorrect-option";
                    else stateClass = "neutral-option";
                }
                return (<button
                    key={i}
                    disabled={locked}
                    onClick={() => handleSelect(i)}
                    className={`option-btn ${stateClass}`}
                >
                    <span className="option-number">{i + 1}.</span>{opt}
                </button>
                );
            })}
            </div>
        </div>
    );
}
 export  default QuizScreen