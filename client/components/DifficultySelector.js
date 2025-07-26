import React from "react";

function DifficultySelector( {difficulty, onChange}) {

    return (
        <div className="difficulty-selector">
            <label htmlFor="difficulty">Difficulty: </label>
            <select id="difficulty" onChange={onChange}
                value={difficulty}>
                <option value="dev">Dev</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="extreme">Extreme</option>

            </select>
        </div>
    );
}

export default DifficultySelector;