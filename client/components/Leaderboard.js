import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
    const [scores, setScores] = useState({ topScores: [], recentScores: [] });
    const [activeTab, setActiveTab] = useState('top');

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const res = await fetch('/api/scores');
                const data = await res.json();
                setScores(data);
            } catch (err) {
                console.error('failed to fetch leaderboard data: ', err)
            }
        };
        fetchScores();
    }, []);

    const renderRows = (scoreList) => {
        return scoreList.map((entry, index) => (
            <tr key={entry._id || index}>
                <td>{index + 1}</td>
                <td>{entry.player}</td>
                <td>{entry.score}</td>
                <td>{entry.wpm}</td>
                <td>{entry.difficulty}</td>
            </tr>
        ));
    };

    return (
        <div className="leaderboard">
            <div className="tabs">
                <button className={activeTab === 'top' ? 'active' : ''} onClick={() => setActiveTab('top')}>
                    Top Scores
                </button>
                <button className={activeTab === 'recent' ? 'active' : ''} onClick={() => setActiveTab('recent')}>
                    Recent Scores
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th>Score</th>
                        <th>WPM</th>
                        <th>Difficulty</th>
                    </tr>
                </thead>
                <tbody>
                    {activeTab ==='top'
                        ? renderRows(scores.topScores)
                        : renderRows(scores.recentScores)}
                </tbody>
            </table>
        </div>
    )
}

export default Leaderboard;