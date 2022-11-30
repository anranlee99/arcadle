import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css';
import { getUser } from '../../utilities/users-service'
import AuthPage from '../AuthPage/AuthPage'
import WordlePage from '../WordlePage/WordlePage'
import NavBar from '../../components/NavBar/NavBar'
import LeaderboardPage from '../Leaderboard/LeaderboardPage';
export default function App() {
  const [user, setUser] = useState(getUser())

  return (
    <div className="App">
      { user ? 
        <>
          <NavBar user={user} setUser={setUser} />
          <Routes>
            <Route path="/wordle" element={<WordlePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
          
        </>
        :
        <AuthPage setUser={setUser}/>
      }
    </div>
  );
}


