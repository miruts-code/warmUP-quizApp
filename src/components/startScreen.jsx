import { useState } from "react";
import { CATEGORIES, DIFFICULTIES } from '../data/questions'
import { isValidEmail } from '../utils/helpers';
import './startScreen.css'
function StartScreen({ onStart }) {
    const[name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [difficulty, setDifficulty] = useState('easy')
    const [category, setCategory] = useState('Any')
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('')
    
    function handleProceed() {
        let hasError = false;
        if (!name.trim()) {
            setError('plese enter your name to start.')
            hasError = true;
        }
        if (!email.trim() || !isValidEmail(email.trim())) {
            setEmailError("plese enter a valid email");
            hasError = true;
        }
      if (hasError) return;
      onStart({ name:name.trim(), email:email.trim(), difficulty, category });
    }
        return (
          <div className="card">
            <h1 className="start-title">Warm-Up Quiz</h1>
            <p className="start-subtitle">
              Test your knowledge across science, history, and more.
            </p>
            <label htmlFor="name" className="label">
              Your name
            </label>
            <input
              type="text"
              id="name"
              className={`text-input ${error ? "input-error" : ""}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Miruts"
            />
            {error && <p className="error-text"> {error} </p>}
            <label htmlFor="email" className="label">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              className={`text-input ${emailError ? "input-error" : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              placeholder="e.g. Miruts1552@gmail.com"
            />
            {emailError && <p className="error-text"> {emailError} </p>}
            <label className="label">Difficulty</label>
            <div className="difficulty-group">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={()=>setDifficulty(d)}
                  className={`difficulty-btn ${difficulty === d ? "active" : ""}`}
                >
                  {d}
                </button>
              ))}
            </div>
            <label className="label">Category</label>
            <select
                  value={category}
                  onChange={(e)=>setCategory(e.target.value)}
                  className='select-input'
                >
                    {CATEGORIES.map((c) => 
                        <option key={c}>{c}</option>    
                    )}
                </select>
                <button className="start-quiz-btn" onClick={handleProceed}>
            StartQiuz</button>
            
          </div>
        );
}
export default StartScreen;