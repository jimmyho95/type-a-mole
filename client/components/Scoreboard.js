import React, { useEffect, useState } from 'react';

const Scoreboard = () => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        fetch('/api/scores')
            .then(res => res.json())
            .then(data => setScores(data.topScores))
            .catch(err => console.error('Error fetching scores: ', err));
    }, []);

    return (
        <div className="scoreboard">
            <ul>
                {scores.map((score, index) => (
                    <li key={score._id || index}>
                        <strong>{score.player}:</strong> {score.score} pts ({score.wpm} wpm)
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Scoreboard;