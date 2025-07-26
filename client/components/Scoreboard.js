import React from 'react';

function Scoreboard({ score }) {
    return (
        <div className="score-board">
            <h2>Score</h2>
            <div className="score-value">{score}</div>
        </div>
    )
}

export default Scoreboard;