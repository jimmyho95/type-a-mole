import React, { useState, useEffect, useRef } from 'react';

const WORDS = ['apple', 'banana', 'cat', 'dog', 'egg', 'fire', 'giant', 'hippo']
const DIFFICULTY = {
    dev: 100000,
    easy: 7000,
    medium: 4000,
    hard: 2500,
    extreme: 1000,
}

function GameBoard({ difficulty, currentScore, setScore }) {
    const [activeWord, setActiveWord] = useState(''); //active word
    const [position, setPosition] = useState({ top: '0%', left: '0%'}); //active word position
    const [typedLetters, setTypedLetters] = useState([]); //user input
    const intervalRef = useRef(null); //current interval ref
    
    //generate word
    const generateWord = () => {
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        const top = Math.floor(Math.random()*80)+5
        const left = Math.floor(Math.random()*80)+5

        setActiveWord(word);
        setPosition({ top: `${top}%`, left: `${left}%`});
        setTypedLetters([]);
    };

    //fix for words being skipped
    const startInterval = () => {
        const delay = DIFFICULTY[difficulty];
        intervalRef.current = setInterval(generateWord, delay);
    }

    //rebuild interval
    const handleWordComplete = () => {
        setScore(prev => prev + 1);
        clearInterval(intervalRef.current);
        generateWord();
        startInterval();
    }

    //generateWord useEffect
    useEffect(() => {
        generateWord();

        const stopInterval = () => clearInterval(interval);
        return stopInterval;
    }, [difficulty]);


    //event listener
    const handleKeyDown = (e) => {
        const key = e.key;

        //if delete key pressed
        if (key === "Backspace") {
            setTypedLetters((prev) => prev.slice(0, -1));
            return;
         }

        //input tracking
        if (/^[a-zA-Z]$/.test(key)) {
            const nextIndex = typedLetters.length;
            const expectedChar = activeWord[nextIndex];
            const updated = [...typedLetters, key];

            if (key === expectedChar) {
                setTypedLetters(updated);

                if (updated.join('') === activeWord) {
                    console.log('Correct! +1 point');
                    handleWordComplete();
                }
            } else {
                console.log('Incorrect letter!');
                setTypedLetters(updated);
            }
        }
    };

    const renderColoredWord = (word, input) => {
        return word.split('').map((char, index) => {
            let className = 'untyped-letter';

            if (typedLetters[index] !== undefined) {
                if (typedLetters[index] === char) {
                    className = 'correct-letter';
                } else {
                    className = 'incorrect-letter'
                }
            }
            return (
                <span key = {index} className = {className}>
                    {char}
                </span>
            )
        })
    }

    return (
        <div className="game-area"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        >
            {activeWord && (
                <div className="floating-word" style={position}>
                    {renderColoredWord(activeWord, typedLetters)}
                    </div>
            )}
        </div>
    )
}

export default GameBoard;