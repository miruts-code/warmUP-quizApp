import {useState} from 'react'
import StartScreen from "./components/startScreen";
import './App.css'
function App() {
  const [page, setPage] = useState('start')
  function handleStart(startData) {
    
  }
  return (
    <div className="app-container">
      {page==='start'&& <StartScreen onStart={handleStart}/>}
    </div>
  )
}
export default App;
