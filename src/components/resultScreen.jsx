import './resultScreen.css';
function ResultScreen({ learnerName, finalAnswers, onRestart }) {

    const score = finalAnswers.filter((a) => a.correct).length;
    const total = finalAnswers.length;
    const percentage = Math.round((score / total) * 100);
    function Message(pct) {
        if (pct >= 80)
            return "Outstanding! You crushed it.";
        if (pct >= 60)
            return 'Well done.'
        if (pct >= 40)
            return "Not bad. room to grow";
       return "Keep practicing! you will get there";
    }
    return (
      <div className="results-card">
        <h2 className="results-heading">Nice work, {learnerName}!</h2>
        <p className="score-display">
          {score}/{total} <span className="score-sub">({percentage}%)</span>
        </p>
        <p className="message">{Message(percentage)}</p>

        <h3 className="review-heading">Review</h3>
        <div className="review-list">
          {finalAnswers.map((a, i) => (
            <div key={i} className="review-item">
              <p className="review-question">
                {i + 1}. {a.question.question}
              </p>
              {a.correct ? (
                <p className="review-answer correct">
                  {"\u2713"} Correct:{" "}
                  {a.question.options[a.question.correctIndex]}
                </p>
              ) : a.timeOut ? (
                <p className="review-answer timeout">
                  {"\u23F1"} Time's up — correct answer:{" "}
                  {a.question.options[a.question.correctIndex]}
                </p>
              ) : (
                <p className="review-answer incorrect">
                  {"\u2717"} You picked "{a.question.options[a.selectedIndex]}"
                  — correct: {a.question.options[a.question.correctIndex]}
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

export default ResultScreen;
