import React from 'react';
import Scoreboard from './components/Scoreboard';
import GameContainer from './components/GameContainer';
import './styles.css'

function App() {
    return (
        <div className="app-container">
            <div className="app">
                <h1>Type-A-Mole</h1>
                <GameContainer />
            </div>
        </div>
    )
}

export default App;