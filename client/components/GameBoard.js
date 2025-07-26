import React, { useState, useEffect, useRef } from "react";

// Updated timeout calculation system
const DIFFICULTY = {
    noob: { base: 2000, perChar: 300 },    // 2s + 300ms per character
    mid: { base: 1500, perChar: 200 },     // 1.5s + 200ms per character  
    heroic: { base: 1200, perChar: 150 },  // 1.2s + 150ms per character
    legendary: { base: 1000, perChar: 100 } // 1s + 100ms per character
};

function GameBoard({ difficulty, currentScore, setScore, selectedList }) {
    const [activeWord, setActiveWord] = useState(""); //active word
    const [wordList, setWordList] = useState([]);
    const [position, setPosition] = useState({ top: "0%", left: "0%" }); //active word position
    const [typedLetters, setTypedLetters] = useState([]); //user input
    const intervalRef = useRef(null); //current interval ref
    const [isGameActive, setIsGameActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [playerName, setPlayerName] = useState("");
    const gameAreaRef = useRef(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [flashType, setFlashType] = useState(null); // 'success' or 'fail'
    const finalScoreRef = useRef(0);
    const finalWpmRef = useRef(0);

    // Function to trigger flash effect
    const triggerFlash = (type) => {
        setFlashType(type);
        setTimeout(() => setFlashType(null), 300); // Flash duration
    };

    // Function to calculate timeout based on word length and difficulty
    const calculateTimeout = (word, difficulty) => {
        const config = DIFFICULTY[difficulty];
        return config.base + (word.length * config.perChar);
    };

    //load word list
    useEffect(() => {
        const fetchWords = async () => {
            try {
                const res = await fetch(`/api/words/list?list=${selectedList}`);
                const data = await res.json();
                setWordList(data);
            } catch (err) {
                console.error("Failed to load word list:", err);
            }
        };

        fetchWords();
    }, [selectedList]);

    //word list selected, restart game when wordList is updated
    useEffect(() => {
        if (!wordList.length || (!isGameActive && !isGameOver)) return;

        // Reset everything when a new list is loaded
        clearInterval(intervalRef.current);
        setIsGameActive(false);
        setIsGameOver(false);
        setActiveWord("");
        setTypedLetters([]);
        setTimeLeft(30);
        setScore(0);
        startGame();
        console.log(`Switched to list: ${selectedList}, word count: ${wordList.length}`);
    }, [wordList]); // Changed from selectedList to wordList

    // Reset game when difficulty changes
    useEffect(() => {
        if (!isGameActive && !isGameOver) return;

        // Reset everything when difficulty changes
        clearInterval(intervalRef.current);
        setIsGameActive(false);
        setIsGameOver(false);
        setActiveWord("");
        setTypedLetters([]);
        setTimeLeft(30);
        setScore(0);
        startGame();
        console.log(`Switched to difficulty: ${difficulty}`);
    }, [difficulty]);

    //update ref whenever currentScore changes
    useEffect(() => {
        finalScoreRef.current = currentScore;
        finalWpmRef.current = currentScore * 2;
    }, [currentScore]);

    //start game
    const startGame = () => {
        setIsGameActive(true);
        setTimeLeft(30);
        generateWord();
        startInterval();

        setTimeout(() => {
            gameAreaRef.current?.focus();
        }, 0);
    };

    //stop game manually
    const stopGame = () => {
        clearInterval(intervalRef.current);
        setIsGameActive(false);
        setActiveWord("");
        setTypedLetters([]);
        setTimeLeft(30);
        // Don't reset score so player can see their progress
    };

    //end game
    const endGame = async () => {
        setIsGameActive(false);
        setIsGameOver(true);
        clearInterval(intervalRef.current);

        const finalScore = finalScoreRef.current;
        const finalWpm = finalScore * 2;

        try {
            console.log("Submitting score: ", {
                player: playerName,
                score: finalScore,
                wpm: finalWpm,
                difficulty,
            });
            await fetch("/api/scores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    player: playerName,
                    score: finalScore,
                    wpm: finalWpm,
                    difficulty: difficulty,
                }),
            });
        } catch (err) {
            console.error("Failed to post score:", err);
        }
    };

    //timer
    useEffect(() => {
        if (!isGameActive) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isGameActive]);

    // Updated generateWord function
    const generateWord = () => {
        if (!wordList.length) return;

        const randIndex = Math.floor(Math.random() * wordList.length);
        const word = wordList[randIndex];
        const top = Math.floor(Math.random() * 80) + 5;
        const left = Math.floor(Math.random() * 80) + 5;

        setActiveWord(word.toLowerCase());
        setPosition({ top: `${top}%`, left: `${left}%` });
        setTypedLetters([]);

        // Clear existing interval and start new one with word-specific timeout
        clearInterval(intervalRef.current);
        const timeout = calculateTimeout(word.toLowerCase(), difficulty);
        intervalRef.current = setTimeout(() => {
            // Word timed out - trigger red flash
            triggerFlash('fail');
            generateWord();
        }, timeout);
    };

    // Updated startInterval function (now starts first word)
    const startInterval = () => {
        generateWord(); // This will set its own timeout
    };

    // Updated handleWordComplete function
    const handleWordComplete = () => {
        // Count actual words (split by spaces and filter out empty strings)
        const wordCount = activeWord.split(' ').filter(word => word.length > 0).length;
        setScore((prev) => prev + wordCount);
        triggerFlash('success'); // Green flash for success
        clearInterval(intervalRef.current);
        generateWord(); // This will set its own timeout
    };

    //event listener
    const handleKeyDown = (e) => {
        const key = e.key;

        //if delete key pressed
        if (key === "Backspace") {
            setTypedLetters((prev) => prev.slice(0, -1));
            return;
        }

        //input tracking
        if (/^[a-zA-Z ]$/.test(key)) {
            const nextIndex = typedLetters.length;
            const expectedChar = activeWord[nextIndex];
            const updated = [...typedLetters, key];

            if (key === expectedChar) {
                setTypedLetters(updated);

                if (updated.join("") === activeWord) {
                    console.log("Correct! +1 point");
                    handleWordComplete();
                }
            } else {
                console.log("Incorrect letter!");
                setTypedLetters(updated);
            }
        }
    };

    const renderColoredWord = (word, input) => {
        return word.split("").map((char, index) => {
            let className = "untyped-letter";

            if (typedLetters[index] !== undefined) {
                if (typedLetters[index] === char) {
                    className = "correct-letter";
                } else {
                    className = "incorrect-letter";
                }
            }
            return (
                <span key={index} className={className}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div
            ref={gameAreaRef}
            className={`game-area ${flashType === 'success' ? 'flash-success' : flashType === 'fail' ? 'flash-fail' : ''}`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {/* Always visible score tracker - bottom left */}
            <div className="score-tracker">
                <span className="score">Score: {currentScore}</span>
            </div>

            {/* Stop button - top right during active game */}
            {isGameActive && (
                <button 
                    className="stop-btn"
                    onClick={stopGame}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        zIndex: 100
                    }}
                >
                    Stop
                </button>
            )}

            {/* Timer in separate element - bottom right */}
            {isGameActive && (
                <div className="timer">Time Left: {timeLeft}s</div>
            )}

            {isGameOver ? (
                <div className="end-screen">
                    <h2>Game Over</h2>
                    <p>
                        <strong>{playerName}</strong>
                    </p>
                    <p>Score: {currentScore}</p>
                    <p>WPM: {currentScore * 2}</p>
                    <button
                        onClick={() => {
                            setIsGameOver(false);
                            setScore(0);
                            setPlayerName("");
                            setTimeLeft(30);
                            setIsGameActive(false);
                            setPlayerName("");
                        }}
                    >
                        Play Again
                    </button>
                </div>
            ) : !isGameActive ? (
                <div className="start-screen">
                    <input
                        className="name-input"
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && playerName.trim()) {
                                startGame();
                            }
                        }}
                        placeholder="Enter your name"
                    />
                </div>
            ) : (
                <>
                    {/* Active game - show floating words */}
                    {activeWord && (
                        <div className="floating-word" style={position}>
                            {renderColoredWord(activeWord, typedLetters)}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default GameBoard;