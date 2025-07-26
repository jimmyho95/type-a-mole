import React from "react";

function DifficultySelector({ difficulty, onChange }) {
    const difficulties = ["noob", "mid", "heroic", "legendary"];

    return (
        <div className="difficulty-options">
            <label className="difficulty-label">Select Difficulty:</label>
            <div className="difficulty-buttons">
                {difficulties.map((level) => (
                    <button
                        key={level}
                        className={`difficulty-btn ${level} ${difficulty === level ? "active" : ""
                            }`}
                        onClick={() => onChange({ target: { value: level } })}
                    >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default DifficultySelector;
