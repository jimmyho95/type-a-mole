import React from "react";

const levels = ['noob', 'mid', 'heroic', 'legendary']

function DifficultySelector( {difficulty, onChange}) {

    return (
        <div className="difficulty-options">
            <div className="options">
                {levels.map(level => (
                    <button
                        key={level}
                        className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                        onClick={() => onChange({ target: { value: level } })}
                        >
                        {level}
                    </button>
                    ))}
            </div>
        </div>
    );
}

export default DifficultySelector;