import React, { useEffect, useState } from 'react';
import DifficultySelector from './DifficultySelector';
import GameBoard from './GameBoard';
import Leaderboard from './Leaderboard';
import WordListSelector from './WordListSelector';

function GameContainer() {
    const [difficulty, setDifficulty] = useState('mid');
    const [currentScore, setScore] = useState(0);
    const [selectedList, setSelectedList] = useState('defaultWords');
    const [availableLists, setAvailableLists] = useState([]);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const res = await fetch('/api/words/lists');
                const data = await res.json();
                setAvailableLists(data);
                if (!data.includes(selectedList)) setSelectedList(data[0]);
            } catch (err) {
                console.error('failed to fetch available word lists:', err);
            }
        };
        fetchLists();
    }, []);

    return (
        <div className="game-container">
            <DifficultySelector
                difficulty={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
            />
            <WordListSelector
                selectedList={selectedList}
                onChange={setSelectedList}
                wordLists={availableLists}
            />
            <GameBoard 
                difficulty={difficulty}
                currentScore={currentScore}
                setScore={setScore}
                selectedList={selectedList}
            />
            <Leaderboard/>
        </div>
    )
}

export default GameContainer;