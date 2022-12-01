import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css';
import { getUser } from '../../utilities/users-service'
import AuthPage from '../AuthPage/AuthPage'
import WordlePage from '../WordlePage/WordlePage'
import SurvivlePage from '../Survivle/SurvivlePage';
import NavBar from '../../components/NavBar/NavBar'
import LeaderboardPage from '../Leaderboard/LeaderboardPage';

import Header from '../../components/Header/Header'
export default function App() {
  const [user, setUser] = useState(getUser())

  return (
    <div className="App">
      
      { user ? 
        <div className='App-container'>
          
          <NavBar user={user} setUser={setUser} />
          <Routes>
            <Route path="/wordle" element={<WordlePage />} />
            <Route path="/survivle" element={<SurvivlePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/" element={<Navigate to="/wordle" />} />
          </Routes>
          
        </div>
        :
        <AuthPage setUser={setUser}/>
      }
    </div>
  );
}


