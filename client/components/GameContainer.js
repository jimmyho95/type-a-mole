import React, { useState } from 'react';
import DifficultySelector from './DifficultySelector';
import GameBoard from './GameBoard';
import Scoreboard from './Scoreboard';

function GameContainer() {
    const [difficulty, setDifficulty] = useState('medium');
    const [currentScore, setScore] = useState(0);

    return (
        <div className="game-container">
            <DifficultySelector
            difficulty={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            />
            <Scoreboard score={currentScore}/>
            <GameBoard 
                difficulty={difficulty}
                currentScore={currentScore}
                setScore={setScore}
            />
        </div>
    )
}

export default GameContainer;